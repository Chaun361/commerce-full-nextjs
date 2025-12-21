'use server'

import { cookies } from "next/headers";

export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
        return { message: 'Please provide both email and password' };
    }

    try {
        const response = await fetch('http://localhost:3000/api/auth/login',
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password})
            }
        )

        const data = await response.json();

        // 1. Read all Set-Cookie headers from the API response
        const setCookieHeaders = response.headers.getSetCookie();
        console.log(setCookieHeaders)
        if (setCookieHeaders) {
            for (const cookieStr of setCookieHeaders) {
                // 2. Parse the cookie (simplistic parsing for name=value)
                const [cookieNameValue] = cookieStr.split(';');
                const [name, ...valueParts] = cookieNameValue.split('=');
                const value = valueParts.join('=');

                // 3. Set the cookie on the user's browser
                (await cookies()).set(name, value, { httpOnly: true, path: '/', secure: true });
            }
        }

        if (!response.ok) {
            return { message: data.error || "Login failed" };
        }

        return { message: 'Login successful' };
    }
    catch (error) {
        return { message: error }
    }
}