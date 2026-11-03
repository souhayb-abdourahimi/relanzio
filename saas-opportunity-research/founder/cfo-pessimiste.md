# Unit economics: Preuvio — scénario pessimiste (nouveaux/mois [0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3], churn 5%)

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
- **Profit margin at your plan** (19 a day): **46%** of every sale, after every cost.

## Year 1, month by month

| month | client-moiss a day | revenue | profit | cumulative (after $1,800 startup) |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 0 | $0 | -$250 | -$2,050 |
| 2 | 0 | $0 | -$250 | -$2,300 |
| 3 | 1 | $33 | -$222 | -$2,522 |
| 4 | 2 | $63 | -$196 | -$2,718 |
| 5 | 4 | $129 | -$140 | -$2,858 |
| 6 | 6 | $188 | -$89 | -$2,947 |
| 7 | 7 | $244 | -$41 | -$2,988 |
| 8 | 10 | $330 | $32 | -$2,955 |
| 9 | 12 | $412 | $103 | -$2,852 |
| 10 | 15 | $492 | $171 | -$2,681 |
| 11 | 17 | $564 | $233 | -$2,448 |
| 12 | 19 | $637 | $295 | -$2,153 |

- **Year 1 operating profit: -$353** on $3,092 of revenue.
- After the $1,800 startup spend: -$2,153.
- Startup money earned back: not within year 1.
- Cash you need before it pays for itself: **$2,988**.

## What if

| scenario | margin at plan | break-even a day | year 1 profit |
| --- | ---: | ---: | ---: |
| Base plan | 46% | 9 | -$353 |
| Price -10% | 40% | 11 | -$662 |
| Volume -20% | 37% | 9 | -$882 |
| Unit costs +15% | 44% | 10 | -$420 |

## Red flags

- Year 1 loses money on operations (-$353).
- The startup spend is not earned back within year 1.
