import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const token = request.cookies.get('session')?.value;

    const loginUrl = new URL('/login', request.url);
    
    if (!token) return NextResponse.redirect(loginUrl);

    try {
        const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

        const { payload } = await jwtVerify(token, secret);

        const response = NextResponse.next();
        response.headers.set('userId', payload.userId as string);
        return response;
    }
    catch (error) {
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: [
        '/((?!api/auth|api/products|login|products|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).+)',
    ]
}