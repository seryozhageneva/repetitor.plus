import {axiosPrivate} from "../api/axios";
import {useEffect} from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const {auth, setAuth} = useAuth();

    useEffect(() => {

        const requestInterceptor = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        const responseInterceptor = axiosPrivate.interceptors.response.use(
            response => response,
            async error => {
                if (error?.response?.status === 401 && !error?.config?.retry) {
                    error.config.retry = true;
                    try {
                        await refresh();
                        error.config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                        return axiosPrivate(error.config);
                    } catch (refreshError) {
                        console.error('Failed to refresh token:', refreshError);
                        setAuth({});
                        return Promise.reject(error);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestInterceptor);
            axiosPrivate.interceptors.response.eject(responseInterceptor);
        }
    }, [auth, refresh])

    return axiosPrivate;
}

export default useAxiosPrivate;