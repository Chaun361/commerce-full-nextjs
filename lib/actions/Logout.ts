'use server'

import { prisma } from "@/prisma/prismaClient";
import { cookies } from "next/headers";

export async function logout() {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value;
        
        if (!refreshToken) {
            // If no refresh token, ensure access token is gone and return success
            cookieStore.delete('accessToken');
            return { success: true };
        }

        const foundUser = await prisma.user.findFirst({
            where: { refresh_token: refreshToken },
        })

        if (!foundUser) {
            cookieStore.delete('refreshToken');
            cookieStore.delete('accessToken');
            return {success: true};
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
        cookieStore.delete('accessToken');

        return {success: true};
    }
    catch (error) {
        console.error(error);
        throw new Error(String(error ?? 'Internal server error'));
    }
}