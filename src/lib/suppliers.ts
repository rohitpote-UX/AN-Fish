/** What we still owe a supplier: opening balance + received purchases − paid at purchase − later payments. (alias `s` = suppliers) */
export const OUTSTANDING_SQL = `s.opening_balance
  + COALESCE((SELECT SUM(p.total - p.paid) FROM purchases p WHERE p.supplier_id=s.id AND p.status='received'),0)
  - COALESCE((SELECT SUM(sp.amount) FROM supplier_payments sp WHERE sp.supplier_id=s.id),0)`;
