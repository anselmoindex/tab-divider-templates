// Shared "order these printed" block for the free template PDFs: a scannable
// QR + a clickable link annotation, deep-linking into the designer with the
// template's own configuration loaded. A downloaded template lives on a desk
// long after the visit; the QR is the only path back that survives printing.
// utm_source=template_pdf so GA4 attributes what the templates actually earn.
import QRCode from "qrcode";
import { PDFName, PDFString, rgb } from "pdf-lib";

const IN = 72;
const NAVY = rgb(0.086, 0.169, 0.278);
const COPPER = rgb(0.71, 0.475, 0.235);

export function deepLink({ cut, tabs, labels, campaign, layout }) {
  const base = "https://tabzoola.com/configure/paper";
  const params = new URLSearchParams();
  if (labels?.length) params.set("labels", labels.join("|"));
  if (cut) params.set("cut", String(cut));
  if (tabs) params.set("tabs", String(tabs));
  if (layout) params.set("layout", layout);   // 9/20/26: legal templates land on the legal sheet
  params.set("utm_source", "template_pdf");
  params.set("utm_medium", "pdf");
  params.set("utm_campaign", campaign);
  return `${base}?${params.toString()}`;
}

// Draws a QR (with caption) at (x, y) [bottom-left of the QR], plus an
// invisible clickable rectangle over it and over the caption. Returns nothing.
export async function drawOrderQr(doc, page, { url, x, y, size = 1.05 * IN, caption1, caption2 }) {
  const png = await QRCode.toBuffer(url, { errorCorrectionLevel: "M", margin: 1, width: 300 });
  const img = await doc.embedPng(png);
  page.drawImage(img, { x, y, width: size, height: size });
  // Captions sit to the RIGHT of the QR — below collides with page footers.
  const cx = x + size + 10;
  const cy = y + size / 2;
  if (caption1) page.drawText(caption1, { x: cx, y: cy + 3, size: 8.5, color: NAVY });
  if (caption2) page.drawText(caption2, { x: cx, y: cy - 9, size: 8, color: COPPER });

  const annot = doc.context.register(
    doc.context.obj({
      Type: "Annot", Subtype: "Link",
      Rect: [x, y, x + size + 180, y + size],
      Border: [0, 0, 0],
      A: { Type: "Action", S: "URI", URI: PDFString.of(url) },
    })
  );
  const existing = page.node.get(PDFName.of("Annots"));
  if (existing) existing.push(annot);
  else page.node.set(PDFName.of("Annots"), doc.context.obj([annot]));
}
