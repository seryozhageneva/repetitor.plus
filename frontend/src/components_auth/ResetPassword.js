import { useRef, useState } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from '../api/axios';

const RESET_PASSWORD_URL = '/auth/reset_password/';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const pwdRef = useRef();
    const confirmPwdRef = useRef();
    const errRef = useRef();

    const [pwd, setPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const handlePwdChange = (e) => {
        setPwd(e.target.value);
        setValidMatch(e.target.value === confirmPwd);
    };

    const handleConfirmPwdChange = (e) => {
        setConfirmPwd(e.target.value);
        setValidMatch(pwd === e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validMatch) {
            setErrMsg("Passwords do not match.");
            return;
        }

        try {
            await axios.post(`${RESET_PASSWORD_URL}${token}`, { password: pwd });
            navigate('/login');
        } catch (err) {
            setErrMsg('Error: Could not reset password.');
            errRef.current.focus();
        }
    }

    return (
        <>
            <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="password">
                    Password:
                    <FontAwesomeIcon icon={faCheck} className={validMatch ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validMatch || !pwd ? "hide" : "invalid"} />
                </label>
                <input
                    type="password"
                    id="password"
                    ref={pwdRef}
                    onChange={handlePwdChange}
                    value={pwd}
                    required
                />

                <label htmlFor="confirm_pwd">
                    Confirm Password:
                    <FontAwesomeIcon icon={faCheck} className={validMatch ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validMatch || !confirmPwd ? "hide" : "invalid"} />
                </label>
                <input
                    type="password"
                    id="confirm_pwd"
                    ref={confirmPwdRef}
                    onChange={handleConfirmPwdChange}
                    value={confirmPwd}
                    required
                />

                <button disabled={!pwd || !confirmPwd || !validMatch}>Set Password</button>
            </form>
            <p>
                <span className="line">
                    <Link to="/login">Login</Link>
                </span>
            </p>
            </section>
        </>
    )
}

export default ResetPassword;
