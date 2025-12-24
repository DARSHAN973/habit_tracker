import { cookies } from "next/headers";
import {prisma} from "@/app/lib/prisma";

export async function getCurrentUser () {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get("session")?.value;

    if(!sessionToken){
        return null ;
    }

    try {
        const session = await prisma.session.findUnique({
            where: { token: sessionToken },
            include: { user: true },
        });

        if(!session) return null;

        if (session.expiresAt < new Date()) return null;

        return session.user;
    } catch (err) {
        console.error("getCurrentUser prisma error:", err);
        // If the database is unreachable, return null so pages treat the user as unauthenticated
        // instead of crashing the server rendering.
        return null;
    }
}