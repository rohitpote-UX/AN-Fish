import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { parseRange } from "@/lib/dateRange";
import { REPORT_LIST, runReport } from "@/lib/reports";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (s.role === "counter") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const sp = Object.fromEntries(req.nextUrl.searchParams);
  const meta = REPORT_LIST.find((r) => r.id === sp.type);
  if (!meta || (meta.headOnly && s.role === "branch_admin")) return NextResponse.json({ error: "Bad report" }, { status: 400 });

  const range = parseRange(sp);
  // A branch admin can only ever export their own branch.
  const branchId = s.role === "branch_admin" ? s.branchId : /^\d+$/.test(sp.branch ?? "") ? Number(sp.branch) : null;
  const report = await runReport(meta.id, range, branchId);

  let branchName = "सर्व शाखा";
  if (branchId) {
    const [b] = await db().query<RowDataPacket[]>("SELECT name FROM branches WHERE id=?", [branchId]);
    branchName = b[0]?.name ?? String(branchId);
  }

  const wb = new ExcelJS.Workbook();
  wb.creator = "AN Fish World";
  const ws = wb.addWorksheet(report.title.slice(0, 31), { views: [{ state: "frozen", ySplit: 6 }] });
  const n = report.columns.length;
  const navy = "FF071D2B";

  ws.mergeCells(1, 1, 1, n); ws.getCell(1, 1).value = "AN FISH WORLD"; ws.getCell(1, 1).font = { bold: true, size: 18, color: { argb: "FF0EA5A0" } };
  ws.mergeCells(2, 1, 2, n); ws.getCell(2, 1).value = report.title; ws.getCell(2, 1).font = { bold: true, size: 14 };
  ws.mergeCells(3, 1, 3, n); ws.getCell(3, 1).value = `कालावधी: ${range.from} ते ${range.to}`;
  ws.mergeCells(4, 1, 4, n); ws.getCell(4, 1).value = `शाखा: ${branchName}`;
  ws.mergeCells(5, 1, 5, n); ws.getCell(5, 1).value = `तयार केले: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;
  ws.getCell(5, 1).font = { color: { argb: "FF7A8794" }, italic: true };

  const head = ws.getRow(6);
  report.columns.forEach((c, i) => {
    const cell = head.getCell(i + 1);
    cell.value = c.label;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
    cell.alignment = { vertical: "middle", horizontal: c.kind === "text" || c.kind === "date" ? "left" : "right", wrapText: true };
  });
  head.height = 24;

  const fmt = { kg: "#,##0.00", inr: '"₹"#,##0', int: "0", text: "@", date: "@" } as const;
  const addRow = (data: Record<string, string | number | null>, bold = false) => {
    const row = ws.addRow(report.columns.map((c) => data[c.key] ?? null));
    report.columns.forEach((c, i) => {
      const cell = row.getCell(i + 1);
      if (c.kind === "kg" || c.kind === "inr" || c.kind === "int") { cell.numFmt = fmt[c.kind]; cell.alignment = { horizontal: "right" }; }
      if (bold) { cell.font = { bold: true }; cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8F4F3" } }; }
    });
  };
  report.rows.forEach((r) => addRow(r));
  if (report.totals) addRow(report.totals, true);

  report.columns.forEach((c, i) => {
    const maxLen = Math.max(c.label.length, ...report.rows.slice(0, 200).map((r) => String(r[c.key] ?? "").length));
    ws.getColumn(i + 1).width = Math.min(48, Math.max(12, maxLen + 3));
  });
  ws.autoFilter = { from: { row: 6, column: 1 }, to: { row: 6, column: n } };

  // Summary on a second sheet
  const sm = wb.addWorksheet("सारांश");
  sm.addRow(["AN FISH WORLD — " + report.title]).font = { bold: true, size: 14 };
  sm.addRow([`कालावधी: ${range.from} ते ${range.to}`, `शाखा: ${branchName}`]);
  sm.addRow([]);
  report.summary.forEach((x) => { const r = sm.addRow([x.label, x.value]); r.getCell(1).font = { bold: true }; });
  sm.getColumn(1).width = 30; sm.getColumn(2).width = 24;

  const buf = await wb.xlsx.writeBuffer();
  const file = `AN-Fish_${report.id}_${range.from}_${range.to}.xlsx`;
  return new NextResponse(buf as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${file}"`,
      "Cache-Control": "no-store",
    },
  });
}
