import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const FORGOT_PASSWORD_URL = '/auth/forgot_password';
const RECOVERY_REQUEST_SENT_URL = '/recovery_request_sent';

const ForgotPassword = () => {
    const navigate = useNavigate();

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setErrMsg('Please enter your email.');
            return;
        }

        try {
            await axios.post(FORGOT_PASSWORD_URL, { email: user });
            navigate(RECOVERY_REQUEST_SENT_URL);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Error: Could not process your request.');
            }
            errRef.current.focus();
        }
    };

    return (
        <section>
            <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
                {errMsg}
            </p>
            <h1>Forgot Password</h1>
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
                <button>Reset Password</button>
            </form>
            <p>
                <span className="line">
                    <Link to="/login">Login</Link>
                </span>
            </p>
        </section>
    );
};

export default ForgotPassword;
