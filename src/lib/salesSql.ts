/**
 * One definition of "sold" and "sales" for every report and the dashboard.
 *
 *  - A branch-day that has at least one non-cancelled counter bill is measured from the BILLS
 *    (kg billed, and rupees billed after the bill's discount is shared across its items).
 *  - A branch-day without bills falls back to the closing-stock formula (opening + new − wastage − closing),
 *    which only counts once the closing stock has been entered.
 *
 * Requires the aliases: sd (stock_days) and w (wastage sums), plus SALES_JOINS below.
 */
export const SALES_JOINS = `
  LEFT JOIN (SELECT bl.branch_id, bi.fish_id, bl.bill_day AS day, SUM(bi.qty_kg) AS kg,
               SUM(bi.amount * bl.total / NULLIF(bl.subtotal, 0)) AS amt
             FROM bill_items bi JOIN bills bl ON bl.id=bi.bill_id WHERE bl.is_void=0
             GROUP BY bl.branch_id, bi.fish_id, bl.bill_day) bq
    ON bq.branch_id=sd.branch_id AND bq.fish_id=sd.fish_id AND bq.day=sd.day
  LEFT JOIN (SELECT DISTINCT branch_id, bill_day AS day FROM bills WHERE is_void=0) bd
    ON bd.branch_id=sd.branch_id AND bd.day=sd.day`;

const CLOSING_SOLD = "(sd.opening_kg+sd.added_kg-COALESCE(w.q,0)-sd.closing_kg)";

export const SOLD = `CASE WHEN bd.day IS NOT NULL THEN COALESCE(bq.kg,0)
  WHEN sd.closing_kg IS NULL THEN 0 ELSE ${CLOSING_SOLD} END`;

export const SALES = `CASE WHEN bd.day IS NOT NULL THEN COALESCE(bq.amt,0)
  WHEN sd.closing_kg IS NULL THEN 0 ELSE ${CLOSING_SOLD}*sd.price_per_kg END`;

/** Expected remaining according to the books (counter billing days only). */
export const EXPECTED_LEFT = "(sd.opening_kg+sd.added_kg-COALESCE(w.q,0)-COALESCE(bq.kg,0))";
