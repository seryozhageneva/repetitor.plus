import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import Cookies from 'js-cookie';

const LOGIN_URL = '/auth/login';

const Login = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !pwd) {
            setErrMsg('Please enter email and password.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(LOGIN_URL, { email: user, password: pwd });
            const { access_token, refresh_token } = response.data;

            Cookies.set('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            setAuth({ accessToken: access_token });

            setLoading(false);
            navigate(from, { replace: true });
        } catch (err) {
            setLoading(false);
            if (!err.response) {
                setErrMsg('No Server Response');
            } else if (err.response.status === 400) {
                setErrMsg('Invalid Username or Password');
            } else if (err.response.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    };

    return (

        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button>Sign In</button>
            </form>
            <p>
                <span className="line">
                    <Link to="/forgot_password">Forgot Password</Link>
                </span>
            </p>
            <p>
                <span className="line">
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>
        </section>

    )
}

export default Login
