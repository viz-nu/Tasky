import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Alert from "./Alert";


function ScheduleTask({ loading, showLoading,alert,showAlert }) {

    let navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
    }

    
    const [disable, setDisable] = useState(true);
    const [formData, setFormData] = useState({
        taskname: "",
        deadline: "",
        notificationType: "",
        agree: ""
    });



    const handleChange = (e) => {

        let name = e.target.name;
        let value = e.target.value;

        if (name === "agree") {
            setFormData({
                ...formData,
                [name]: e.target.checked
            });
            (e.target.checked) ? setDisable(false) : setDisable(true)
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            formData.deadline = new Date(formData.deadline);
            const { data } = await axios.post("/api/task/add", formData, {
                headers: {
                    'auth-token': localStorage.getItem("token")
                }
            });
            showAlert({
                type: "success",
                msg: data.success
            });
        } catch (error) {
            console.log(error.response.data.error)
            console.log(error);
            showAlert({
                type: "danger",
                msg: error.response.data.error
            });
        }
    }

    useEffect(() => {
        async function fetchUser() {
            try {
                showLoading(true);
                const { data } = await axios.get("/api/user/auth", {
                    headers: {
                        'auth-token': localStorage.getItem("token")
                    }
                });
                console.log(data);
                showLoading(false);
            } catch (error) {
                localStorage.removeItem("token");
                showLoading(false);
                navigate("/login");
            }
        }
        fetchUser();
        // eslint-disable-next-line
    }, []);


    return (
        <>
            <div style={{ backgroundColor: "#e5e5e5", padding: "15px", textAlign: "center" }}>

                <h1>Tasky App</h1>
            </div>
            <div style={{ overflow: "auto" }}>
                {loading && <Loading />}
                <div className="main">
                    <h2>Schedule New Tasks</h2>
                    <Alert alert={alert} />
                    <hr />
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <label htmlFor="taskname">
                            <b>Task Name</b>
                        </label><br />
                        <input
                            type="text"
                            placeholder="Enter your taskname"
                            name="taskname"
                            value={formData.taskname}
                            onChange={handleChange}
                        />
                        <label htmlFor="deadline">
                            <b>Deadline</b>
                        </label> <br />
                        <input
                            type="datetime-local"
                            placeholder="Enter your Task Deadline"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                        /><br />
                        <label htmlFor="notificationType"><b>Notification Type</b></label> <br />

                        <select name="notificationType" onChange={handleChange}>
                            <option value="">Choose your Notification Type</option>
                            <option value="sms">SMS</option>
                            <option value="email">Email</option>
                            <option value="both">Both</option>
                        </select>
                        <hr />
                        <input
                            type="checkbox"
                            name="agree"
                            value={formData.agree}
                            onChange={handleChange}
                        ></input>

                        <label htmlFor="agree">
                            By clicking Schedule Job Button below, you agree to receive emails
                            and messages as reminder notifications
                        </label> <br />
                        <br /><br />
                        <input type="submit" value="Schedule Job" id="button" disabled={disable} />
                    </form>
                </div>
                <div className="menu">
                <Link to="/">Add a new Task</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/" onClick={logout}>Log out</Link>
            </div>
              
            </div>
            
        </>
    )
}

export default ScheduleTask;