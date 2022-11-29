import { Link, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import clock from "./clock_img.jpg";
import { useState, useEffect } from "react";
import Alert from "./Alert";
import axios from 'axios'

function ResetPwd({ alert, showAlert, loading, showLoading }) {
    const navigate = useNavigate()
    useEffect(() => {
        if (localStorage.getItem("token")) {
            console.log("token exists", localStorage.getItem("token"));
            navigate("/dashboard", { replace: true })
        }
    });
    const [RstpwdData, setRstpwdData] = useState({
        emailId: "",
        password1: "",
        password2: ""
    });
    const onChangeHandler = (e) => {
        setRstpwdData({
            ...RstpwdData,
            [e.target.name]: e.target.value
        });
    }
    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
              showLoading(true);
                const { data }= await axios.post("/api/user/rstpwd",RstpwdData);
                showLoading(false);
            console.log(data);
            showAlert({
                type: "success",
                msg: data.success
              });
        } catch (error) {
            if (localStorage.getItem("token")) { localStorage.removeItem("token") }
            console.log(error);

            showAlert({
                type: "danger",
                msg: error.response.data.error
            })
            showLoading(false);
        }
    }
    return (
        <>
            <div className="container">
                <div style={{ marginTop: "20%" }}>
                    <center>
                        <Link to="/">
                            <img src={clock} alt="img" style={{ width: "20%" }} />
                            <h1> Tasky Password Reset</h1>
                            {loading && <Loading />}
                        </Link>

                    </center>
                </div>
                <div>
                    <Alert alert={alert} />
                    <form onSubmit={onSubmitHandler} >
                        <label htmlFor="emailId"><b>Email:</b></label><br />
                        <input type="email" name="emailId" onChange={onChangeHandler} /><br />
                        <label htmlFor="password1"><b>Password</b></label><br />
                        <input type="password" name="password1" onChange={onChangeHandler} /><br /><br />
                        <label htmlFor="password2"><b> conform Password</b></label><br />
                        <input type="password" name="password2" onChange={onChangeHandler} /><br /><br />
                        <input type="submit" value="reset" />
                    </form>

                </div>
            </div>


        </>
    )
}
export default ResetPwd;





