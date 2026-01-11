'use client'

import { refreshToken } from "@/lib/actions/RefreshToken"
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"

type ChildrenType = { children: ReactNode }

type AuthType = {
    userId: number
}

export type AuthContextType = {
    auth: AuthType | null
    setAuth: Dispatch<SetStateAction<AuthType | null>>
    persist: boolean
    setIsPersist: Dispatch<SetStateAction<boolean>>
}

const initContextState: AuthContextType = {
    auth: null,
    setAuth: (() => {}) as Dispatch<SetStateAction<AuthType | null>>,
    persist: false,
    setIsPersist: (() => {}) as Dispatch<SetStateAction<boolean>>,
}

export const AuthContext = createContext<AuthContextType>(initContextState);

export const AuthProvider = ({children}: ChildrenType) => {
    const [auth, setAuth] = useState<AuthType | null>(null);
    const [persist, setIsPersist] = useState<boolean>(false);

    useEffect(() => {
        const refresh = async () => {
            try {
                const response = await refreshToken();
                setAuth(response);
            }
            catch (error: any) {
                setAuth(null);
            }
            
        }
        const localPersist = localStorage.getItem("persist");
        const shouldPersist = localPersist === "true";
        setIsPersist(shouldPersist);

        refresh();

    }, []);

    return (
        <AuthContext.Provider value={{auth, setAuth, persist, setIsPersist}}>
            {children}
        </AuthContext.Provider>
    );
}
