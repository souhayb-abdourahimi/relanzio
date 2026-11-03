# Unit economics: Preuvio — scénario favorable (nouveaux/mois [0, 0, 5, 8, 10, 12, 14, 16, 18, 20, 22, 24], churn 2%)

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
- **Profit margin at your plan** (139 a day): **80%** of every sale, after every cost.

## Year 1, month by month

| month | client-moiss a day | revenue | profit | cumulative (after $1,800 startup) |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 0 | $0 | -$250 | -$2,050 |
| 2 | 0 | $0 | -$250 | -$2,300 |
| 3 | 5 | $165 | -$109 | -$2,409 |
| 4 | 13 | $426 | $114 | -$2,294 |
| 5 | 23 | $746 | $388 | -$1,906 |
| 6 | 34 | $1,129 | $716 | -$1,190 |
| 7 | 48 | $1,568 | $1,092 | -$98 |
| 8 | 63 | $2,066 | $1,518 | $1,421 |
| 9 | 79 | $2,617 | $1,990 | $3,411 |
| 10 | 98 | $3,224 | $2,510 | $5,921 |
| 11 | 118 | $3,887 | $3,078 | $8,999 |
| 12 | 139 | $4,600 | $3,688 | $12,687 |

- **Year 1 operating profit: $14,487** on $20,427 of revenue.
- After the $1,800 startup spend: $12,687.
- Startup money earned back: month 8.
- Cash you need before it pays for itself: **$2,409**.

## What if

| scenario | margin at plan | break-even a day | year 1 profit |
| --- | ---: | ---: | ---: |
| Base plan | 80% | 9 | $14,487 |
| Price -10% | 78% | 11 | $12,444 |
| Volume -20% | 79% | 9 | $10,989 |
| Unit costs +15% | 78% | 10 | $14,046 |

No red flags in these numbers. They are only as good as the inputs: check every cost against a real quote.
