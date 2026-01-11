import { AuthContext, AuthContextType } from "@/app/context/AuthProvider"
import { useContext } from "react"

const UseAuth = (): AuthContextType => {
    return useContext(AuthContext);
}

export default UseAuth;