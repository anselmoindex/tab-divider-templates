# Free printable tab divider templates

Printable PDF templates for index tab dividers, in every standard cut, with the tab positions measured from production dies rather than drawn by eye. Letter, legal, hanging (bottom) tabs, numbered exhibit sets and estate planning binder sets. Free to use, change and share under CC BY 4.0. The scripts that draw them are MIT licensed.

Published by **Tabzoola** ([tabzoola.com](https://tabzoola.com)). Tabzoola (Tabzoola LLC) is the sister company of Anselmo Die & Index, with the same owner, John Anselmo. Tabzoola sells custom index tabs at tabzoola.com, and every order is made at the Anselmo Die & Index plant in Schaumburg, Illinois.

## How to print them so the tabs line up

1. Print at **100% / Actual Size**, never "Fit to page". Scaling walks every tab off its outline.
2. Use **index stock or cardstock** (90 lb index is the production standard), not copy paper.
3. Set the page size to **letter** (or legal for the legal templates), not A4, with zero margins.
4. Print one test sheet and hold it against a blank tab sheet of the same cut before running the rest.

## Letter size (8.5 x 11, finished sheet 9 x 11)

Tabs run down the 11-inch edge over a 10-inch working length. Each tab extends 0.5 inch past the page.

| Cut | Tabs per bank | Tab height | File |
|---|---|---|---|
| 1/3 | 3 | 3.33" | [PDF](templates/letter/tabzoola-tab-template-1-3-cut.pdf) |
| 1/4 | 4 | 2.50" | [PDF](templates/letter/tabzoola-tab-template-1-4-cut.pdf) |
| 1/5 | 5 | 2.00" | [PDF](templates/letter/tabzoola-tab-template-1-5-cut.pdf) |
| 1/6 | 6 | 1.67" | [PDF](templates/letter/tabzoola-tab-template-1-6-cut.pdf) |
| 1/7 | 7 | 1.43" | [PDF](templates/letter/tabzoola-tab-template-1-7-cut.pdf) |
| 1/8 | 8 | 1.25" | [PDF](templates/letter/tabzoola-tab-template-1-8-cut.pdf) |
| 1/9 | 9 | 1.11" | [PDF](templates/letter/tabzoola-tab-template-1-9-cut.pdf) |
| 1/10 | 10 | 1.00" | [PDF](templates/letter/tabzoola-tab-template-1-10-cut.pdf) |

## Legal size (8.5 x 14, finished sheet 9 x 14)

Tabs run down the 14-inch edge over a 13-inch working length, so every tab is taller than the same cut on letter.

| Cut | Tabs per bank | Tab height | File |
|---|---|---|---|
| 1/5 | 5 | 2.60" | [PDF](templates/legal/tabzoola-legal-tab-template-1-5-cut.pdf) |
| 1/6 | 6 | 2.17" | [PDF](templates/legal/tabzoola-legal-tab-template-1-6-cut.pdf) |
| 1/8 | 8 | 1.62" | [PDF](templates/legal/tabzoola-legal-tab-template-1-8-cut.pdf) |
| 1/10 | 10 | 1.30" | [PDF](templates/legal/tabzoola-legal-tab-template-1-10-cut.pdf) |

All four legal cuts in one file: [templates/legal/tabzoola-legal-tab-templates-all.pdf](templates/legal/tabzoola-legal-tab-templates-all.pdf)

## Hanging (bottom) tabs (11 x 8.5 landscape, finished 11 x 9)

The sheet is bound or drilled on the top 11-inch edge and the tabs hang below the bottom edge.

| Cut | Tabs per bank | Tab width | File |
|---|---|---|---|
| 1/3 | 3 | 3.33" | [PDF](templates/hanging/tabzoola-hanger-tab-template-1-3-cut.pdf) |
| 1/4 | 4 | 2.50" | [PDF](templates/hanging/tabzoola-hanger-tab-template-1-4-cut.pdf) |
| 1/5 | 5 | 2.00" | [PDF](templates/hanging/tabzoola-hanger-tab-template-1-5-cut.pdf) |
| 1/6 | 6 | 1.67" | [PDF](templates/hanging/tabzoola-hanger-tab-template-1-6-cut.pdf) |
| 1/7 | 7 | 1.43" | [PDF](templates/hanging/tabzoola-hanger-tab-template-1-7-cut.pdf) |
| 1/8 | 8 | 1.25" | [PDF](templates/hanging/tabzoola-hanger-tab-template-1-8-cut.pdf) |
| 1/9 | 9 | 1.11" | [PDF](templates/hanging/tabzoola-hanger-tab-template-1-9-cut.pdf) |
| 1/10 | 10 | 1.00" | [PDF](templates/hanging/tabzoola-hanger-tab-template-1-10-cut.pdf) |
| 1/12 | 12 | 0.83" | [PDF](templates/hanging/tabzoola-hanger-tab-template-1-12-cut.pdf) |

## Exhibit tab sets

One separator page per exhibit, with a centered court-style label and the staggered 1/8-cut tab position: [1-25](templates/exhibit/tabzoola-exhibit-tabs-1-25.pdf), [26-50](templates/exhibit/tabzoola-exhibit-tabs-26-50.pdf), [51-75](templates/exhibit/tabzoola-exhibit-tabs-51-75.pdf), [76-100](templates/exhibit/tabzoola-exhibit-tabs-76-100.pdf), [101-125](templates/exhibit/tabzoola-exhibit-tabs-101-125.pdf), [126-150](templates/exhibit/tabzoola-exhibit-tabs-126-150.pdf), [A-Z](templates/exhibit/tabzoola-exhibit-tabs-a-z.pdf).

## Estate planning binder sets

One separator page per section, in the order a family reads the binder: [6-tab simple will set](templates/estate/tabzoola-estate-planning-tabs-6-set.pdf), [8-tab attorney set](templates/estate/tabzoola-estate-planning-tabs-8-set.pdf), [12-tab living trust set](templates/estate/tabzoola-estate-planning-tabs-12-set.pdf).

## Binder capacity chart

What each ring size from 1/2 inch to 5 inches really holds, round ring and D-ring, on three paper weights: [templates/tabzoola-binder-capacity-chart.pdf](templates/tabzoola-binder-capacity-chart.pdf).

## Terms

- **Cut:** how many tab positions share one edge. A 1/5 cut has five tabs per bank.
- **Bank:** one full run of tab positions from top to bottom. A 10-tab set on a 1/5 cut is two banks.
- **Extension:** how far the tab sticks out past the page, 0.5 inch on these templates.

## Regenerating the templates

```
cd generator
npm install
npm run build   # writes every PDF to generator/out
```

The cut lists and geometry are constants at the top of each script.

## When printing your own stops making sense

Home-printed tabs have no reinforcement on the tab, which is where tabs tear, and alignment drifts from sheet to sheet on a desktop printer. That is fine for one or two binders. For identical sets in quantity, Tabzoola prints them with your titles, with clear or colored Mylar on every tab, collated and punched, from a 25-set minimum, priced instantly at [tabzoola.com/configure/paper](https://tabzoola.com/configure/paper) with a free PDF proof first.

More free tools from the same publisher: [tabzoola.com/templates](https://tabzoola.com/templates). Published prices as open data: [anselmoindex/custom-index-tab-prices](https://github.com/anselmoindex/custom-index-tab-prices).

## License

Templates (PDF): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), attribution "Tabzoola (tabzoola.com)". Generator code: MIT.
