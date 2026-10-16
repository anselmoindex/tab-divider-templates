// Generates the free tab-divider template PDFs (one per cut) into
// out/. Run: node scripts/generate-templates.mjs
// Spec matches the shop's real product: 8.5x11 portrait body, tabs down the
// right edge on a 10" working length, 0.5" extension → 9x11 finished sheet.

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeFileSync, mkdirSync } from "node:fs";
import { deepLink, drawOrderQr } from "./pdf-order-link.mjs";

// 10/11/26 (GEO): name Tabzoola, not the pdf-lib default, in the file's own properties (see src/lib/pdfBrand.ts).
const PDF_BRAND = "Tabzoola — custom index tab dividers, https://tabzoola.com";
const brandPdf = (d) => { if (!d.getCreator() || /pdf-lib/i.test(d.getCreator())) d.setCreator(PDF_BRAND); if (!d.getProducer() || /pdf-lib/i.test(d.getProducer())) d.setProducer(PDF_BRAND); if (!d.getAuthor()) d.setAuthor("Tabzoola (tabzoola.com)"); return d; };


const IN = 72; // points per inch
const CUTS = [3, 4, 5, 6, 7, 8, 9, 10];

// Prices printed INTO the PDFs. These are the same figures /templates shows
// (minimumOrder("paper") and calculatePrice at 250 sets). The PDF used to say
// "from $1.08/set" — the old 250-set floor, which the page itself dropped on
// 8/23 as not the offer a downloader can act on. A downloaded PDF outlives
// every page edit, so re-run this script whenever paper pricing changes.
// Verified 2026-08-27 against the live /templates page.
// 10/16/26: the line below says "punches and collates", so it quotes the
// collated + 3-hole price (calculatePrice with collation/punch), not the bare
// minimumOrder figure ($5.45 / $1.57) it carried before.
const ENTRY_SETS = 25, ENTRY_TABS = 5, ENTRY_PER_SET = "5.56";
const VOLUME_SETS = 250, VOLUME_PER_SET = "1.68";

const NAVY = rgb(0.086, 0.169, 0.278);
const COPPER = rgb(0.71, 0.475, 0.235);
const GREY = rgb(0.55, 0.6, 0.65);
const LIGHT = rgb(0.85, 0.87, 0.89);

async function makeTemplate(cut) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([9 * IN, 11 * IN]); // finished sheet w/ extension
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  // Body sheet outline (8.5 x 11)
  page.drawRectangle({ x: 0, y: 0, width: 8.5 * IN, height: 11 * IN, borderColor: LIGHT, borderWidth: 1 });

  // Header
  page.drawText(`1/${cut}-CUT INDEX TAB TEMPLATE`, { x: 0.6 * IN, y: 10.25 * IN, size: 18, font: bold, color: NAVY });
  page.drawText(`Letter body 8.5 × 11 in · ${cut} tab positions · tab extension 0.5 in · finished sheet 9 × 11 in`, {
    x: 0.6 * IN, y: 9.95 * IN, size: 9.5, font, color: GREY,
  });

  // Working area for tabs: 10" along the right edge, centered vertically.
  const workLen = 10 * IN;
  const startY = (11 * IN - workLen) / 2; // 0.5" margin top & bottom
  const tabH = workLen / cut;
  const gap = 4; // visual gap between tab outlines

  for (let i = 0; i < cut; i++) {
    const yTop = startY + workLen - i * tabH;
    const y = yTop - tabH + gap / 2;
    const h = tabH - gap;
    // Tab outline (dashed) extending 0.5" beyond the body edge
    page.drawRectangle({
      x: 8.5 * IN - 2, y, width: 0.5 * IN + 2, height: h,
      borderColor: COPPER, borderWidth: 1, borderDashArray: [4, 3],
    });
    // Position label + guide line into the body
    const label = `TAB ${i + 1}`;
    page.drawText(label, { x: 7.65 * IN, y: y + h / 2 - 4, size: 8, font: bold, color: NAVY });
    page.drawText(`${(10 / cut).toFixed(2)}" tall`, { x: 7.6 * IN, y: y + h / 2 - 15, size: 7, font, color: GREY });
    page.drawLine({
      start: { x: 0.6 * IN, y: y + h / 2 }, end: { x: 7.5 * IN, y: y + h / 2 },
      color: LIGHT, thickness: 0.5, dashArray: [2, 4],
    });
  }

  // How-to block
  const lines = [
    "HOW TO USE THIS TEMPLATE",
    `1. Each dashed outline is one tab position — a 1/${cut} cut gives ${cut} tabs per set (bank).`,
    `2. Tab text area: about ${(10 / cut).toFixed(2)}" tall × 0.5" deep. Keep text 0.1" from edges.`,
    "3. Need more tabs than positions? Sets repeat in additional banks (see tabzoola.com/tab-cut-calculator).",
    "4. Printing your own labels? Align to the dashed outlines. Or skip the DIY —",
    `    Tabzoola prints, Mylar-reinforces, punches and collates custom tabs: ${ENTRY_SETS} sets of ${ENTRY_TABS} is $${ENTRY_PER_SET} a set, $${VOLUME_PER_SET} at ${VOLUME_SETS}.`,
    "    Type your section names and see the price as you go: tabzoola.com/configure/paper \u00b7 Made in the USA.",
  ];
  let ty = 3.0 * IN;
  for (const [i, l] of lines.entries()) {
    page.drawText(l, { x: 0.6 * IN, y: ty, size: i === 0 ? 10 : 9, font: i === 0 ? bold : font, color: i === 0 ? NAVY : GREY });
    ty -= 16;
  }

  // Order-this-printed QR: deep-links the designer with THIS cut loaded. The
  // printed template outlives the visit; the QR is the way back.
  await drawOrderQr(doc, page, {
    url: deepLink({ cut, tabs: cut, campaign: `tab-template-1-${cut}-cut` }),
    x: 0.6 * IN, y: 0.72 * IN, size: 0.88 * IN,
    caption1: "Scan: your titles on this exact cut, priced instantly —",
    caption2: "printed, Mylar-reinforced and collated for you.",
  });

  // Footer brand
  page.drawText("Free template from Tabzoola.com — custom printed index tabs, made in Illinois · (847) 397-1200", {
    x: 0.6 * IN, y: 0.55 * IN, size: 8.5, font, color: COPPER,
  });

  doc.setTitle(`1/${cut}-Cut Index Tab Divider Template — Tabzoola`);
  doc.setAuthor("Tabzoola / Anselmo Die & Index");
  return brandPdf(doc).save();
}

mkdirSync("out", { recursive: true });
for (const cut of CUTS) {
  const bytes = await makeTemplate(cut);
  const path = `out/tabzoola-tab-template-1-${cut}-cut.pdf`;
  writeFileSync(path, bytes);
  console.log("wrote", path, bytes.length, "bytes");
}
