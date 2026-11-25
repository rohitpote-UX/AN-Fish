import type { BillData } from "@/lib/pos";

const MODE: Record<string, string> = { cash: "रोख", upi: "UPI", other: "इतर" };
const inr = (n: number) => n.toLocaleString("en-IN");

/** Thermal-printer receipt (58 mm or 80 mm). Pure black on white, no colours, no images. */
export function Receipt({ bill, widthMm }: { bill: BillData; widthMm: 58 | 80 }) {
  const small = widthMm === 58;
  const rule = <div style={{ borderTop: "1px dashed #000", margin: "5px 0" }} />;
  return (
    <div
      style={{ width: `${widthMm}mm`, padding: small ? "3mm 2mm" : "4mm 3mm", fontFamily: "'Baloo 2', system-ui, sans-serif", fontSize: small ? 11 : 13, lineHeight: 1.3, color: "#000", background: "#fff", boxSizing: "border-box" }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: small ? 15 : 18, fontWeight: 800, letterSpacing: 0.5 }}>AN FISH WORLD</div>
        <div style={{ fontWeight: 700 }}>{bill.branchName}</div>
        {bill.branchAddress && <div style={{ fontSize: small ? 9.5 : 11 }}>{bill.branchAddress}</div>}
        {bill.branchPhone && <div style={{ fontSize: small ? 10 : 12 }}>फोन: +{bill.branchPhone}</div>}
      </div>
      {rule}
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
        <span>बिल क्र. {bill.billNo}</span>
        <span>{bill.day.split("-").reverse().join("/")} {bill.time}</span>
      </div>
      {bill.isVoid && <div style={{ textAlign: "center", fontWeight: 800, border: "2px solid #000", margin: "4px 0", padding: 2 }}>रद्द केलेले बिल</div>}
      {rule}
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}><span>माल / वजन × भाव</span><span>रक्कम</span></div>
      {bill.items.map((i, k) => (
        <div key={k} style={{ marginTop: 3 }}>
          <div style={{ fontWeight: 700 }}>{i.name}</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{i.qty.toFixed(3).replace(/\.?0+$/, "")} kg × ₹{inr(i.rate)}</span>
            <span style={{ fontWeight: 700 }}>{inr(i.amount)}</span>
          </div>
          {i.cut && <div style={{ fontSize: small ? 9.5 : 11 }}>कटिंग: {i.cut}</div>}
        </div>
      ))}
      {rule}
      {bill.discount > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>एकूण</span><span>₹{inr(bill.subtotal)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>सूट</span><span>- ₹{inr(bill.discount)}</span></div>
        </>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: small ? 15 : 18, fontWeight: 800, marginTop: 2 }}>
        <span>देय रक्कम</span><span>₹{inr(bill.total)}</span>
      </div>
      <div style={{ marginTop: 2 }}>पेमेंट: {MODE[bill.mode]}</div>
      {(bill.customerName || bill.customerPhone) && <div>ग्राहक: {bill.customerName ?? ""} {bill.customerPhone ?? ""}</div>}
      {rule}
      <div style={{ textAlign: "center", fontWeight: 700 }}>धन्यवाद! पुन्हा भेट द्या.</div>
      <div style={{ textAlign: "center", fontSize: small ? 9 : 10.5 }}>ताजी मासोळी · कराडची लाडकी</div>
    </div>
  );
}

/** Sets the paper size for the browser's print dialog. */
export function PrintPageStyle({ widthMm }: { widthMm: 58 | 80 }) {
  return <style>{`@media print { @page { size: ${widthMm}mm auto; margin: 0; } html, body { background: #fff !important; width: ${widthMm}mm; } }`}</style>;
}
