import axios from "../config/axios";
import { setAccessToken } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/store";

const useRefreshToken = () => {
    const dispatch = useAppDispatch();

    const refresh = async () => {
        const response = await axios.get('/api/auth/refresh', 
            { withCredentials: true }
        );
        dispatch(setAccessToken(response.data.accessToken));
        
        return response.data.accessToken;
    }
    
    return refresh;
}

export default useRefreshToken;