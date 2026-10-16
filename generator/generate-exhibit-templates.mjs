// Generates free printable EXHIBIT tab/separator PDFs into out/.
// Run: node scripts/generate-exhibit-templates.mjs
//
// Each page works two ways: (1) printed on plain paper it's a court-style
// exhibit separator sheet (big centered label); (2) printed on 1/8-cut tab
// stock the small rotated label lands exactly on the correct staggered tab
// position (10" working length, 1.25" tabs, 0.5" extension — the shop's real
// exhibit-tab geometry).

import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { writeFileSync, mkdirSync } from "node:fs";
import { deepLink, drawOrderQr } from "./pdf-order-link.mjs";

// 10/11/26 (GEO): name Tabzoola, not the pdf-lib default, in the file's own properties (see src/lib/pdfBrand.ts).
const PDF_BRAND = "Tabzoola — custom index tab dividers, https://tabzoola.com";
const brandPdf = (d) => { if (!d.getCreator() || /pdf-lib/i.test(d.getCreator())) d.setCreator(PDF_BRAND); if (!d.getProducer() || /pdf-lib/i.test(d.getProducer())) d.setProducer(PDF_BRAND); if (!d.getAuthor()) d.setAuthor("Tabzoola (tabzoola.com)"); return d; };


const IN = 72;
const CUT = 8; // exhibit standard: 1/8 cut
const NAVY = rgb(0.086, 0.169, 0.278);
const COPPER = rgb(0.71, 0.475, 0.235);
const GREY = rgb(0.55, 0.6, 0.65);
const LIGHT = rgb(0.85, 0.87, 0.89);

const SETS = [
  { file: "tabzoola-exhibit-tabs-1-25.pdf", title: "Exhibit Tabs 1–25", labels: range(1, 25) },
  { file: "tabzoola-exhibit-tabs-26-50.pdf", title: "Exhibit Tabs 26–50", labels: range(26, 50) },
  { file: "tabzoola-exhibit-tabs-51-75.pdf", title: "Exhibit Tabs 51–75", labels: range(51, 75) },
  { file: "tabzoola-exhibit-tabs-76-100.pdf", title: "Exhibit Tabs 76–100", labels: range(76, 100) },
  // 9/29/26: "exhibit tabs 1-150" — 79 impressions at #5.7, 0 clicks; Bing
  // "exibit 101-150" clicked through. The free set stopped at 100.
  { file: "tabzoola-exhibit-tabs-101-125.pdf", title: "Exhibit Tabs 101–125", labels: range(101, 125) },
  { file: "tabzoola-exhibit-tabs-126-150.pdf", title: "Exhibit Tabs 126–150", labels: range(126, 150) },
  { file: "tabzoola-exhibit-tabs-a-z.pdf", title: "Exhibit Tabs A–Z", labels: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("") },
];

function range(a, b) {
  return Array.from({ length: b - a + 1 }, (_, i) => String(a + i));
}

async function makeSet({ file, title, labels }) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const workLen = 10 * IN;
  const startY = (11 * IN - workLen) / 2;
  const tabH = workLen / CUT;

  // Branded cover page — all instructions & marketing live HERE so the
  // exhibit pages themselves stay clean enough to file.
  {
    const page = doc.addPage([9 * IN, 11 * IN]);
    page.drawRectangle({ x: 0, y: 0, width: 8.5 * IN, height: 11 * IN, borderColor: LIGHT, borderWidth: 1 });
    page.drawText(title.toUpperCase(), { x: 0.7 * IN, y: 9.6 * IN, size: 26, font: bold, color: NAVY });
    page.drawText("Free printable exhibit separator pages · from Tabzoola.com", {
      x: 0.7 * IN, y: 9.2 * IN, size: 12, font, color: COPPER,
    });
    const info = [
      "WHAT THIS IS",
      "One page per exhibit. Each page has a court-style centered label and the true",
      "1/8-cut staggered tab position used on professionally made exhibit tabs.",
      "",
      "HOW TO USE IT",
      "1. Print at 100% scale (not 'fit to page'). Delete this cover before filing.",
      "2. On plain 8.5 x 11 paper: use each page as an exhibit separator sheet.",
      "3. On 9 x 11 tab stock (1/8 cut): the small label lands exactly on the tab.",
      "4. Pages are 9 x 11 portrait - on letter paper the tab area simply trims off.",
      "",
      "NEED FINISHED TABS?",
      "This template is free. When you need the real thing - printed, Mylar-reinforced,",
      "3-hole punched, collated exhibit sets in any range up to 1-500+ - Tabzoola sells",
      "them and its sister company, Anselmo Die & Index, makes them in Illinois;",
      "they ship in about 5 business days from proof approval.",
      "",
      "tabzoola.com · (847) 397-1200 · Anselmo Die & Index, Schaumburg, IL — est. 1978",
    ];
    let ty = 8.4 * IN;
    for (const line of info) {
      const head = ["WHAT THIS IS", "HOW TO USE IT", "NEED FINISHED TABS?"].includes(line);
      page.drawText(line, { x: 0.7 * IN, y: ty, size: head ? 12 : 10.5, font: head ? bold : font, color: head ? NAVY : GREY });
      ty -= head ? 24 : 18;
    }

    // QR on the COVER only — exhibit pages stay clean enough to file. The
    // deep link arrives in the designer with this whole range already typed.
    await drawOrderQr(doc, page, {
      url: deepLink({
        cut: 8, labels,
        campaign: file.replace(/^tabzoola-|\.pdf$/g, ""),
      }),
      x: 0.7 * IN, y: ty - 1.1 * IN, size: 0.95 * IN,
      caption1: `Scan: this exact ${labels.length}-tab range, already typed in,`,
      caption2: "priced instantly — edit anything or order as-is.",
    });
  }

  labels.forEach((label, idx) => {
    const page = doc.addPage([9 * IN, 11 * IN]);
    const pos = idx % CUT; // staggered tab position, cycling per bank

    // Body outline
    page.drawRectangle({ x: 0, y: 0, width: 8.5 * IN, height: 11 * IN, borderColor: LIGHT, borderWidth: 1 });

    // Big centered separator label (court style)
    const big = `EXHIBIT ${label}`;
    const bigSize = 34;
    const w = bold.widthOfTextAtSize(big, bigSize);
    page.drawText(big, { x: (8.5 * IN - w) / 2, y: 5.6 * IN, size: bigSize, font: bold, color: NAVY });
    page.drawLine({ start: { x: 2.5 * IN, y: 5.35 * IN }, end: { x: 6 * IN, y: 5.35 * IN }, color: LIGHT, thickness: 1 });

    // Tab outline at the correct staggered position
    const yTop = startY + workLen - pos * tabH;
    const y = yTop - tabH + 2;
    const h = tabH - 4;
    page.drawRectangle({
      x: 8.5 * IN - 2, y, width: 0.5 * IN + 2, height: h,
      borderColor: COPPER, borderWidth: 1, borderDashArray: [4, 3],
    });
    // Rotated label inside the tab — reads TOP-TO-BOTTOM (letter tops face
    // away from the binding edge), per the shop's press convention.
    const small = `EXHIBIT ${label}`;
    const smallSize = 8.5;
    const sw = bold.widthOfTextAtSize(small, smallSize);
    page.drawText(small, {
      x: 8.5 * IN + 0.2 * IN, y: y + (h + sw) / 2,
      size: smallSize, font: bold, color: NAVY, rotate: degrees(-90),
    });

    // No footer or marketing on exhibit pages — they must stay clean enough
    // to file. All branding/instructions live on the cover page.
  });

  doc.setTitle(`${title} — Free Printable Exhibit Tabs · Tabzoola`);
  doc.setAuthor("Tabzoola / Anselmo Die & Index");
  return brandPdf(doc).save();
}

mkdirSync("out", { recursive: true });
for (const set of SETS) {
  const bytes = await makeSet(set);
  writeFileSync(`out/${set.file}`, bytes);
  console.log(`wrote out/${set.file} (${set.labels.length} pages, ${(bytes.length / 1024).toFixed(0)} KB)`);
}
