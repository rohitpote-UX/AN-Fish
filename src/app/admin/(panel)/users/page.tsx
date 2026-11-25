import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { requireSuper } from "@/lib/adminAuth";
import { NewUserForm, UserActions } from "./UserForms";

const ROLE: Record<string, { t: string; cls: string }> = {
  branch_admin: { t: "मॅनेजर", cls: "bg-sky-100 text-sky-800" },
  counter: { t: "कॅशियर", cls: "bg-orange-100 text-orange-800" },
};

export default async function UsersPage() {
  await requireSuper();
  const [users] = await db().query<RowDataPacket[]>(
    `SELECT u.id, u.login_id, u.name, u.role, u.is_active, b.name AS branch FROM users u LEFT JOIN branches b ON b.id=u.branch_id
     WHERE u.role IN ('branch_admin','counter') ORDER BY b.id, u.role, u.id`);
  const [branches] = await db().query<RowDataPacket[]>("SELECT id, name FROM branches WHERE is_active=1 ORDER BY id");
  const short = (n: string) => String(n ?? "").replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "");
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">वापरकर्ते (Users)</h1>
        <p className="text-sm text-[#7A8794]">प्रत्येक शाखेचे मॅनेजर आणि कॅशियर. मॅनेजर शाखेचा स्टॉक, भाव, ऑर्डर्स आणि रिपोर्ट्स पाहतो; कॅशियर फक्त बिलिंग करतो. सुपर अ‍ॅडमिन खाती Abnexa व्यवस्थापित करते.</p>
      </div>
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#172B3A]/8">
        <h2 className="mb-4 text-lg font-extrabold">नवीन वापरकर्ता</h2>
        <NewUserForm branches={branches.map((b) => ({ id: b.id, name: short(b.name) }))} />
      </section>
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#172B3A]/8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="bg-[#F5F7FA] text-xs font-bold text-[#7A8794]"><th className="px-4 py-3">नाव</th><th>लॉगिन आयडी</th><th>शाखा</th><th>भूमिका</th><th>स्थिती</th><th /></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className={`border-t border-[#172B3A]/8 ${u.is_active ? "" : "opacity-55"}`}>
                  <td className="px-4 py-3 font-bold">{u.name}</td>
                  <td className="text-[#172B3A]/80">{u.login_id}</td>
                  <td>{short(u.branch)}</td>
                  <td><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${ROLE[u.role].cls}`}>{ROLE[u.role].t}</span></td>
                  <td>{u.is_active ? "सुरू" : <span className="font-bold text-red-600">बंद</span>}</td>
                  <td className="px-3"><UserActions id={u.id} active={!!u.is_active} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
