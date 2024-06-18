import {Navigate, Outlet, useLocation} from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
    const {auth} = useAuth();
    const location = useLocation();

    return (
        auth?.accessToken
            ? <Outlet/>
            : <Navigate to="/unauthorized" state={{from: location}} replace/>
    );
}

export default RequireAuth;