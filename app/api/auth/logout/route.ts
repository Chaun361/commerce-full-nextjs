import { prisma } from "@/prisma/prismaClient";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value;
        
        if (!refreshToken) return Response.json({message: 'Unauthorized'}, {status: 401});

        const foundUser = await prisma.user.findFirst({
            where: { refresh_token: refreshToken },
        })

        if (!foundUser) {
            cookieStore.delete('refreshToken');
            return Response.json({message: 'Logged out'}, {status: 200})
        }

        await prisma.user.update({
            where: { 
                email: foundUser.email 
            },
            data: {
                refresh_token: null
            }
        })

        cookieStore.delete('refreshToken');
        cookieStore.delete('session');
        return Response.json({message: 'Logged out'}, {status: 200})
    }
    catch (error) {
        console.error(error);
        return Response.json({message: 'Failed logout'}, {status: 500})
    }
}