import { getSession } from "@/lib/session";
import { logoutAction } from "../login/actions";

export default async function AdminHome() {
  const s = (await getSession())!;
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 font-[Baloo_2,sans-serif]">
      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#071C2C]/10">
        <p className="text-sm font-semibold text-[#0D9488]">
          {s.role === "super_admin" ? "सुपर अ‍ॅडमिन" : "शाखा अ‍ॅडमिन"}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold">नमस्कार, {s.name}</h1>
        <p className="mt-2 text-[#071C2C]/65">लॉगिन यशस्वी. पुढच्या टप्प्यात इथे शाखा, स्टॉक आणि ऑर्डर्स येतील.</p>
        <form action={logoutAction} className="mt-6">
          <button className="h-11 rounded-xl border border-[#071C2C]/20 px-5 font-bold hover:bg-[#071C2C]/5">लॉगआउट</button>
        </form>
      </div>
    </main>
  );
}
