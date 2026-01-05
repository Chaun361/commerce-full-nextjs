import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        
        const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

        const { payload } = await jwtVerify(token, secret);

        const response = NextResponse.next();
        response.headers.set('userId', payload.userId as string);
        return response;
    }
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 403 })
    }
}

export const config = {
    matcher: [
        '/api/((?!auth|products).*)',
        
    ]
}