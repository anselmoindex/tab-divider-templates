// Generates hanging-tab (landscape "Hanger") template PDFs into
// out/. Run: node scripts/generate-hanger-templates.mjs
// Spec matches the shop's real product (ADI style "Hanger"): 11x8.5 landscape
// body bound on the top 11" edge, tabs hanging from the bottom edge on a 10"
// working length, 0.5" extension → 11x9 finished sheet. Includes 1/12 cut for
// Jan–Dec calendar sets. Doubles as the copier/offset production layout.

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeFileSync, mkdirSync } from "node:fs";
import { deepLink, drawOrderQr } from "./pdf-order-link.mjs";

// 10/11/26 (GEO): name Tabzoola, not the pdf-lib default, in the file's own properties (see src/lib/pdfBrand.ts).
const PDF_BRAND = "Tabzoola — custom index tab dividers, https://tabzoola.com";
const brandPdf = (d) => { if (!d.getCreator() || /pdf-lib/i.test(d.getCreator())) d.setCreator(PDF_BRAND); if (!d.getProducer() || /pdf-lib/i.test(d.getProducer())) d.setProducer(PDF_BRAND); if (!d.getAuthor()) d.setAuthor("Tabzoola (tabzoola.com)"); return d; };


const IN = 72; // points per inch
const CUTS = [3, 4, 5, 6, 7, 8, 9, 10, 12];

const NAVY = rgb(0.086, 0.169, 0.278);
const COPPER = rgb(0.71, 0.475, 0.235);
const GREY = rgb(0.55, 0.6, 0.65);
const LIGHT = rgb(0.85, 0.87, 0.89);

async function makeTemplate(cut) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([11 * IN, 9 * IN]); // finished sheet w/ extension below
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  // Body sheet outline (11 x 8.5), bound edge at the TOP of the page.
  page.drawRectangle({ x: 0, y: 0.5 * IN, width: 11 * IN, height: 8.5 * IN, borderColor: LIGHT, borderWidth: 1 });

  // Header
  page.drawText(`1/${cut}-CUT HANGING TAB TEMPLATE`, { x: 0.6 * IN, y: 8.3 * IN, size: 18, font: bold, color: NAVY });
  page.drawText(
    `Landscape body 11 × 8.5 in, bound at top · ${cut} tab positions along the bottom · tab extension 0.5 in · finished sheet 11 × 9 in`,
    { x: 0.6 * IN, y: 8.02 * IN, size: 9.5, font, color: GREY },
  );

  // Working area for tabs: 10" along the bottom edge, centered horizontally.
  const workLen = 10 * IN;
  const startX = (11 * IN - workLen) / 2; // 0.5" margin left & right
  const tabW = workLen / cut;
  const gap = 4; // visual gap between tab outlines

  for (let i = 0; i < cut; i++) {
    const x = startX + i * tabW + gap / 2;
    const w = tabW - gap;
    // Tab outline (dashed) extending 0.5" below the body edge
    page.drawRectangle({
      x, y: 0, width: w, height: 0.5 * IN + 2,
      borderColor: COPPER, borderWidth: 1, borderDashArray: [4, 3],
    });
    // Position label + width note just above the tab, inside the body
    const label = `TAB ${i + 1}`;
    const lw = bold.widthOfTextAtSize(label, 8);
    page.drawText(label, { x: x + w / 2 - lw / 2, y: 0.82 * IN, size: 8, font: bold, color: NAVY });
    const note = `${(10 / cut).toFixed(2)}" wide`;
    const nw = font.widthOfTextAtSize(note, 7);
    page.drawText(note, { x: x + w / 2 - nw / 2, y: 0.68 * IN, size: 7, font, color: GREY });
    // Guide line up into the body
    page.drawLine({
      start: { x: x + w / 2, y: 1.05 * IN }, end: { x: x + w / 2, y: 4.7 * IN },
      color: LIGHT, thickness: 0.5, dashArray: [2, 4],
    });
  }

  // How-to block
  const lines = [
    "HOW TO USE THIS TEMPLATE",
    `1. Each dashed outline is one tab position — a 1/${cut} cut gives ${cut} hanging tabs per set (bank).`,
    `2. Tab text area: about ${(10 / cut).toFixed(2)}" wide × 0.5" deep. Keep text 0.1" from edges.`,
    "3. Bind or drill on the top 11\" edge; the tabs hang below the bottom edge of the page.",
    "4. Need more tabs than positions? Sets repeat in additional banks (see tabzoola.com/tab-cut-calculator).",
    "5. Printing your own labels? Align to the dashed outlines. Or skip the DIY —",
    "    Tabzoola prints, Mylar-reinforces, punches and collates custom hanging tabs to order.",
    "    Type your section names and see the price as you go: tabzoola.com/configure/paper",
  ];
  let ty = 7.3 * IN;
  for (const [i, l] of lines.entries()) {
    page.drawText(l, { x: 0.6 * IN, y: ty, size: i === 0 ? 10 : 9, font: i === 0 ? bold : font, color: i === 0 ? NAVY : GREY });
    ty -= 16;
  }

  // Order-this-printed QR — same block as the portrait templates.
  await drawOrderQr(doc, page, {
    url: deepLink({ cut, tabs: cut, campaign: `hanger-template-1-${cut}-cut` }),
    x: 0.6 * IN, y: 1.5 * IN, size: 0.88 * IN,
    caption1: "Scan: your titles on this exact cut, priced instantly —",
    caption2: "printed, Mylar-reinforced and collated for you.",
  });

  // Footer brand (kept inside the body, above the tab zone)
  page.drawText("Free template from Tabzoola.com — custom printed index tabs, made in Illinois · (847) 397-1200", {
    x: 0.6 * IN, y: 1.12 * IN, size: 8.5, font, color: COPPER,
  });

  doc.setTitle(`1/${cut}-Cut Hanging Tab Divider Template — Tabzoola`);
  doc.setAuthor("Tabzoola / Anselmo Die & Index");
  return brandPdf(doc).save();
}

mkdirSync("out", { recursive: true });
for (const cut of CUTS) {
  const bytes = await makeTemplate(cut);
  const path = `out/tabzoola-hanger-tab-template-1-${cut}-cut.pdf`;
  writeFileSync(path, bytes);
  console.log("wrote", path, bytes.length, "bytes");
}
