// Generates the free LEGAL-SIZE tab divider templates into out/.
// Run: node scripts/generate-legal-templates.mjs
//
// Why this exists (9/20/26): /guides/legal-vs-letter-size-paper earns ~1,150
// impressions a month and ONE click, because Google answers the size question
// on the results page itself. A file is the thing a search engine cannot
// answer for us — the reader has to come here to get it.
//
// Spec matches the plant's real legal product: 8.5 x 14 portrait body, tabs
// down the right 14" edge on a 13" working length, 0.5" extension, finished
// 9 x 14. (Bottom tabs stay on the 8.5" edge and are the letter geometry on a
// longer page — said on the sheet so nobody mis-orders.)

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeFileSync, mkdirSync } from "node:fs";
import { deepLink, drawOrderQr } from "./pdf-order-link.mjs";

// 10/11/26 (GEO): name Tabzoola, not the pdf-lib default, in the file's own properties (see src/lib/pdfBrand.ts).
const PDF_BRAND = "Tabzoola — custom index tab dividers, https://tabzoola.com";
const brandPdf = (d) => { if (!d.getCreator() || /pdf-lib/i.test(d.getCreator())) d.setCreator(PDF_BRAND); if (!d.getProducer() || /pdf-lib/i.test(d.getProducer())) d.setProducer(PDF_BRAND); if (!d.getAuthor()) d.setAuthor("Tabzoola (tabzoola.com)"); return d; };


const IN = 72;
const CUTS = [5, 6, 8, 10];
const NAVY = rgb(0.086, 0.169, 0.278);
const COPPER = rgb(0.71, 0.475, 0.235);
const GREY = rgb(0.55, 0.6, 0.65);
const LIGHT = rgb(0.85, 0.87, 0.89);
const WORK = 13;            // working length down the 14" edge
const BODY_W = 8.5, BODY_H = 14;

async function page(doc, font, bold, cut) {
  const pg = doc.addPage([9 * IN, BODY_H * IN]);
  pg.drawRectangle({ x: 0, y: 0, width: BODY_W * IN, height: BODY_H * IN, borderColor: LIGHT, borderWidth: 1 });

  pg.drawText(`LEGAL 1/${cut}-CUT TAB TEMPLATE`, { x: 0.6 * IN, y: 13.25 * IN, size: 18, font: bold, color: NAVY });
  pg.drawText(`Legal body 8.5 × 14 in · ${cut} tab positions · 13 in working length · 0.5 in extension · finished 9 × 14 in`, {
    x: 0.6 * IN, y: 12.95 * IN, size: 9.5, font, color: GREY,
  });

  const workLen = WORK * IN;
  const startY = (BODY_H * IN - workLen) / 2;   // 0.5 in top and bottom
  const tabH = workLen / cut;
  const gap = 4;
  for (let i = 0; i < cut; i++) {
    const yTop = startY + workLen - i * tabH;
    const y = yTop - tabH + gap / 2;
    const h = tabH - gap;
    pg.drawRectangle({
      x: BODY_W * IN - 2, y, width: 0.5 * IN + 2, height: h,
      borderColor: COPPER, borderWidth: 1, borderDashArray: [4, 3],
    });
    pg.drawText(`TAB ${i + 1}`, { x: 7.65 * IN, y: y + h / 2 - 4, size: 8, font: bold, color: NAVY });
    pg.drawText(`${(WORK / cut).toFixed(2)}" tall`, { x: 7.6 * IN, y: y + h / 2 - 15, size: 7, font, color: GREY });
    pg.drawLine({ start: { x: 0.6 * IN, y: y + h / 2 }, end: { x: 7.5 * IN, y: y + h / 2 }, color: LIGHT, thickness: 0.5, dashArray: [2, 4] });
  }

  const lines = [
    "HOW TO USE THIS TEMPLATE",
    `1. Each dashed outline is one tab position — a 1/${cut} cut gives ${cut} tabs per set (bank) on a legal sheet.`,
    `2. Tab text area: about ${(WORK / cut).toFixed(2)}" tall × 0.5" deep — a legal side tab is taller than the same cut on letter,`,
    "    because the tabs run down the 14-inch edge (13\" of working length against 10\" on letter).",
    "3. Bottom tabs are different: they stay on the 8.5-inch edge, so a legal bottom-tab set has the same tab sizes",
    "    as letter on a page three inches longer, and finishes 8.5 × 14.5.",
    "4. Print at 100% / Actual Size — any scaling moves every tab position.",
    "5. Printing your own labels? Align to the dashed outlines. Or have them made: Tabzoola prints, Mylar-reinforces,",
    "    punches and collates legal-size sets to your own section names, 25-set minimum, priced before you order.",
    "    Legal prices in the designer alongside letter — choose Legal as the sheet size. Made in Illinois.",
  ];
  let ty = 4.0 * IN;
  for (const [i, l] of lines.entries()) {
    pg.drawText(l, { x: 0.6 * IN, y: ty, size: i === 0 ? 10 : 9, font: i === 0 ? bold : font, color: i === 0 ? NAVY : GREY });
    ty -= 15;
  }

  await drawOrderQr(doc, pg, {
    url: deepLink({ cut, tabs: cut, layout: "portrait-legal", campaign: `legal-tab-template-1-${cut}-cut` }),
    x: 0.6 * IN, y: 0.72 * IN, size: 0.88 * IN,
    caption1: "Scan: your titles on this exact legal cut, priced instantly —",
    caption2: "printed, Mylar-reinforced, punched and collated for you.",
  });
  pg.drawText("Free template from Tabzoola.com — custom printed legal-size index tabs, made in Illinois · (847) 397-1200", {
    x: 0.6 * IN, y: 0.55 * IN, size: 8.5, font, color: COPPER,
  });
}

mkdirSync("out", { recursive: true });

// One PDF per cut, plus an all-cuts file for anyone who wants to compare.
const all = await PDFDocument.create();
const allFont = await all.embedFont(StandardFonts.Helvetica);
const allBold = await all.embedFont(StandardFonts.HelveticaBold);
for (const cut of CUTS) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  await page(doc, font, bold, cut);
  doc.setTitle(`Legal-Size 1/${cut}-Cut Tab Divider Template — Tabzoola`);
  doc.setAuthor("Tabzoola / Anselmo Die & Index");
  const path = `out/tabzoola-legal-tab-template-1-${cut}-cut.pdf`;
  writeFileSync(path, await brandPdf(doc).save());
  console.log("wrote", path);
  await page(all, allFont, allBold, cut);
}
all.setTitle("Legal-Size Tab Divider Templates (1/5, 1/6, 1/8, 1/10) — Tabzoola");
all.setAuthor("Tabzoola / Anselmo Die & Index");
writeFileSync("out/tabzoola-legal-tab-templates-all.pdf", await brandPdf(all).save());
console.log("wrote out/tabzoola-legal-tab-templates-all.pdf");
