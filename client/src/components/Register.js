

import { Link, useNavigate } from "react-router-dom";
import clock from "./clock_img.jpg";
import { useState } from "react";
import Alert from "./Alert";
import axios from 'axios';
import Loading from "./Loading";






function Register({ alert, showAlert, loading, showLoading }) {
  let navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    fname: "",
    email: "",
    phone: "",
    password: "",
    password2: ""
  });

  const onChangeHandler = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  }
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      if (registerData.password !== registerData.password2) {
        showAlert({
          type: "danger",
          msg: "Passwords do not match"
        });

      } else {

        showLoading(true);
        showAlert({
          type: "success",
          msg: "Passwords do match"
        });
        // console.log(registerData);
        const { data } = await axios.post("/api/user/register", registerData);
        showLoading(false);
        showAlert({
          type: "success",
          msg: data.success
        });

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);

      }
    } catch (error) {
      // console.log(error.response.data.errors[0].msg);
      showAlert({
        type: "danger",
        msg: error.response.data.errors[0].msg
      })
      showLoading(false);
    }
  }


  return (
    <>
      <div className="container">
        <div>
          <center>
            <Link to="/">
              <img src={clock} alt="img" style={{ width: "15%" }} />
              <h1> Tasky Register</h1>
            </Link>
            {loading && <Loading />}
          </center>
        </div>
        <div>
          <Alert alert={alert} />
          <form onSubmit={onSubmitHandler} autoComplete="off">
            <label htmlFor="fname"><b>Full Name :</b></label>
            <input type="text" name="fname" onChange={onChangeHandler} />
            <label htmlFor="email"><b>Email:</b></label>
            <input type="email" name="email" onChange={onChangeHandler} />
            <label htmlFor="fullname" placeholder="+91-123-456-7890"><b>Phone Number(with country code):</b></label>
            <input type="tel" name="phone" onChange={onChangeHandler} />
            <label htmlFor="lname"><b>Password</b></label>
            <input type="password" name="password" onChange={onChangeHandler} />
            <label htmlFor="lname"><b>Confirm Password</b></label>
            <input type="password" name="password2" onChange={onChangeHandler} />
            <input type="submit" value="Register" />
          </form>
        </div>
        <p>Already have an account ? <Link to="/login"> <b>Login </b> </Link></p>
      </div>
    </>
  )
}

export default Register;















