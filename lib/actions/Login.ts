'use server'

import { prisma } from "@/prisma/prismaClient";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose"
import { cookies } from 'next/headers'

export async function login({email,password} : {email: string, password: string}) {
    try {
        const foundUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!foundUser) throw Error('Unauthorized');

        const storedHashPassword = foundUser.password_hash;
        const isPasswordMatch = await bcrypt.compare(password, storedHashPassword);
        if (!isPasswordMatch) throw Error('Unauthorized');

        const payload = {
            userId: foundUser.id,
            role: foundUser.role,
        }

        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        if (!accessSecret || !refreshSecret) {
            throw Error('Internal server error');
        }
        const accessKey = new TextEncoder().encode(accessSecret);
        const refreshKey = new TextEncoder().encode(refreshSecret);

        const accessToken = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('10m')
            .sign(accessKey);
        const refreshToken = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1h')
            .sign(refreshKey);

        //save refresh token
        
        await prisma.user.update({
            where: {
                id: foundUser.id
            },
            data: {
                refresh_token: refreshToken
            }
        })
        
        // send cookies using Next.js server-side cookies API
        const secure = process.env.NODE_ENV === 'production';
        const cookieStore = await cookies();
        
        cookieStore.set({
            name: 'accessToken',
            value: accessToken,
            httpOnly: true,
            secure,
            sameSite: 'lax',
            maxAge: 60 * 10,
            path: '/',
        });

        cookieStore.set({
            name: 'refreshToken',
            value: refreshToken,
            httpOnly: true,
            secure,
            sameSite: 'lax',
            maxAge: 60 * 60,
            path: '/',
        });

        return { userId: payload.userId };

    } catch (error: any) {
        console.log(error);
        throw Error('Internal server error');
    }
}