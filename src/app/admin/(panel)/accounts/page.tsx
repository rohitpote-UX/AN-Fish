import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { requireAbnexa } from "@/lib/adminAuth";
import { CreateHeadForm, HeadRow } from "./AccountForms";

export default async function AccountsPage() {
  await requireAbnexa();
  const [rows] = await db().query<RowDataPacket[]>("SELECT id, name, login_id, is_active FROM users WHERE role='super_admin' ORDER BY id");
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">सुपर अ‍ॅडमिन खाती</h1>
        <p className="text-sm text-[#071C2C]/60">AN Fish World च्या मुख्य कार्यालयासाठी. हे लॉगिन सर्व शाखांचा स्टॉक, भाव आणि ऑर्डर्स पाहू शकतात, पण पेमेंट/फी आणि नवीन शाखा तयार करणे फक्त Abnexa ला दिसते.</p>
      </div>
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#071C2C]/10 sm:p-6">
        <h2 className="mb-4 text-lg font-extrabold">नवीन सुपर अ‍ॅडमिन</h2>
        <CreateHeadForm />
      </section>
      <ul className="space-y-3">
        {rows.map((r) => <HeadRow key={r.id} id={r.id} name={r.name} loginId={r.login_id} active={!!r.is_active} />)}
        {rows.length === 0 && <li className="rounded-xl bg-white p-6 text-center text-[#071C2C]/60">अजून सुपर अ‍ॅडमिन नाही.</li>}
      </ul>
    </div>
  );
}
