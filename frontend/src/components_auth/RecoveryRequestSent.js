import {Link, useNavigate} from "react-router-dom"

const RecoveryRequestSent = () => {
    const navigate = useNavigate();


    return (
        <section>
            <h1>Recovery Request Sent</h1>
            <br/>
            <p>The recovery link has been sent to your email.</p>
            <div className="flexGrow">
                <Link to="/login">Login</Link>
            </div>
        </section>
    )
}

export default RecoveryRequestSent
