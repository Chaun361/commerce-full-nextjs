'use client'

import { getAuthStatus } from "@/lib/features/auth/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const RequireAuth = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
    const router = useRouter();
    const pathname = usePathname();

    const loginStatus = useSelector(getAuthStatus);

    useEffect(() => {
        if ( loginStatus !== 'succeeded')   
            router.push(`/login?from=${pathname}`);
    }, [loginStatus, router, pathname]);

    if ( loginStatus !== 'succeeded') return null;

  return (
    <>
        {children}
    </>
  )
}

export default RequireAuth