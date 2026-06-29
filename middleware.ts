// export { default } from '@/lib/supabase-ssr'

import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
    let supabaseResponse = NextResponse.next({ request: req });
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return req.cookies.getAll() },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        req.cookies.set(name, value);
                        supabaseResponse = NextResponse.next({ request: req })
                        cookiesToSet.forEach(({ name, value, options }) => {
                            supabaseResponse.cookies.set(name, value, options)
                        })
                    })
                },
            }
        }
    )
    //refresh session
    const { data: { user } } = await supabase.auth.getUser();

    if (!user && req.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/login', req.url))
    }
    if (user && req.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL('/admin', req.url))
    }
    return supabaseResponse
}

export const config = {
    matcher: ['/admin/:path*', '/login']
}