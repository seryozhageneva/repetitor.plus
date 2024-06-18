import { useState, useEffect } from "react";
import axios from '../api/axios';
import { Link, useNavigate, useParams } from "react-router-dom";

const CONFIRM_URL = '/auth/confirm';

const ConfirmEmail = () => {
    const { token } = useParams();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const confirmAccount = async () => {
            try {
                const response = await axios.get(`${CONFIRM_URL}/${token}`);
                console.log(JSON.stringify(response?.data));
                setSuccess(true);
            } catch (err) {
                if (!err?.response) {
                    setErrMsg('No Server Response');
                } else {
                    setErrMsg('Confirmation Failed');
                }
            }
        };
        confirmAccount();
    }, [token]);

    return (
        <section>
            <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            {success ? (
                <div>
                    <h1>Account Activated Successfully!</h1>
                    <p>
                        <Link to="/login">Login Now</Link>
                    </p>
                </div>
            ) : (
                <div>
                    <h1>Activating Account...</h1>
                    <p>Please wait while we confirm your account.</p>
                </div>
            )}
        </section>
    );
};

export default ConfirmEmail;
