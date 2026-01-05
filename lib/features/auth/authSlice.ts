import axios from "@/config/axios";
import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";

type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type User = {
    email: string,
    role: 'CUSTOMER' | 'ADMIN',
    accessToken: string
}

const initialState = {
    user: null as User | null,
    status: 'idle' as AuthStatus,
    error: null as any
}

export const login = createAsyncThunk('auth/login', 
    async ({email, password}: {email: string, password: string}, {rejectWithValue}) => {
    try {
        const response = await axios.post('/api/auth/login', {email, password});
        return response.data.user;
    }
    catch (error: any) {
        return rejectWithValue(error.response.data);
    }
})

export const logout = createAsyncThunk('auth/logout', 
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.post('/api/auth/logout');
            return response.data;
        }
        catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            if (state.user) {
                state.user.accessToken = action.payload;
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(login.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(logout.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.status = 'idle';
                state.user = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
    } 
})

export const getUser = (state: {auth: typeof initialState }) => state.auth?.user;
export const getAuthStatus = (state: {auth: typeof initialState }) => state.auth?.status;
export const getAuthError = (state: {auth: typeof initialState }) => state.auth?.error;

export const { setAccessToken } = authSlice.actions;

export default authSlice.reducer;