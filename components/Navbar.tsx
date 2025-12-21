"use client"

import { useEffect, useState, MouseEvent } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import axios from '@/config/axios'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setIsLogin(localStorage.getItem('isLogin') === 'true');
  }, [pathname])

  const logout = async (event: MouseEvent) => {
    event.preventDefault();
    localStorage.removeItem('isLogin');
    setIsLogin(false);
    await axios.post('/api/auth/logout')
    router.push('/')
  }

  const logoutMobile = async (event: MouseEvent) => {
    event.preventDefault();
    localStorage.removeItem('isLogin');
    setIsLogin(false);
    setIsOpen(false);
    await axios.post('/api/auth/logout')
    router.push('/')
  }

  // Define your application routes here.
  // API routes are excluded from this list.
  const routes = [
    { name: 'Home', path: '/' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Order History', path: '/history' },
  ]

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-indigo-400">
                IT-ECOM
              </Link>
            </div>
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={`px-3 py-1 rounded-xs text-sm font-medium transition-colors ${
                      pathname === route.path
                        ? 'border-b-4 border-indigo-500 text-white'
                        : 'text-gray-300  hover:text-white'
                    }`}
                  >
                    {route.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
 
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className={`text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-full transition-colors ${
                pathname === '/cart'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
              <span className={`sr-only`}>Cart</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </Link>

            {/* Login Button (Desktop) */}
            <div className="hidden md:block">
                {
                    isLogin
                    ? <button
                        onClick={(e) => logout(e)}
                        className="bg-transparent text-white border-2 border-zinc-400 hover:border-zinc-700 hover:cursor-pointer text-white px-3 py-1 rounded-sm text-sm font-medium transition-colors"
                    >
                        Logout
                    </button>
                    : <Link
                        href="/login"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        Login
                    </Link>
                }
              
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none hover:cursor-pointer"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col gap-3">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-1 rounded-xs text-base font-medium m-auto ${
                  pathname === route.path
                    ? 'border-b-4 border-indigo-500 text-white'
                    : 'text-gray-300  hover:text-white'
                }`}
              >
                {route.name}
              </Link>
            ))}

            { 
                isLogin 
                ? <button
                    onClick={(e) => logoutMobile(e)}
                    className="block w-full text-center mt-4 bg-transparent text-white border-2 border-zinc-400 hover:border-zinc-700 hover:cursor-pointer text-white px-4 py-2 rounded-md text-base font-medium"
                    >
                        Logout
                </button>
                : 
                <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-base font-medium"
                    >
                        Login
                </Link>
            }
            
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar