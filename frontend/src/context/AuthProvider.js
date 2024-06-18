import {createContext, useState} from "react";
import Cookies from "js-cookie";

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState(() => {
        const accessToken = Cookies.get('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (!accessToken && !refreshToken) {
            return {};
        }

        return {
            accessToken: accessToken || null
        };
    });

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;