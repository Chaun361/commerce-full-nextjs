import { prisma } from "@/prisma/prismaClient";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export async function GET(req: Request) {
    
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    
    if (!refreshToken) return Response.json({message: 'Unauthorized'}, {status: 401});

    const foundUser = await prisma.user.findFirst({
        where: { refresh_token: refreshToken },
    })

    if (!foundUser) return Response.json({message: 'Unauthorized'}, {status: 401});

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
            .setExpirationTime('1h')
            .sign(accessSecret);
        
        return Response.json({
            email: foundUser.email, role: foundUser.role, accessToken: accessToken 
        });
    }
    catch (error: any) {
        return Response.json({ error: error.message }, { status: 401 })
    }

    
}
