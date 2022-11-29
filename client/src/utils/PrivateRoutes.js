import { Outlet, Navigate } from "react-router-dom";

function PrivatesRoutes() {
    let auth = localStorage.getItem("token");
    // console.log(auth);
    return (
        auth ? <Outlet /> : <Navigate to="/login" />
    )

}

export default PrivatesRoutes; 