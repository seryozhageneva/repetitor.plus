import axios from '../api/axios';
import useAuth from './useAuth';
import Cookies from 'js-cookie';

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            const response = await axios.post('/auth/refresh', {}, {
                headers: {
                    Authorization: `Bearer ${refreshToken}`
                },
                withCredentials: true
            });

            const { access_token, refresh_token } = response.data;

            if (access_token && refresh_token) {
                Cookies.set('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);

                setAuth(prev => ({
                    ...prev,
                    accessToken: access_token,
                }));
            }
        } catch (error) {
            console.error('Failed to refresh token', error);
        }
    };
    return refresh;
};

export default useRefreshToken;
