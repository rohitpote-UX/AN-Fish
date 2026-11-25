import "server-only";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { fmtInr, fmtKg, type Range } from "@/lib/dateRange";
import { REASONS } from "@/app/admin/(panel)/wastage/reasons";
import { EXPENSE_CATEGORIES, PAY_MODES } from "@/app/admin/(panel)/expenses/categories";
import { loadCustomers } from "@/lib/customers";
import { EXPECTED_LEFT, SALES, SALES_JOINS, SOLD } from "@/lib/salesSql";

export type Kind = "text" | "int" | "kg" | "inr" | "date";
export type Col = { key: string; label: string; kind: Kind };
export type Cell = string | number | null;
export type Report = {
  id: string;
  title: string;
  columns: Col[];
  rows: Record<string, Cell>[];
  totals?: Record<string, Cell>;
  summary: { label: string; value: string }[];
  truncated?: boolean;
};

export const REPORT_LIST: { id: string; title: string; desc: string; headOnly?: boolean }[] = [
  { id: "daywise", title: "दिवसवार विक्री", desc: "प्रत्येक दिवसाची आवक, वाया गेलेला माल, विक्री आणि क्लोजिंग" },
  { id: "fishwise", title: "माशानुसार विक्री", desc: "कोणता मासा किती विकला, किती रक्कम" },
  { id: "stockday", title: "दैनिक स्टॉक", desc: "आज किती स्टॉक होता, किती संपला, किती उरला" },
  { id: "branchwise", title: "शाखानुसार तुलना", desc: "सर्व शाखांची विक्री, वाया गेलेला माल आणि ऑर्डर्स", headOnly: true },
  { id: "bills", title: "काउंटर बिले", desc: "काउंटरवर बनवलेली बिले: रोख / UPI, सूट, रद्द बिले" },
  { id: "orders", title: "ऑर्डर्स", desc: "ग्राहकांच्या ऑर्डर्सची यादी आणि स्थिती" },
  { id: "purchases", title: "खरेदी", desc: "पुरवठादारानुसार खरेदी, दिलेले आणि बाकी" },
  { id: "cashclosing", title: "रोख क्लोजिंग", desc: "दिवसअखेर रोख: असायला हवी, मोजलेली, तफावत" },
  { id: "staffpay", title: "पगार / उचल", desc: "कर्मचारीनुसार दिलेला पगार, उचल आणि तारखा" },
  { id: "expenses", title: "खर्च", desc: "प्रकारानुसार आणि शाखेनुसार खर्च" },
  { id: "customers", title: "ग्राहक", desc: "ग्राहकांची यादी आणि एकूण खरेदी (कालावधी लागू नाही)" },
  { id: "wastage", title: "वाया गेलेला माल", desc: "कारणानुसार वाया गेलेल्या मालाची यादी" },
];

const MAX_ROWS = 20000;
const BASE = `FROM stock_days sd
  JOIN fish_items f ON f.id=sd.fish_id
  JOIN branches b ON b.id=sd.branch_id
  LEFT JOIN (SELECT branch_id, fish_id, day, SUM(qty_kg) AS q FROM wastage WHERE is_deleted=0 GROUP BY branch_id, fish_id, day) w
    ON w.branch_id=sd.branch_id AND w.fish_id=sd.fish_id AND w.day=sd.day${SALES_JOINS}`;
const shortBranch = (n: string) => n.replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "");
const num = (v: unknown) => Number(v ?? 0);
const dayStr = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10));

export async function runReport(id: string, r: Range, branchId: number | null): Promise<Report> {
  const bw = branchId ? " AND sd.branch_id=?" : "";
  const args = (extra: unknown[] = []) => [r.from, r.to, ...(branchId ? [branchId] : []), ...extra];
  const q = async (sql: string, a: unknown[]) => (await db().query<RowDataPacket[]>(sql, a))[0];

  if (id === "daywise") {
    const rows = await q(
      `SELECT sd.day, SUM(sd.opening_kg) AS opening, SUM(sd.added_kg) AS added, SUM(COALESCE(w.q,0)) AS wastage,
         SUM(${SOLD}) AS sold, SUM(${SALES}) AS sales, SUM(sd.closing_kg) AS closing
       ${BASE} WHERE sd.day BETWEEN ? AND ?${bw} GROUP BY sd.day ORDER BY sd.day DESC`, args());
    const orders = await q(
      `SELECT DATE(CONVERT_TZ(created_at, @@session.time_zone, '+05:30')) AS d, COUNT(*) AS n FROM orders
       WHERE DATE(CONVERT_TZ(created_at, @@session.time_zone, '+05:30')) BETWEEN ? AND ?${branchId ? " AND branch_id=?" : ""} GROUP BY d`, args());
    const om = new Map(orders.map((o) => [dayStr(o.d), num(o.n)]));
    // Cash / UPI / other split comes straight from the (non-cancelled) counter bills.
    const pays = await q(
      `SELECT bill_day AS d, SUM(CASE WHEN payment_mode='cash' THEN total ELSE 0 END) AS cash, SUM(CASE WHEN payment_mode='upi' THEN total ELSE 0 END) AS upi,
         SUM(CASE WHEN payment_mode='other' THEN total ELSE 0 END) AS other FROM bills
       WHERE is_void=0 AND bill_day BETWEEN ? AND ?${branchId ? " AND branch_id=?" : ""} GROUP BY bill_day`, args());
    const pm = new Map(pays.map((x) => [dayStr(x.d), x]));
    const out = rows.map((x) => ({ day: dayStr(x.day), opening: num(x.opening), added: num(x.added), wastage: num(x.wastage), sold: num(x.sold), sales: num(x.sales), cash: num(pm.get(dayStr(x.day))?.cash), upi: num(pm.get(dayStr(x.day))?.upi), other: num(pm.get(dayStr(x.day))?.other), closing: num(x.closing), orders: om.get(dayStr(x.day)) ?? 0 }));
    const t = out.reduce((a, x) => ({ opening: a.opening + x.opening, added: a.added + x.added, wastage: a.wastage + x.wastage, sold: a.sold + x.sold, sales: a.sales + x.sales, cash: a.cash + x.cash, upi: a.upi + x.upi, other: a.other + x.other, orders: a.orders + x.orders }), { opening: 0, added: 0, wastage: 0, sold: 0, sales: 0, cash: 0, upi: 0, other: 0, orders: 0 });
    return {
      id, title: "दिवसवार विक्री",
      columns: [{ key: "day", label: "तारीख", kind: "date" }, { key: "opening", label: "सुरुवात (kg)", kind: "kg" }, { key: "added", label: "नवीन आवक (kg)", kind: "kg" }, { key: "wastage", label: "वाया गेले (kg)", kind: "kg" }, { key: "sold", label: "विक्री (kg)", kind: "kg" }, { key: "sales", label: "विक्री रक्कम", kind: "inr" }, { key: "cash", label: "रोख", kind: "inr" }, { key: "upi", label: "UPI", kind: "inr" }, { key: "other", label: "इतर", kind: "inr" }, { key: "closing", label: "क्लोजिंग (kg)", kind: "kg" }, { key: "orders", label: "ऑर्डर्स", kind: "int" }],
      rows: out, totals: { day: "एकूण", ...t },
      summary: [{ label: "एकूण विक्री", value: fmtInr(t.sales) }, { label: "विक्री (kg)", value: fmtKg(t.sold) }, { label: "नवीन आवक", value: fmtKg(t.added) }, { label: "वाया गेले", value: fmtKg(t.wastage) }, { label: "ऑर्डर्स", value: String(t.orders) }, { label: "रोख", value: fmtInr(t.cash) }, { label: "UPI", value: fmtInr(t.upi) }],
    };
  }

  if (id === "fishwise") {
    const rows = await q(
      `SELECT f.name_mr AS fish, f.name_en AS fish_en, SUM(sd.added_kg+sd.opening_kg) AS supply, SUM(sd.added_kg) AS added, SUM(COALESCE(w.q,0)) AS wastage,
         SUM(${SOLD}) AS sold, SUM(${SALES}) AS sales
       ${BASE} WHERE sd.day BETWEEN ? AND ?${bw} GROUP BY f.id HAVING SUM(sd.opening_kg+sd.added_kg)>0 ORDER BY sales DESC, sold DESC`, args());
    const out = rows.map((x) => ({ fish: `${x.fish}`, added: num(x.added), wastage: num(x.wastage), sold: num(x.sold), sales: num(x.sales), avg: num(x.sold) > 0 ? num(x.sales) / num(x.sold) : null }));
    const t = out.reduce((a, x) => ({ added: a.added + x.added, wastage: a.wastage + x.wastage, sold: a.sold + x.sold, sales: a.sales + x.sales }), { added: 0, wastage: 0, sold: 0, sales: 0 });
    return {
      id, title: "माशानुसार विक्री",
      columns: [{ key: "fish", label: "मासा", kind: "text" }, { key: "added", label: "नवीन आवक (kg)", kind: "kg" }, { key: "wastage", label: "वाया गेले (kg)", kind: "kg" }, { key: "sold", label: "विक्री (kg)", kind: "kg" }, { key: "avg", label: "सरासरी भाव ₹/kg", kind: "inr" }, { key: "sales", label: "विक्री रक्कम", kind: "inr" }],
      rows: out, totals: { fish: "एकूण", ...t },
      summary: [{ label: "एकूण विक्री", value: fmtInr(t.sales) }, { label: "विक्री (kg)", value: fmtKg(t.sold) }, { label: "सर्वाधिक विक्री", value: out[0] && out[0].sold > 0 ? out[0].fish : "—" }],
    };
  }

  if (id === "branchwise") {
    const rows = await q(
      `SELECT b.id, b.name, SUM(sd.added_kg) AS added, SUM(COALESCE(w.q,0)) AS wastage, SUM(${SOLD}) AS sold, SUM(${SALES}) AS sales
       ${BASE} WHERE sd.day BETWEEN ? AND ? GROUP BY b.id ORDER BY sales DESC`, [r.from, r.to]);
    const ords = await q(
      `SELECT branch_id, COUNT(*) AS n, SUM(status='completed') AS done FROM orders
       WHERE DATE(CONVERT_TZ(created_at, @@session.time_zone, '+05:30')) BETWEEN ? AND ? GROUP BY branch_id`, [r.from, r.to]);
    const om = new Map(ords.map((o) => [o.branch_id as number, o]));
    const pays = await q(
      `SELECT branch_id, SUM(CASE WHEN payment_mode='cash' THEN total ELSE 0 END) AS cash, SUM(CASE WHEN payment_mode='upi' THEN total ELSE 0 END) AS upi,
         SUM(CASE WHEN payment_mode='other' THEN total ELSE 0 END) AS other FROM bills WHERE is_void=0 AND bill_day BETWEEN ? AND ? GROUP BY branch_id`, [r.from, r.to]);
    const pm = new Map(pays.map((x) => [x.branch_id as number, x]));
    const out = rows.map((x) => ({ branch: shortBranch(String(x.name)), added: num(x.added), wastage: num(x.wastage), sold: num(x.sold), sales: num(x.sales), cash: num(pm.get(x.id)?.cash), upi: num(pm.get(x.id)?.upi), other: num(pm.get(x.id)?.other), orders: num(om.get(x.id)?.n), done: num(om.get(x.id)?.done) }));
    const t = out.reduce((a, x) => ({ added: a.added + x.added, wastage: a.wastage + x.wastage, sold: a.sold + x.sold, sales: a.sales + x.sales, cash: a.cash + x.cash, upi: a.upi + x.upi, other: a.other + x.other, orders: a.orders + x.orders, done: a.done + x.done }), { added: 0, wastage: 0, sold: 0, sales: 0, cash: 0, upi: 0, other: 0, orders: 0, done: 0 });
    return {
      id, title: "शाखानुसार तुलना",
      columns: [{ key: "branch", label: "शाखा", kind: "text" }, { key: "added", label: "नवीन आवक (kg)", kind: "kg" }, { key: "wastage", label: "वाया गेले (kg)", kind: "kg" }, { key: "sold", label: "विक्री (kg)", kind: "kg" }, { key: "sales", label: "विक्री रक्कम", kind: "inr" }, { key: "cash", label: "रोख", kind: "inr" }, { key: "upi", label: "UPI", kind: "inr" }, { key: "other", label: "इतर", kind: "inr" }, { key: "orders", label: "ऑर्डर्स", kind: "int" }, { key: "done", label: "पूर्ण ऑर्डर्स", kind: "int" }],
      rows: out, totals: { branch: "एकूण", ...t },
      summary: [{ label: "एकूण विक्री", value: fmtInr(t.sales) }, { label: "शाखा", value: String(out.length) }, { label: "रोख", value: fmtInr(t.cash) }, { label: "UPI", value: fmtInr(t.upi) }, { label: "सर्वोत्तम शाखा", value: out[0] && out[0].sales > 0 ? out[0].branch : "—" }],
    };
  }

  if (id === "stockday") {
    const rows = await q(
      `SELECT sd.day, b.name AS branch, f.name_mr AS fish, sd.price_per_kg AS price, sd.opening_kg AS opening, sd.added_kg AS added,
         COALESCE(w.q,0) AS wastage, ${SOLD} AS sold, ${SALES} AS sales_amt, (bd.day IS NOT NULL) AS uses_bills,
         ${EXPECTED_LEFT} AS expected_left, sd.closing_kg AS closing, sd.sold_out
       ${BASE} WHERE sd.day BETWEEN ? AND ?${bw} AND (sd.opening_kg>0 OR sd.added_kg>0 OR sd.closing_kg IS NOT NULL OR bq.kg IS NOT NULL)
       ORDER BY sd.day DESC, b.id, f.sort_order LIMIT ${MAX_ROWS + 1}`, args());
    const truncated = rows.length > MAX_ROWS;
    const out = rows.slice(0, MAX_ROWS).map((x) => {
      const known = !!x.uses_bills || x.closing !== null; // sales are known from bills, or once the closing stock is in
      return {
        day: dayStr(x.day), branch: shortBranch(String(x.branch)), fish: String(x.fish), price: num(x.price), opening: num(x.opening), added: num(x.added), wastage: num(x.wastage),
        sold: known ? num(x.sold) : null, sales: known ? num(x.sales_amt) : null, closing: x.closing === null ? null : num(x.closing),
        // Counter-billing days only: books say X should be left; the physical count says Y. Positive = stock missing / sold without a bill.
        variance: x.uses_bills && x.closing !== null ? num(x.expected_left) - num(x.closing) : null,
        status: x.sold_out || (x.closing !== null && num(x.closing) === 0) ? "संपले" : "उपलब्ध",
      };
    });
    const t = out.reduce((a, x) => ({ opening: a.opening + x.opening, added: a.added + x.added, wastage: a.wastage + x.wastage, sold: a.sold + (x.sold ?? 0), sales: a.sales + (x.sales ?? 0) }), { opening: 0, added: 0, wastage: 0, sold: 0, sales: 0 });
    return {
      id, title: "दैनिक स्टॉक", truncated,
      columns: [{ key: "day", label: "तारीख", kind: "date" }, { key: "branch", label: "शाखा", kind: "text" }, { key: "fish", label: "मासा", kind: "text" }, { key: "price", label: "भाव ₹/kg", kind: "inr" }, { key: "opening", label: "सुरुवात (kg)", kind: "kg" }, { key: "added", label: "नवीन आवक (kg)", kind: "kg" }, { key: "wastage", label: "वाया गेले (kg)", kind: "kg" }, { key: "sold", label: "विक्री (kg)", kind: "kg" }, { key: "closing", label: "क्लोजिंग (kg)", kind: "kg" }, { key: "variance", label: "तफावत (kg)", kind: "kg" }, { key: "sales", label: "विक्री रक्कम", kind: "inr" }, { key: "status", label: "स्थिती", kind: "text" }],
      rows: out, totals: { day: "एकूण", opening: t.opening, added: t.added, wastage: t.wastage, sold: t.sold, sales: t.sales },
      summary: [{ label: "सुरुवातीचा स्टॉक", value: fmtKg(t.opening) }, { label: "नवीन आवक", value: fmtKg(t.added) }, { label: "विक्री", value: fmtKg(t.sold) }, { label: "वाया गेले", value: fmtKg(t.wastage) }, { label: "विक्री रक्कम", value: fmtInr(t.sales) }],
    };
  }

  if (id === "bills") {
    const rows = await q(
      `SELECT bl.id, bl.bill_day, bl.bill_no, bl.created_at, b.name AS branch, bl.total, bl.discount, bl.payment_mode, bl.is_void, bl.customer_name,
         GROUP_CONCAT(CONCAT(bi.fish_name, ' ', bi.qty_kg, 'kg') SEPARATOR ', ') AS items
       FROM bills bl JOIN branches b ON b.id=bl.branch_id LEFT JOIN bill_items bi ON bi.bill_id=bl.id
       WHERE bl.bill_day BETWEEN ? AND ?${branchId ? " AND bl.branch_id=?" : ""} GROUP BY bl.id ORDER BY bl.id DESC LIMIT ${MAX_ROWS}`, args());
    const MODE: Record<string, string> = { cash: "रोख", upi: "UPI", other: "इतर" };
    const out = rows.map((x) => ({
      day: dayStr(x.bill_day), no: num(x.bill_no),
      time: new Date(x.created_at).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }),
      branch: shortBranch(String(x.branch)), items: String(x.items ?? ""), discount: num(x.discount), total: num(x.total),
      mode: MODE[x.payment_mode] ?? x.payment_mode, status: x.is_void ? "रद्द" : "पूर्ण", _void: !!x.is_void, _mode: String(x.payment_mode),
    }));
    const live = out.filter((x) => !x._void);
    const sum = (f: (x: (typeof out)[number]) => boolean) => live.filter(f).reduce((a, x) => a + x.total, 0);
    const rowsOut = out.map(({ _void, _mode, ...rest }) => { void _void; void _mode; return rest; });
    return {
      id, title: "काउंटर बिले",
      columns: [{ key: "day", label: "तारीख", kind: "date" }, { key: "no", label: "बिल क्र.", kind: "int" }, { key: "time", label: "वेळ", kind: "text" }, { key: "branch", label: "शाखा", kind: "text" }, { key: "items", label: "माल", kind: "text" }, { key: "discount", label: "सूट", kind: "inr" }, { key: "total", label: "रक्कम", kind: "inr" }, { key: "mode", label: "पेमेंट", kind: "text" }, { key: "status", label: "स्थिती", kind: "text" }],
      rows: rowsOut, totals: { day: "एकूण (रद्द वगळून)", discount: live.reduce((a, x) => a + x.discount, 0), total: sum(() => true) },
      summary: [{ label: "बिले", value: String(live.length) }, { label: "एकूण विक्री", value: fmtInr(sum(() => true)) }, { label: "रोख", value: fmtInr(sum((x) => x._mode === "cash")) }, { label: "UPI / इतर", value: fmtInr(sum((x) => x._mode !== "cash")) }, { label: "रद्द बिले", value: String(out.length - live.length) }],
    };
  }

  if (id === "orders") {
    const rows = await q(
      `SELECT o.id, o.created_at, b.name AS branch, o.customer_name, o.customer_phone, o.total, o.status,
         GROUP_CONCAT(CONCAT(i.fish_name, ' ', i.qty_kg, 'kg') SEPARATOR ', ') AS items
       FROM orders o JOIN branches b ON b.id=o.branch_id LEFT JOIN order_items i ON i.order_id=o.id
       WHERE DATE(CONVERT_TZ(o.created_at, @@session.time_zone, '+05:30')) BETWEEN ? AND ?${branchId ? " AND o.branch_id=?" : ""}
       GROUP BY o.id ORDER BY o.id DESC LIMIT ${MAX_ROWS}`, args());
    const ST: Record<string, string> = { new: "नवीन", confirmed: "कन्फर्म", ready: "तयार", completed: "पूर्ण", cancelled: "रद्द" };
    const out = rows.map((x) => ({ id: num(x.id), date: new Date(x.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: false }), branch: shortBranch(String(x.branch)), customer: String(x.customer_name), phone: String(x.customer_phone), items: String(x.items ?? ""), total: num(x.total), status: ST[x.status] ?? x.status }));
    const done = rows.filter((x) => x.status === "completed");
    return {
      id, title: "ऑर्डर्स",
      columns: [{ key: "id", label: "ऑर्डर #", kind: "int" }, { key: "date", label: "वेळ", kind: "text" }, { key: "branch", label: "शाखा", kind: "text" }, { key: "customer", label: "ग्राहक", kind: "text" }, { key: "phone", label: "मोबाईल", kind: "text" }, { key: "items", label: "माल", kind: "text" }, { key: "total", label: "अंदाजे रक्कम", kind: "inr" }, { key: "status", label: "स्थिती", kind: "text" }],
      rows: out, totals: { id: "एकूण", total: out.reduce((a, x) => a + x.total, 0) },
      summary: [{ label: "एकूण ऑर्डर्स", value: String(out.length) }, { label: "पूर्ण", value: String(done.length) }, { label: "रद्द", value: String(rows.filter((x) => x.status === "cancelled").length) }, { label: "पूर्ण ऑर्डर्सची रक्कम", value: fmtInr(done.reduce((a, x) => a + num(x.total), 0)) }],
    };
  }

  if (id === "purchases") {
    const rows = await q(
      `SELECT p.id, p.day, b.name AS branch, sp.name AS supplier, p.source, p.items_total, p.transport, p.other_charges, p.total, p.paid, p.payment_mode, p.status,
         (SELECT GROUP_CONCAT(CONCAT(f.name_mr, ' ', pi.qty_kg, 'kg') SEPARATOR ', ') FROM purchase_items pi JOIN fish_items f ON f.id=pi.fish_id WHERE pi.purchase_id=p.id) AS items
       FROM purchases p JOIN branches b ON b.id=p.branch_id LEFT JOIN suppliers sp ON sp.id=p.supplier_id
       WHERE p.day BETWEEN ? AND ?${branchId ? " AND p.branch_id=?" : ""} ORDER BY p.id DESC LIMIT ${MAX_ROWS}`, args());
    const PM: Record<string, string> = { cash: "रोख", upi: "UPI", bank: "बँक", credit: "उधार" };
    const out = rows.map((x) => ({ id: num(x.id), day: dayStr(x.day), branch: shortBranch(String(x.branch)), supplier: x.supplier ?? "—", source: x.source ?? "", items: String(x.items ?? ""), charges: num(x.transport) + num(x.other_charges), total: num(x.total), paid: num(x.paid), due: x.status === "received" ? num(x.total) - num(x.paid) : 0, mode: PM[x.payment_mode] ?? x.payment_mode, status: x.status === "received" ? "पूर्ण" : "रद्द", _live: x.status === "received" }));
    const live = out.filter((x) => x._live);
    const sum = (f: (x: (typeof out)[number]) => number) => live.reduce((a, x) => a + f(x), 0);
    return {
      id, title: "खरेदी",
      columns: [{ key: "id", label: "खरेदी #", kind: "int" }, { key: "day", label: "तारीख", kind: "date" }, { key: "branch", label: "शाखा", kind: "text" }, { key: "supplier", label: "पुरवठादार", kind: "text" }, { key: "source", label: "स्रोत", kind: "text" }, { key: "items", label: "माल", kind: "text" }, { key: "charges", label: "वाहतूक + इतर", kind: "inr" }, { key: "total", label: "एकूण", kind: "inr" }, { key: "paid", label: "दिले", kind: "inr" }, { key: "due", label: "बाकी", kind: "inr" }, { key: "mode", label: "पेमेंट", kind: "text" }, { key: "status", label: "स्थिती", kind: "text" }],
      rows: out.map(({ _live, ...r }) => { void _live; return r; }), totals: { id: "एकूण (रद्द वगळून)", charges: sum((x) => x.charges), total: sum((x) => x.total), paid: sum((x) => x.paid), due: sum((x) => x.due) },
      summary: [{ label: "खरेदी", value: String(live.length) }, { label: "एकूण रक्कम", value: fmtInr(sum((x) => x.total)) }, { label: "दिलेले", value: fmtInr(sum((x) => x.paid)) }, { label: "बाकी", value: fmtInr(sum((x) => x.due)) }],
    };
  }

  if (id === "cashclosing") {
    const rows = await q(
      `SELECT c.day, b.name AS branch, c.opening_cash, c.cash_sales, c.upi_sales, c.other_sales, c.cash_expenses, c.cash_purchases, c.expected_cash, c.counted_cash, c.difference, u.name AS by_name
       FROM cash_closings c JOIN branches b ON b.id=c.branch_id LEFT JOIN users u ON u.id=c.closed_by
       WHERE c.day BETWEEN ? AND ?${branchId ? " AND c.branch_id=?" : ""} ORDER BY c.day DESC, b.id LIMIT ${MAX_ROWS}`, args());
    const out = rows.map((x) => ({ day: dayStr(x.day), branch: shortBranch(String(x.branch)), opening: num(x.opening_cash), cash: num(x.cash_sales), upi: num(x.upi_sales) + num(x.other_sales), expenses: num(x.cash_expenses), purchases: num(x.cash_purchases), expected: num(x.expected_cash), counted: num(x.counted_cash), diff: num(x.difference), by: x.by_name ?? "" }));
    return {
      id, title: "रोख क्लोजिंग",
      columns: [{ key: "day", label: "तारीख", kind: "date" }, { key: "branch", label: "शाखा", kind: "text" }, { key: "opening", label: "सुरुवात", kind: "inr" }, { key: "cash", label: "रोख विक्री", kind: "inr" }, { key: "upi", label: "UPI / इतर", kind: "inr" }, { key: "expenses", label: "रोख खर्च", kind: "inr" }, { key: "purchases", label: "रोख खरेदी", kind: "inr" }, { key: "expected", label: "असायला हवी", kind: "inr" }, { key: "counted", label: "मोजलेली", kind: "inr" }, { key: "diff", label: "तफावत", kind: "inr" }, { key: "by", label: "कोणी", kind: "text" }],
      rows: out, totals: { day: "एकूण", cash: out.reduce((a, x) => a + x.cash, 0), upi: out.reduce((a, x) => a + x.upi, 0), expenses: out.reduce((a, x) => a + x.expenses, 0), diff: out.reduce((a, x) => a + x.diff, 0) },
      summary: [{ label: "दिवस बंद", value: String(out.length) }, { label: "एकूण तफावत", value: fmtInr(out.reduce((a, x) => a + x.diff, 0)) }, { label: "तफावतीचे दिवस", value: String(out.filter((x) => Math.abs(x.diff) >= 0.005).length) }],
    };
  }

  if (id === "staffpay") {
    const rows = await q(
      `SELECT p.day, b.name AS branch, s.name AS staff, p.kind, p.amount, p.for_month, p.advance_recovered, p.payment_mode, p.note
       FROM staff_payments p JOIN staff s ON s.id=p.staff_id JOIN branches b ON b.id=p.branch_id
       WHERE p.is_deleted=0 AND p.day BETWEEN ? AND ?${branchId ? " AND p.branch_id=?" : ""} ORDER BY p.day DESC, p.id DESC LIMIT ${MAX_ROWS}`, args());
    const K: Record<string, string> = { salary: "पगार", advance: "उचल", bonus: "बोनस" }, M: Record<string, string> = { cash: "रोख", upi: "UPI", bank: "बँक" };
    const out = rows.map((x) => ({ day: dayStr(x.day), branch: shortBranch(String(x.branch)), staff: String(x.staff), kind: K[x.kind], amount: num(x.amount), month: x.for_month ?? "", recovered: num(x.advance_recovered), mode: M[x.payment_mode], note: x.note ?? "", _k: String(x.kind) }));
    const sum = (k: string) => out.filter((x) => x._k === k).reduce((a, x) => a + x.amount, 0);
    return {
      id, title: "पगार / उचल",
      columns: [{ key: "day", label: "तारीख", kind: "date" }, { key: "branch", label: "शाखा", kind: "text" }, { key: "staff", label: "कर्मचारी", kind: "text" }, { key: "kind", label: "प्रकार", kind: "text" }, { key: "amount", label: "दिलेली रक्कम", kind: "inr" }, { key: "recovered", label: "उचल कपात", kind: "inr" }, { key: "month", label: "महिना", kind: "text" }, { key: "mode", label: "पद्धत", kind: "text" }, { key: "note", label: "टीप", kind: "text" }],
      rows: out.map(({ _k, ...r }) => { void _k; return r; }), totals: { day: "एकूण", amount: out.reduce((a, x) => a + x.amount, 0), recovered: out.reduce((a, x) => a + x.recovered, 0) },
      summary: [{ label: "पगार", value: fmtInr(sum("salary")) }, { label: "उचल", value: fmtInr(sum("advance")) }, { label: "बोनस", value: fmtInr(sum("bonus")) }, { label: "नोंदी", value: String(out.length) }],
    };
  }

  if (id === "expenses") {
    const rows = await q(
      `SELECT e.day, b.name AS branch, e.category, e.amount, e.payment_mode, e.note, u.name AS by_name
       FROM expenses e LEFT JOIN branches b ON b.id=e.branch_id LEFT JOIN users u ON u.id=e.created_by
       WHERE e.is_deleted=0 AND e.day BETWEEN ? AND ?${branchId ? " AND e.branch_id=?" : ""} ORDER BY e.day DESC, e.id DESC LIMIT ${MAX_ROWS}`, args());
    const out = rows.map((x) => ({ day: dayStr(x.day), branch: x.branch ? shortBranch(String(x.branch)) : "कंपनी (सामायिक)", category: EXPENSE_CATEGORIES[x.category as keyof typeof EXPENSE_CATEGORIES], amount: num(x.amount), mode: PAY_MODES[x.payment_mode as keyof typeof PAY_MODES], note: x.note ?? "", by: x.by_name ?? "" }));
    const total = out.reduce((a, x) => a + x.amount, 0);
    const byCat = new Map<string, number>();
    for (const x of out) byCat.set(x.category, (byCat.get(x.category) ?? 0) + x.amount);
    const top = [...byCat.entries()].sort((a, b) => b[1] - a[1])[0];
    return {
      id, title: "खर्च",
      columns: [{ key: "day", label: "तारीख", kind: "date" }, { key: "branch", label: "शाखा", kind: "text" }, { key: "category", label: "प्रकार", kind: "text" }, { key: "amount", label: "रक्कम", kind: "inr" }, { key: "mode", label: "पेमेंट", kind: "text" }, { key: "note", label: "टीप", kind: "text" }, { key: "by", label: "नोंद करणारा", kind: "text" }],
      rows: out, totals: { day: "एकूण", amount: total },
      summary: [{ label: "एकूण खर्च", value: fmtInr(total) }, { label: "नोंदी", value: String(out.length) }, { label: "सर्वाधिक खर्च", value: top ? `${top[0]} (${fmtInr(top[1])})` : "—" }],
    };
  }

  if (id === "customers") {
    const { rows, total } = await loadCustomers(branchId, "", MAX_ROWS, 0);
    const out = rows.map((c) => ({ name: c.name || "—", phone: c.phone, orders: c.orders, bills: c.bills, spend: c.spend, last: c.lastAt.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric" }) }));
    return {
      id, title: "ग्राहक",
      columns: [{ key: "name", label: "ग्राहक", kind: "text" }, { key: "phone", label: "मोबाईल", kind: "text" }, { key: "orders", label: "ऑर्डर्स", kind: "int" }, { key: "bills", label: "काउंटर बिले", kind: "int" }, { key: "spend", label: "एकूण खरेदी", kind: "inr" }, { key: "last", label: "शेवटची खरेदी", kind: "text" }],
      rows: out, totals: { name: "एकूण", orders: out.reduce((a, x) => a + x.orders, 0), bills: out.reduce((a, x) => a + x.bills, 0), spend: out.reduce((a, x) => a + x.spend, 0) },
      summary: [{ label: "ग्राहक", value: String(total) }, { label: "एकूण खरेदी", value: fmtInr(out.reduce((a, x) => a + x.spend, 0)) }],
    };
  }

  // wastage
  const rows = await q(
    `SELECT w.day, b.name AS branch, f.name_mr AS fish, w.qty_kg, w.reason, w.cost_per_kg, w.note, u.name AS by_name
     FROM wastage w JOIN branches b ON b.id=w.branch_id JOIN fish_items f ON f.id=w.fish_id LEFT JOIN users u ON u.id=w.created_by
     WHERE w.is_deleted=0 AND w.day BETWEEN ? AND ?${branchId ? " AND w.branch_id=?" : ""} ORDER BY w.day DESC, w.id DESC LIMIT ${MAX_ROWS}`, args());
  const out = rows.map((x) => ({ day: dayStr(x.day), branch: shortBranch(String(x.branch)), fish: String(x.fish), qty: num(x.qty_kg), reason: REASONS[x.reason as keyof typeof REASONS], value: num(x.cost_per_kg) > 0 ? num(x.qty_kg) * num(x.cost_per_kg) : null, note: x.note ?? "", by: x.by_name ?? "" }));
  const tq = out.reduce((a, x) => a + x.qty, 0);
  return {
    id: "wastage", title: "वाया गेलेला माल",
    columns: [{ key: "day", label: "तारीख", kind: "date" }, { key: "branch", label: "शाखा", kind: "text" }, { key: "fish", label: "मासा", kind: "text" }, { key: "qty", label: "प्रमाण (kg)", kind: "kg" }, { key: "reason", label: "कारण", kind: "text" }, { key: "value", label: "मूल्य", kind: "inr" }, { key: "note", label: "टीप", kind: "text" }, { key: "by", label: "नोंद करणारा", kind: "text" }],
    rows: out, totals: { day: "एकूण", qty: tq, value: out.reduce((a, x) => a + (x.value ?? 0), 0) },
    summary: [{ label: "नोंदी", value: String(out.length) }, { label: "एकूण वाया गेले", value: fmtKg(tq) }],
  };
}
