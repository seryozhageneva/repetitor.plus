import {Link, Outlet} from "react-router-dom"

const Layout = () => {
    return (
        <main className="App">
            {/* <h1>
                <Link to="/">Home page</Link>
            </h1> */}
            <Outlet/>
        </main>
    )
}

export default Layout
