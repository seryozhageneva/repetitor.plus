import Register from './components_auth/Register';
import Login from './components_auth/Login';
import Profile from './components_auth/Profile';
import Layout from './components_auth/Layout';
import Missing from './components_auth/Missing';
import Unauthorized from './components_auth/Unauthorized';
import Home from './components_auth/Home';
import RequireAuth from './components_auth/RequireAuth';
import {Route, Routes} from 'react-router-dom';
import ForgotPassword from "./components_auth/ForgotPassword";
import ResetPassword from "./components_auth/ResetPassword";
import RecoveryRequestSent from "./components_auth/RecoveryRequestSent";
import ConfirmEmail from "./components_auth/ConfirmEmail";
import Private from './components_tutor/Private';


function App() {
    return (
        <Routes>
            <Route path="/">
                {/* private */}
                <Route element={<RequireAuth/>}>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/" element={<Private />} />
                </Route>
                {/* public */}
                <Route path="/" element={<Layout/>}>
                    <Route path="home" element={<Home/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="register" element={<Register/>}/>
                    <Route path="unauthorized" element={<Unauthorized/>}/>
                    <Route path="forgot_password" element={<ForgotPassword/>}/>
                    <Route path="reset_password/:token" element={<ResetPassword/>}/>
                    <Route path="recovery_request_sent" element={<RecoveryRequestSent/>}/>
                    <Route path="confirm_email/:token" element={<ConfirmEmail/>}/>
                </Route>

                {/* unknown */}
                <Route path="*" element={<Missing/>}/>
            </Route>
        </Routes>
    );
}

export default App;