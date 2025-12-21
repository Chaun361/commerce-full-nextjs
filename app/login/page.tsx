'use client'

import { useActionState, useEffect } from "react"
import { login } from './action';
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const router = useRouter();

    const initState = {
        message: ''
    }

    const [state, formAction] = useActionState(login, initState);

    useEffect(() => {
        localStorage.removeItem('isLogin');
    }, []);

    useEffect(() => {
        if (state.message === 'Login successful') {
            router?.push('/');

            localStorage.setItem('isLogin', 'true');
        }
    }, [state.message, router])

  return (
    <form action={formAction}>
        <input type="email" name="email" placeholder="Your email" />
        <input type="password" name="password" placeholder="Your password"/>
        <p>{state.message}</p>
        <button>Login</button>
    </form>
  )
}

export default LoginPage