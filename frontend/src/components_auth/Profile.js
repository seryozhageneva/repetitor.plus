import { useNavigate, Link } from "react-router-dom";
import {useContext, useState} from "react";
import AuthContext from "../context/AuthProvider";
import Cookies from 'js-cookie';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Profile = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [operationStatus, setOperationStatus] = useState('');
    const axiosPrivate = useAxiosPrivate();

    const logout = async () => {
        Cookies.remove('access_token');
        localStorage.removeItem('refresh_token');
        setAuth({});
        navigate('/');
    }


    const performPrivateOperation = async () => {
        try {
            const response = await axiosPrivate.get('/api/protected');
            if (response.status === 200) {
                setOperationStatus('Operation Successful!');
            } else {
                setOperationStatus('Operation Failed');
            }
        } catch (error) {
            setOperationStatus('Error occurred while performing operation');
        }
    };

    return (
        <section>
            <h1>Profile</h1>
            <br/>
            <Link to="/">Go to Home</Link>
            <div className="flexGrow">
                <button onClick={logout}>Sign Out</button>
                <button onClick={performPrivateOperation}>Perform Private Operation</button>
                {operationStatus && <p>{operationStatus}</p>}
            </div>
        </section>
    )
}

export default Profile
