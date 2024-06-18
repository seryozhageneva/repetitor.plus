import {useState} from "react";
import axios from '../api/axios';
import {Link} from "react-router-dom";

const REGISTER_URL = '/auth/register';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || password !== confirmPassword) {
            setErrMsg("Please fill in all fields correctly.");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL, {email, password});
            console.log(JSON.stringify(response?.data));
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Email Taken');
            } else {
                setErrMsg('Registration Failed')
            }
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success! Confirm your account in the mail.</h1>
                    <p>
                        <Link to="/login">Sign In</Link>
                    </p>
                </section>
            ) : (
                <section>
                    <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />

                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            required
                        />

                        <button disabled={!email || !password || password !== confirmPassword}>Sign Up</button>
                    </form>
                    <p>
                        Already registered? <Link to="/login">Sign In</Link>
                    </p>
                </section>
            )}
        </>
    )
}

export default Register
