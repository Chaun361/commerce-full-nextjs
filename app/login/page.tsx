'use client'

import { useState, ChangeEvent, FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, } from "@/lib/store";
import { login } from "@/lib/features/auth/authSlice";

const LoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('from') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const dispatch = useAppDispatch()

    const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
    
    const onLogin = async (e: FormEvent) => {
      e.preventDefault();
      try {
        await dispatch(login({email: email, password: password})).unwrap();
        router.push(redirectPath);
      }
      catch (error: any) {
        setError(error.error);
      }
    }
    

  return (
    <form>
        <input 
            type="email" 
            name="email" 
            placeholder="Your email" 
            value={email}
            onChange={onEmailChange}
        />
        <input 
            type="password" 
            name="password" 
            placeholder="Your password"
            value={password}
            onChange={onPasswordChange}
        />
        <p>{error}</p>
        <button onClick={onLogin}>Login</button>
    </form>
  )
}

export default LoginPage