#!/usr/bin/env bash
# Kernel-level egress filter for the lab runner (iptables / ip6tables), applied AFTER every download/install and
# BEFORE any lab secret is exposed. It complements the DNS sinkhole of production hosts (/etc/hosts), which alone
# is not an isolation: a process could use an IP address directly, another resolver, or another port.
#
# What it enforces, for the runner itself AND for Docker containers:
#   - allowed: loopback, private networks (local Supabase containers, Docker bridges), the Azure platform
#     addresses the runner needs, DNS (53), and outbound TCP 443 (Stripe API, Stripe Checkout, GitHub);
#   - everything else is REJECTED: SMTP (25/465/587), IMAP/POP (143/993/110/995), PostgreSQL (5432/6543, so no
#     direct connection to any hosted database), HTTP (80), and any other port, IPv4 and IPv6.
# What it does NOT enforce: HTTPS (443) is open to the Internet, because Stripe and its Checkout page use many
# hosts behind shared CDNs. Production HTTPS endpoints are covered by the DNS sinkhole and, above all, by the
# absence of any production credential in the lab (see lab/README.md, "Ce que l'isolation garantit").
set -euo pipefail

apply_v4() {
  local chain=LAB_EGRESS
  iptables -N "$chain" 2>/dev/null || iptables -F "$chain"
  iptables -A "$chain" -o lo -j ACCEPT
  iptables -A "$chain" -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
  for net in 127.0.0.0/8 10.0.0.0/8 172.16.0.0/12 192.168.0.0/16 168.63.129.16/32 169.254.169.254/32; do
    iptables -A "$chain" -d "$net" -j ACCEPT
  done
  iptables -A "$chain" -p udp --dport 53 -j ACCEPT
  iptables -A "$chain" -p tcp --dport 53 -j ACCEPT
  iptables -A "$chain" -p tcp --dport 443 -j ACCEPT
  iptables -A "$chain" -j REJECT
  iptables -C OUTPUT -j "$chain" 2>/dev/null || iptables -I OUTPUT 1 -j "$chain"

  # Containers (forwarded traffic). Private destinations stay open: the Supabase containers talk to each other.
  local cchain=LAB_EGRESS_DOCKER
  iptables -N "$cchain" 2>/dev/null || iptables -F "$cchain"
  iptables -A "$cchain" -m conntrack --ctstate ESTABLISHED,RELATED -j RETURN
  for net in 127.0.0.0/8 10.0.0.0/8 172.16.0.0/12 192.168.0.0/16; do iptables -A "$cchain" -d "$net" -j RETURN; done
  iptables -A "$cchain" -p udp --dport 53 -j RETURN
  iptables -A "$cchain" -p tcp --dport 53 -j RETURN
  iptables -A "$cchain" -p tcp --dport 443 -j RETURN
  iptables -A "$cchain" -j REJECT
  iptables -N DOCKER-USER 2>/dev/null || true
  iptables -C DOCKER-USER -j "$cchain" 2>/dev/null || iptables -I DOCKER-USER 1 -j "$cchain"
}

apply_v6() {
  local chain=LAB_EGRESS6
  ip6tables -N "$chain" 2>/dev/null || ip6tables -F "$chain"
  ip6tables -A "$chain" -o lo -j ACCEPT
  ip6tables -A "$chain" -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
  ip6tables -A "$chain" -d fe80::/10 -j ACCEPT
  ip6tables -A "$chain" -p udp --dport 53 -j ACCEPT
  ip6tables -A "$chain" -p tcp --dport 443 -j ACCEPT
  ip6tables -A "$chain" -j REJECT
  ip6tables -C OUTPUT -j "$chain" 2>/dev/null || ip6tables -I OUTPUT 1 -j "$chain"
}

verify() {
  local failed=0
  # Ports that must be closed even towards a host that normally answers on them.
  for target in smtp.gmail.com:587 smtp.gmail.com:465 imap.gmail.com:993 1.1.1.1:80; do
    host=${target%:*}; port=${target#*:}
    if timeout 6 bash -c "exec 3<>/dev/tcp/$host/$port" 2>/dev/null; then echo "EGRESS_FIREWALL_LEAK $target reachable"; failed=1
    else echo "EGRESS_FIREWALL_BLOCKED $target"; fi
  done
  # The production hosts are sunk by /etc/hosts; check they do not resolve to a routable address.
  for host in relanzio.com uwgvnhnpvxoebabayqac.supabase.co relanzio-production.up.railway.app api.brevo.com; do
    addr=$(getent ahosts "$host" | awk 'NR==1{print $1}')
    case "$addr" in ""|0.0.0.0|::|127.*|::1) echo "EGRESS_SINKHOLE_OK $host" ;; *) echo "EGRESS_SINKHOLE_LEAK $host -> $addr"; failed=1 ;; esac
  done
  # Stripe must stay reachable over HTTPS.
  if timeout 10 bash -c 'exec 3<>/dev/tcp/api.stripe.com/443' 2>/dev/null; then echo "EGRESS_STRIPE_OK api.stripe.com:443"; else echo "EGRESS_STRIPE_UNREACHABLE"; failed=1; fi
  return $failed
}

# Before the firewall: the same targets, to show that the blocks measured afterwards come from the firewall.
baseline() {
  for target in smtp.gmail.com:587 smtp.gmail.com:465 imap.gmail.com:993 1.1.1.1:80; do
    host=${target%:*}; port=${target#*:}
    if timeout 6 bash -c "exec 3<>/dev/tcp/$host/$port" 2>/dev/null; then echo "EGRESS_BASELINE_REACHABLE $target"; else echo "EGRESS_BASELINE_UNREACHABLE $target"; fi
  done
}

case "${1:-apply}" in
  baseline) baseline ;;
  apply) apply_v4; apply_v6; echo "EGRESS_FIREWALL_APPLIED"; iptables -S LAB_EGRESS; iptables -S LAB_EGRESS_DOCKER; verify ;;
  verify) verify ;;
  *) echo "usage: $0 [baseline|apply|verify]"; exit 2 ;;
esac
