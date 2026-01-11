'use server'

import { prisma } from "@/prisma/prismaClient";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export async function refreshToken() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    
    if (!refreshToken) throw Error('Unauthorized');

    const foundUser = await prisma.user.findFirst({
        where: { refresh_token: refreshToken },
    })

    if (!foundUser) throw Error('Unauthorized');

    try {
        const refreshSecret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);
        await jwtVerify(refreshToken, refreshSecret);

        const accessSecret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

        const accessToken = await new SignJWT({
            userId: foundUser.id ,
            email: foundUser.email,
            role: foundUser.role
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('10m')
            .sign(accessSecret);

        const secure = process.env.NODE_ENV === 'production';
        cookieStore.set({
            name: 'accessToken',
            value: accessToken,
            httpOnly: true,
            secure,
            sameSite: 'lax',
            maxAge: 60 * 10,
            path: '/',
        });

        
        return { userId: foundUser.id};
    }
    catch (error: any) {
        console.error(error);
        throw Error('Internal server error');
    }
}