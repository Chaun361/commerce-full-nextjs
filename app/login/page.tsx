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

    const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      setError('');
    };
    const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setError('');
    };
    
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-800 p-6">
      <section className="w-full max-w-md bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl ring-1 ring-white/10 p-8">
        <form className="flex flex-col" onSubmit={onLogin} >
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Sign in to your account</h2>

          <label htmlFor="email" className="text-sm font-medium text-slate-200">Email</label>
          <input 
              type="email" 
              name="email" 
              id="email"
              placeholder="you@example.com" 
              value={email}
              onChange={onEmailChange}
              className="mt-1 mb-4 px-4 py-2 rounded-md bg-white text-slate-900 placeholder-slate-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
          />

          <label htmlFor="password" className="text-sm font-medium text-slate-200">Password</label>
          <input 
              type="password" 
              name="password" 
              id="password"
              placeholder="yourpassword" 
              value={password}
              onChange={onPasswordChange}
              className="mt-1 mb-4 px-4 py-2 rounded-md bg-white text-slate-900 placeholder-slate-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
          />

          {error ? (
            <p className="text-sm text-red-300 bg-red-900/40 px-3 py-2 rounded mb-4">{error}</p>
          ) : null}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md shadow hover:bg-indigo-700 hover:cursor-pointer transition mb-3"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => router.push('/register')}
            className="w-full text-sm text-indigo-100/90 bg-white/5 border border-white/10 py-2 rounded-md hover:bg-white/10 transition"
          >
            Register
          </button>
        </form>
      </section>
    </div>
  )
}

export default LoginPage