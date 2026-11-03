# Unit economics: Preuvio — scénario central (nouveaux/mois [0, 0, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10], churn 3%) + rémunération fondateur 2 000 €/mois

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

Fixed costs: $2,250 a month (Outils SaaS (Brevo, Supabase base, domaine, monitoring) $80, Assurance RC pro + comptabilité $90, Prospection (enrichissement e-mails, outil d'envoi) $80, Rémunération fondateur (coût d'opportunité, HYPOTHÈSE) $2,000).

- **Break-even: 80 client-moiss a day.** Below that you lose money every month.
- **Profit margin at your plan** (65 a day): **-19%** of every sale, after every cost.

## Year 1, month by month

| month | client-moiss a day | revenue | profit | cumulative (after $1,800 startup) |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 0 | $0 | -$2,250 | -$4,050 |
| 2 | 0 | $0 | -$2,250 | -$6,300 |
| 3 | 3 | $99 | -$2,165 | -$8,465 |
| 4 | 7 | $228 | -$2,055 | -$10,520 |
| 5 | 12 | $386 | -$1,919 | -$12,440 |
| 6 | 17 | $574 | -$1,758 | -$14,198 |
| 7 | 24 | $785 | -$1,578 | -$15,776 |
| 8 | 31 | $1,026 | -$1,371 | -$17,147 |
| 9 | 39 | $1,294 | -$1,143 | -$18,290 |
| 10 | 48 | $1,584 | -$894 | -$19,184 |
| 11 | 57 | $1,868 | -$651 | -$19,835 |
| 12 | 65 | $2,142 | -$417 | -$20,252 |

- **Year 1 operating profit: -$18,452** on $9,986 of revenue.
- After the $1,800 startup spend: -$20,252.
- Startup money earned back: not within year 1.
- Cash you need before it pays for itself: **$20,252**.

## What if

| scenario | margin at plan | break-even a day | year 1 profit |
| --- | ---: | ---: | ---: |
| Base plan | -19% | 80 | -$18,452 |
| Price -10% | -33% | 91 | -$19,450 |
| Volume -20% | -46% | 80 | -$20,161 |
| Unit costs +15% | -22% | 82 | -$18,667 |

## Red flags

- Year 1 loses money on operations (-$18,452).
- The startup spend is not earned back within year 1.
