import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

/**
 * Two sites, one codebase:
 *  - admin.<domain>  → the admin panel (files live under src/app/admin)
 *  - everything else → the public, localized website
 * Locally use http://admin.localhost:3000 (browsers resolve *.localhost automatically).
 */
export default function proxy(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase();
  const { pathname } = req.nextUrl;
  const isAdminHost = host.startsWith("admin.");
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminHost) {
    // Clean URLs on the subdomain: /admin/login → /login
    if (isAdminPath) {
      const url = req.nextUrl.clone();
      url.pathname = pathname.slice("/admin".length) || "/";
      return NextResponse.redirect(url);
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin" + (pathname === "/" ? "" : pathname);
    return NextResponse.rewrite(url);
  }

  if (isAdminPath && process.env.NODE_ENV === "production") {
    // The panel must only be reachable on the admin subdomain.
    const url = req.nextUrl.clone();
    url.host = "admin." + host.replace(/^www\./, "");
    url.pathname = pathname.slice("/admin".length) || "/";
    return NextResponse.redirect(url);
  }
  if (isAdminPath) return NextResponse.next(); // dev convenience: localhost:3000/admin

  return intl(req);
}

export const config = {
  // Everything except api, Next internals and files with an extension.
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
