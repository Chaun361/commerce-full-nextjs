import { jwtVerify } from "jose";
import { redirect, RedirectType } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value;
    const prevPath = request.url.split('/').at(-1);   

    if (!token) return NextResponse.redirect(new URL(`/login?from=${prevPath}`, request.url));

    try {
        
        const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
        
        const { payload } = await jwtVerify(token, secret);

        const requestHeaders = new Headers(request.headers);

        requestHeaders.set('userId', payload.userId as string);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            }
        });
    }
    catch (error: any) {
        return NextResponse.redirect(new URL(`/login?from=${prevPath}`, request.url));
    }
}

export const config = {
    matcher: [
        '/cart',
        '/api/cart/:path*'
    ]
}