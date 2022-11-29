
import { Link ,useNavigate} from "react-router-dom";
import clock from "./clock_img.jpg";
import Alert from "./Alert";
import { useState,useEffect } from "react";
import axios from 'axios'
import Loading from "./Loading";

function Login({ alert, showAlert,loading,showLoading }) {
  const navigate =useNavigate()

  useEffect(() => {
    if(localStorage.getItem("token")){ 
        console.log("token exists",localStorage.getItem("token"));
        navigate("/dashboard",{replace:true})
    }
  });
  
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
      });
      const onChangeHandler = (e) => {
        setLoginData({
          ...loginData,
          [e.target.name]: e.target.value
        });
      }
    
      const onSubmitHandler = async (e)  => {
        try { 
          e.preventDefault();
         
          showLoading(true);
            const { data }= await axios.post("/api/user/login",loginData);
            showLoading(false);
            localStorage.setItem("token",data.token);
           navigate("/dashboard",{replace:true})
        } catch (error) {
          if(localStorage.getItem("token")){localStorage.removeItem("token")}
          console.log(error);
         
     showAlert({
       type: "danger",
       msg:error.response.data.error
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
                        <img src={clock} alt="img"  style={{ width: "20%" }} />
                            <h1> Tasky Login</h1>
                            {loading && <Loading />}
                        </Link>
                        
                    </center>
                </div>
                
                <div>
                <Alert alert={alert} />
                    <form onSubmit={onSubmitHandler} >
                    
                        <label htmlFor="email"><b>Email:</b></label><br />
                        <input type="email" name="email"  onChange={onChangeHandler} /><br />
                        <label htmlFor="password"><b>Password</b></label><br />
                        <input type="password" name="password"  onChange={onChangeHandler}/><br /><br />
                        <input type="submit" value="Login" />
                    </form>
                    <Link to="/ResetPwd"><b> Forgot password ?</b> </Link>
                </div>
                <p> Don't you have an account ? <Link to="/register"><b>Register</b> </Link></p>
                
            </div>
        </>
    )
}

export default Login;