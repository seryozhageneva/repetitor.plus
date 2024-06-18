import { Link } from "react-router-dom"

const Home = () => {
    return (
        <section>
            <h1>Links</h1>
            <br />
            <h2>Public</h2>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <br />
            <h2>Private</h2>
            <Link to="/profile">Profile</Link>
        </section>
    )
}

export default Home
