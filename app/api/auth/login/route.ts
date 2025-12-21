import { prisma } from "@/prisma/prismaClient";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose"
import { serialize } from 'cookie'

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        
        const foundUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!foundUser) return Response.json({ error: "User not found" }, { status: 404 });

        const storedHashPassword = foundUser.password_hash;
        const isPasswordMatch = await bcrypt.compare(password, storedHashPassword);
        if (!isPasswordMatch) return Response.json({ error: "Email or Passoword mismatch" }, { status: 401  });

        const payload = {
            userId: foundUser.id,
            role: foundUser.role,
            'urn:example:claim': true
        }

        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        if (!accessSecret || !refreshSecret) {
            return Response.json({ error: "Internal Server Error" }, { status: 500 });
        }
        const accessKey = new TextEncoder().encode(accessSecret);
        const refreshKey = new TextEncoder().encode(refreshSecret);

        const accessToken = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('5m')
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
        
        //send cookie
        const refreshCookie = serialize('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60, // 60 minutes
            path: '/',
        })

        const accessCookie = serialize('session', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 5, // 15 Minutes (Sync with token exp)
            path: '/',
        });

        const headers = new Headers();
        
        headers.append('Set-Cookie', refreshCookie);
        headers.append('Set-Cookie', accessCookie);

        return Response.json({
            user: { email: email, role: foundUser.role }    
        }, 
        {
            headers: headers, 
        });
    } catch (error) {
        return Response.json({ error: "Invalid request body" }, { status: 400 })
    }
}