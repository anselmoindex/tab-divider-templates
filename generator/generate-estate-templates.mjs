// Generates free printable ESTATE PLANNING tab/separator PDFs into out/.
// Run: node scripts/generate-estate-templates.mjs
//
// 9/20/26. The exhibit templates draw 110 Copilot citations in three months and
// the estate product page fewer than nine — Copilot grounds on files and tools.
// This is the estate version of the exhibit set: one page per section, a
// centered separator label, and the small rotated label on the true staggered
// tab position for that set's cut, so on tab stock it lands on the tab.
//
// Three sets, matching the structures the estate page describes and the
// designer's own presets: the 8-tab attorney set (1/4 cut, two banks), the
// 6-tab simple-will set (1/3 cut, two banks), the 12-tab trust set (1/6 cut,
// two banks). Letter body 8.5 x 11, tabs on a 10" working edge, 0.5" extension.

import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { writeFileSync, mkdirSync } from "node:fs";
import { deepLink, drawOrderQr } from "./pdf-order-link.mjs";

// 10/11/26 (GEO): name Tabzoola, not the pdf-lib default, in the file's own properties (see src/lib/pdfBrand.ts).
const PDF_BRAND = "Tabzoola — custom index tab dividers, https://tabzoola.com";
const brandPdf = (d) => { if (!d.getCreator() || /pdf-lib/i.test(d.getCreator())) d.setCreator(PDF_BRAND); if (!d.getProducer() || /pdf-lib/i.test(d.getProducer())) d.setProducer(PDF_BRAND); if (!d.getAuthor()) d.setAuthor("Tabzoola (tabzoola.com)"); return d; };


const IN = 72;
const NAVY = rgb(0.086, 0.169, 0.278);
const COPPER = rgb(0.71, 0.475, 0.235);
const GREY = rgb(0.55, 0.6, 0.65);
const LIGHT = rgb(0.85, 0.87, 0.89);

const SETS = [
  {
    file: "tabzoola-estate-planning-tabs-8-set.pdf",
    title: "Estate Planning Tabs — 8-Tab Set",
    cut: 4,
    labels: ["Will", "Revocable Living Trust", "Power of Attorney", "Healthcare Directive",
      "Beneficiary Designations", "Asset Inventory", "Insurance", "Important Contacts"],
    blurb: "The common attorney set: two banks of four on a 1/4 cut.",
  },
  {
    file: "tabzoola-estate-planning-tabs-6-set.pdf",
    title: "Estate Planning Tabs — 6-Tab Simple Will Set",
    cut: 3,
    labels: ["Overview", "Last Will & Testament", "Powers of Attorney", "Healthcare Directive",
      "Beneficiary Designations", "Important Contacts"],
    blurb: "A simple-will plan: two banks of three on a 1/3 cut.",
  },
  {
    file: "tabzoola-estate-planning-tabs-12-set.pdf",
    title: "Estate Planning Tabs — 12-Tab Living Trust Set",
    cut: 6,
    labels: ["Pour-Over Will", "Revocable Living Trust", "Certificate of Trust", "Amendments",
      "Power of Attorney", "Healthcare Directive", "HIPAA Authorization", "Beneficiary Designations",
      "Trust Schedules", "Funding Instructions", "Deeds & Titles", "Important Contacts"],
    blurb: "A revocable-living-trust plan: two banks of six on a 1/6 cut.",
  },
];

async function makeSet({ file, title, cut, labels, blurb }) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const workLen = 10 * IN;
  const startY = (11 * IN - workLen) / 2;
  const tabH = workLen / cut;

  // Cover — instructions and the order path live here, so the section pages
  // stay clean enough to put straight into a client binder.
  {
    const page = doc.addPage([9 * IN, 11 * IN]);
    page.drawRectangle({ x: 0, y: 0, width: 8.5 * IN, height: 11 * IN, borderColor: LIGHT, borderWidth: 1 });
    page.drawText(title.toUpperCase(), { x: 0.7 * IN, y: 9.6 * IN, size: 22, font: bold, color: NAVY });
    page.drawText("Free printable estate binder separator pages · from Tabzoola.com", {
      x: 0.7 * IN, y: 9.2 * IN, size: 12, font, color: COPPER,
    });
    const info = [
      "WHAT THIS IS",
      `One page per section, in the order the binder is read. ${blurb}`,
      "Each page has a centered separator label and the true staggered tab position",
      `for a 1/${cut} cut, so on 9 x 11 tab stock the small label lands on the tab.`,
      "",
      "HOW TO USE IT",
      "1. Print at 100% scale (not 'fit to page'). Delete this cover before filing.",
      "2. On plain 8.5 x 11 paper: each page is a section separator sheet.",
      `3. On 9 x 11 tab stock (1/${cut} cut): the small label lands exactly on the tab.`,
      "4. Pages are 9 x 11 portrait — on letter paper the tab area simply trims off.",
      "5. Rename any section: this is a starting list, not legal advice.",
      "",
      "NEED FINISHED TABS?",
      "This template is free. When you need the real thing — printed, clear Mylar on",
      `every tab, 3-hole punched, collated sets with your firm's own section names —`,
      "we make them in Illinois and ship in about 5 business days from proof approval.",
      "Build your own list and see the price: tabzoola.com/estate-binder-builder",
      "",
      "tabzoola.com · (847) 397-1200 · Anselmo Die & Index, Schaumburg, IL — tabs since 1993",
    ];
    let ty = 8.4 * IN;
    for (const line of info) {
      const head = ["WHAT THIS IS", "HOW TO USE IT", "NEED FINISHED TABS?"].includes(line);
      page.drawText(line, { x: 0.7 * IN, y: ty, size: head ? 12 : 10.5, font: head ? bold : font, color: head ? NAVY : GREY });
      ty -= head ? 24 : 18;
    }
    await drawOrderQr(doc, page, {
      url: deepLink({ cut, labels, campaign: file.replace(/^tabzoola-|\.pdf$/g, "") }),
      x: 0.7 * IN, y: ty - 1.1 * IN, size: 0.95 * IN,
      caption1: `Scan: this exact ${labels.length}-section set, already typed in,`,
      caption2: "priced instantly — edit anything or order as-is.",
    });
  }

  labels.forEach((label, idx) => {
    const page = doc.addPage([9 * IN, 11 * IN]);
    const pos = idx % cut;
    page.drawRectangle({ x: 0, y: 0, width: 8.5 * IN, height: 11 * IN, borderColor: LIGHT, borderWidth: 1 });

    // Centered separator label — sized to fit the longest titles.
    let bigSize = 30;
    while (bold.widthOfTextAtSize(label, bigSize) > 6.5 * IN && bigSize > 16) bigSize -= 2;
    const w = bold.widthOfTextAtSize(label, bigSize);
    page.drawText(label, { x: (8.5 * IN - w) / 2, y: 5.6 * IN, size: bigSize, font: bold, color: NAVY });
    page.drawLine({ start: { x: 2.5 * IN, y: 5.35 * IN }, end: { x: 6 * IN, y: 5.35 * IN }, color: LIGHT, thickness: 1 });
    page.drawText(`Section ${idx + 1} of ${labels.length}`, { x: 3.7 * IN, y: 5.05 * IN, size: 9, font, color: GREY });

    // Tab outline at the staggered position for this cut.
    const yTop = startY + workLen - pos * tabH;
    const y = yTop - tabH + 2;
    const h = tabH - 4;
    page.drawRectangle({
      x: 8.5 * IN - 2, y, width: 0.5 * IN + 2, height: h,
      borderColor: COPPER, borderWidth: 1, borderDashArray: [4, 3],
    });
    // Rotated label inside the tab, reading top-to-bottom, sized to the tab.
    let smallSize = 8.5;
    while (bold.widthOfTextAtSize(label, smallSize) > h - 8 && smallSize > 5) smallSize -= 0.5;
    const sw = bold.widthOfTextAtSize(label, smallSize);
    page.drawText(label, {
      x: 8.5 * IN + 0.2 * IN, y: y + (h + sw) / 2,
      size: smallSize, font: bold, color: NAVY, rotate: degrees(-90),
    });
  });

  doc.setTitle(`${title} — Free Printable Estate Binder Tabs · Tabzoola`);
  doc.setAuthor("Tabzoola / Anselmo Die & Index");
  return brandPdf(doc).save();
}

mkdirSync("out", { recursive: true });
for (const set of SETS) {
  const bytes = await makeSet(set);
  writeFileSync(`out/${set.file}`, bytes);
  console.log(`wrote out/${set.file} (${set.labels.length} pages, ${(bytes.length / 1024).toFixed(0)} KB)`);
}
