import { prisma } from "@/prisma/prismaClient";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const foundUser = await prisma.user.findUnique({
            where: { email },
        });
        if (foundUser) return Response.json({error: "Email already existed"}, {status: 409})

        const saltRounds = 10
        const hashedPwd = await bcrypt.hash(password, saltRounds);

        await prisma.user.create({
            data: {
                email: email,
                password_hash: hashedPwd
            }
        })

        return Response.json({status: 200})
    }
    catch (error) {
        console.error(error);
        return Response.json({ error: "Failed to register" }, { status: 500 })
    }
}