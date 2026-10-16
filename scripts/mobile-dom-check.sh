#!/bin/sh
set -eu
export TZ=Europe/Paris

npm run dev:client -- --host 127.0.0.1 >/tmp/relanzio-mobile-vite.log 2>&1 &
VITE_PID=$!
cleanup(){ kill "$VITE_PID" >/dev/null 2>&1 || true; }
trap cleanup EXIT INT TERM

ready=0
for i in $(seq 1 30); do
  if wget -q -O /dev/null http://127.0.0.1:5173/mobile-fixture.html; then ready=1; break; fi
  sleep 1
done
if [ "$ready" -ne 1 ]; then cat /tmp/relanzio-mobile-vite.log; echo "Browser QA: Vite fixture did not start" >&2; exit 1; fi

CHROME="$(command -v chromium-browser || command -v chromium || true)"
if [ -z "$CHROME" ]; then echo "Browser QA: Chromium is not installed" >&2; exit 1; fi

MOBILE_SIZES="320,568 360,800 375,812 390,844 393,852 412,915 430,932"
ALL_SIZES="$MOBILE_SIZES 768,1024 1280,900 1440,900"

for size in $MOBILE_SIZES; do
  "$CHROME" --headless --no-sandbox --disable-gpu --window-size="$size" --virtual-time-budget=5000     --dump-dom 'http://127.0.0.1:5173/mobile-fixture.html?qa=1' >/tmp/relanzio-mobile-dom.html 2>/tmp/relanzio-chromium.log
  grep -q 'data-mobile-qa="pass"' /tmp/relanzio-mobile-dom.html || { cat /tmp/relanzio-mobile-dom.html; echo "Mobile navigation QA failed at $size" >&2; exit 1; }
done
echo "Mobile navigation QA PASS: 320x568 360x800 375x812 390x844 393x852 412x915 430x932"

for route in login signup; do
  for size in $MOBILE_SIZES; do
    "$CHROME" --headless --no-sandbox --disable-gpu --window-size="$size" --virtual-time-budget=4000 \
      --dump-dom "http://127.0.0.1:5173/$route?qa=1" >/tmp/relanzio-auth-dom.html 2>/tmp/relanzio-auth-chromium.log
    grep -q 'data-auth-qa="pass"' /tmp/relanzio-auth-dom.html || { cat /tmp/relanzio-auth-dom.html; echo "Auth DOM QA failed for $route at $size" >&2; exit 1; }
  done
done
echo "Auth mobile DOM QA PASS: login/signup across all required mobile widths"

for route in pricing docs faq contact legal privacy dpa terms; do
  for size in 390,844 1280,900; do
    "$CHROME" --headless --no-sandbox --disable-gpu --window-size="$size" --virtual-time-budget=5000 \
      --dump-dom "http://127.0.0.1:5173/$route?qa=1" >/tmp/relanzio-public-dom.html 2>/tmp/relanzio-public-chromium.log
    grep -q 'data-public-qa="pass"' /tmp/relanzio-public-dom.html || { cat /tmp/relanzio-public-dom.html; echo "Public route QA failed for $route at $size" >&2; exit 1; }
  done
done
echo "Public/legal route DOM QA PASS: pricing docs faq contact legal privacy dpa terms at 390x844 and 1280x900"

for size in $ALL_SIZES; do
  "$CHROME" --headless --no-sandbox --disable-gpu --window-size="$size" --virtual-time-budget=5000     --dump-dom 'http://127.0.0.1:5173/plans-fixture.html?qa=1' >/tmp/relanzio-plans-dom.html 2>/tmp/relanzio-plans-chromium.log
  grep -q 'data-plans-qa="pass"' /tmp/relanzio-plans-dom.html || { cat /tmp/relanzio-plans-dom.html; echo "Plans DOM QA failed at $size" >&2; exit 1; }
done

"$CHROME" --headless --no-sandbox --disable-gpu --window-size=390,844 --virtual-time-budget=5000   --dump-dom 'http://127.0.0.1:5173/plans-fixture.html?qa=1&trial=1&billing=1' >/tmp/relanzio-plans-trial-dom.html 2>/tmp/relanzio-plans-chromium.log
grep -q 'data-plans-qa="pass"' /tmp/relanzio-plans-trial-dom.html || { cat /tmp/relanzio-plans-trial-dom.html; echo "Plans active-trial DOM QA failed" >&2; exit 1; }

"$CHROME" --headless --no-sandbox --disable-gpu --window-size=390,844 --virtual-time-budget=5000   --dump-dom 'http://127.0.0.1:5173/plans-fixture.html?qa=1&eligible=1' >/tmp/relanzio-plans-eligible-dom.html 2>/tmp/relanzio-plans-chromium.log
grep -q 'data-plans-qa="pass"' /tmp/relanzio-plans-eligible-dom.html || { cat /tmp/relanzio-plans-eligible-dom.html; echo "Plans trial-eligibility DOM QA failed" >&2; exit 1; }
grep -q 'data-trial-clicks="1"' /tmp/relanzio-plans-eligible-dom.html || { cat /tmp/relanzio-plans-eligible-dom.html; echo "Trial CTA click QA failed" >&2; exit 1; }
echo "Plans DOM QA PASS: all required mobile sizes, tablet, 1280x900, 1440x900; free/pro/trial states verified"

for size in $ALL_SIZES; do
  "$CHROME" --headless --no-sandbox --disable-gpu --window-size="$size" --virtual-time-budget=6000     --dump-dom 'http://127.0.0.1:5173/quote-fixture.html?qa=1' >/tmp/relanzio-quote-dom.html 2>/tmp/relanzio-quote-chromium.log
  grep -q 'data-quote-qa="pass"' /tmp/relanzio-quote-dom.html || { cat /tmp/relanzio-quote-dom.html; echo "Quote editor DOM QA failed at $size" >&2; exit 1; }
done
echo "Quote editor DOM QA PASS: all required mobile sizes, tablet and desktop; mobile cards/custom date/no follow-up/modal/touch/overflow verified"

for mode in support settings; do
  for size in $MOBILE_SIZES; do
    "$CHROME" --headless --no-sandbox --disable-gpu --window-size="$size" --virtual-time-budget=4000 \
      --dump-dom "http://127.0.0.1:5173/aux-mobile-fixture.html?mode=$mode" >/tmp/relanzio-aux-dom.html 2>/tmp/relanzio-aux-chromium.log
    grep -q 'data-aux-qa="pass"' /tmp/relanzio-aux-dom.html || { cat /tmp/relanzio-aux-dom.html; echo "Aux mobile QA failed for $mode at $size" >&2; exit 1; }
  done
done
echo "Support/settings mobile DOM QA PASS: all required mobile sizes, controls and overflow verified"

for size in 390,844 1280,900; do
  "$CHROME" --headless --no-sandbox --disable-gpu --window-size="$size" --virtual-time-budget=5000     --dump-dom 'http://127.0.0.1:5173/trial-fixture.html?qa=1' >/tmp/relanzio-trial-dom.html 2>/tmp/relanzio-trial-chromium.log
  grep -q 'data-trial-qa="pass"' /tmp/relanzio-trial-dom.html || { cat /tmp/relanzio-trial-dom.html; echo "Trial DOM QA failed at $size" >&2; exit 1; }
done
echo "Trial DOM QA PASS: 390x844 and 1280x900"

"$CHROME" --headless --no-sandbox --disable-gpu --hide-scrollbars --window-size=390,844 --virtual-time-budget=2500   --screenshot=/tmp/relanzio-quotes-390.png 'http://127.0.0.1:5173/quote-fixture.html' >/tmp/relanzio-quote-shot.log 2>&1
echo "Quote mobile visual proof: sha256=$(sha256sum /tmp/relanzio-quotes-390.png | cut -d' ' -f1)"

for count in 3 15 50 100; do
  "$CHROME" --headless --no-sandbox --disable-gpu --window-size=1280,900 --virtual-time-budget=7000 \
    --dump-dom "http://127.0.0.1:5173/p0-fixture.html?qa=1&count=$count" >/tmp/relanzio-p0-dom.html 2>/tmp/relanzio-p0-chromium.log
  grep -q 'data-p0-qa="pass"' /tmp/relanzio-p0-dom.html || { cat /tmp/relanzio-p0-dom.html; echo "P0 Today load QA failed with $count quotes" >&2; exit 1; }
  RENDER_MS="$(sed -n 's/.*data-render-ms="\([0-9][0-9]*\)".*/\1/p' /tmp/relanzio-p0-dom.html | head -1)"
  echo "P0 Today load QA PASS at 1280x900; quotes=$count; render_ms=$RENDER_MS"
done
for size in 390,844 412,915; do
  "$CHROME" --headless --no-sandbox --disable-gpu --window-size="$size" --virtual-time-budget=7000 \
    --dump-dom 'http://127.0.0.1:5173/p0-fixture.html?qa=1&count=100' >/tmp/relanzio-p0-dom.html 2>/tmp/relanzio-p0-chromium.log
  grep -q 'data-p0-qa="pass"' /tmp/relanzio-p0-dom.html || { cat /tmp/relanzio-p0-dom.html; echo "P0 Today mobile QA failed at $size" >&2; exit 1; }
  RENDER_MS="$(sed -n 's/.*data-render-ms="\([0-9][0-9]*\)".*/\1/p' /tmp/relanzio-p0-dom.html | head -1)"
  echo "P0 Today mobile QA PASS at $size; fixture100_render_ms=$RENDER_MS"
done

for size in 390,844 412,915; do
  "$CHROME" --headless --no-sandbox --disable-gpu --window-size="$size" --virtual-time-budget=5000 \
    --dump-dom 'http://127.0.0.1:5173/?qa=1' >/tmp/relanzio-landing-mobile-dom.html 2>/tmp/relanzio-landing-mobile-chromium.log
  grep -q 'data-public-qa="pass"' /tmp/relanzio-landing-mobile-dom.html || { cat /tmp/relanzio-landing-mobile-dom.html; echo "Landing mobile connection QA failed at $size" >&2; exit 1; }
done
echo "P0 landing mobile Connexion QA PASS: 390x844 412x915"
