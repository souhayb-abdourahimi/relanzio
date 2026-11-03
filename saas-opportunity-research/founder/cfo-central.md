# Unit economics: Preuvio — scénario central (nouveaux/mois [0, 0, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10], churn 3%)

Every number below comes from the input file. Nothing is looked up or guessed.

## One client-mois

| line | per client-mois |
| --- | ---: |
| Price | $33.00 |
| IA (classement de pièces, génération de procédures) | -$1.00 |
| Hébergement + stockage fichiers (Supabase) | -$1.00 |
| Frais Stripe (~1,5 % + 0,25 €) | -$0.75 |
| Support (temps valorisé) | -$2.00 |
| **Contribution** (what each client-mois leaves to pay the fixed costs) | **$28.25** (86%) |

## The margin that matters

Fixed costs: $250 a month (Outils SaaS (Brevo, Supabase base, domaine, monitoring) $80, Assurance RC pro + comptabilité $90, Prospection (enrichissement e-mails, outil d'envoi) $80).

- **Break-even: 9 client-moiss a day.** Below that you lose money every month.
- **Profit margin at your plan** (65 a day): **74%** of every sale, after every cost.

## Year 1, month by month

| month | client-moiss a day | revenue | profit | cumulative (after $1,800 startup) |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 0 | $0 | -$250 | -$2,050 |
| 2 | 0 | $0 | -$250 | -$2,300 |
| 3 | 3 | $99 | -$165 | -$2,465 |
| 4 | 7 | $228 | -$55 | -$2,520 |
| 5 | 12 | $386 | $81 | -$2,440 |
| 6 | 17 | $574 | $242 | -$2,198 |
| 7 | 24 | $785 | $422 | -$1,776 |
| 8 | 31 | $1,026 | $629 | -$1,147 |
| 9 | 39 | $1,294 | $857 | -$290 |
| 10 | 48 | $1,584 | $1,106 | $816 |
| 11 | 57 | $1,868 | $1,349 | $2,165 |
| 12 | 65 | $2,142 | $1,583 | $3,748 |

- **Year 1 operating profit: $5,548** on $9,986 of revenue.
- After the $1,800 startup spend: $3,748.
- Startup money earned back: month 10.
- Cash you need before it pays for itself: **$2,520**.

## What if

| scenario | margin at plan | break-even a day | year 1 profit |
| --- | ---: | ---: | ---: |
| Base plan | 74% | 9 | $5,548 |
| Price -10% | 71% | 11 | $4,550 |
| Volume -20% | 71% | 9 | $3,839 |
| Unit costs +15% | 72% | 10 | $5,333 |

No red flags in these numbers. They are only as good as the inputs: check every cost against a real quote.
