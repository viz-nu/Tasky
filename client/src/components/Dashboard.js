import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Alert from "./Alert";



function Dashboard({ loading, showLoading, alert, showAlert }) {
  let navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
  }
  const [tasks, setTasks] = useState([]);
  const [edit, setEdit] = useState(false);
  const [taskId, setTaskId] = useState();
  const [formData, setFormData] = useState({
    taskname: "",
    deadline: "",
    notificationType: "",
    isCompleted: false
  });

  const OnclickHandler = async (id) => {
    try {


      await axios.delete(`api/task/delete/${id}`, {
        headers: {
          'auth-token': localStorage.getItem("token")
        }
      });

      const newArray = tasks.filter((task) => {
        return task._id !== id;
      })
      setTasks(newArray);
    }
    catch (error) {
      console.log(error);

    }
  }

  const EditingHandler = (ele) => {
    setEdit(true);
    setTaskId(ele._id);

    setFormData({
      taskname: ele.taskname,
      deadline: ele.deadline,
      notificationType: ele.notificationType,
      isCompleted: ele.isCompleted
    })

  }



  const onChange = (e) => {

    let name = e.target.name;
    let value = e.target.value;


    if (name === "isCompleted") {
      setFormData({
        ...formData,
        [name]: e.target.checked
      });

    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

  }

  const isGonnaSave = async (id) => {
    try {
      const { data } = await axios.put(`/api/task/edit/${id}`, formData, {
        headers: {
          'auth-token': localStorage.getItem("token")
        }
      });
      showAlert({
        type: "success",
        msg: data.success
      });

      let newArray = tasks.filter((task) => {
        return task._id !== id;
      })

      newArray = newArray.push(formData);

      setTasks(newArray);
      
      navigate("/login");


    }
    catch (error) {
      console.log(error.response.data.error)
      console.log(error);
      showAlert({
        type: "danger",
        msg: error.response.data.error
      });
    }
  }

  const convertDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString();
  }
  useEffect(() => {
    async function getTasks() {
      try {
        const { data } = await axios.get("/api/task/", {
          headers: {
            'auth-token': localStorage.getItem("token")
          }
        })
        setTasks(data.tasks);
      }
      catch (error) {
        console.log(error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
    getTasks();
  })
  return (
    <>
      <div style={{ backgroundColor: "#e5e5e5", padding: "15px", textAlign: "center" }}>

        <h1>Tasky App</h1>
      </div>
      <div style={{ overflow: "auto" }}>
        {loading && <Loading />}
        <div className="main">
          <Alert alert={alert} />

          {tasks.length === 0 ? (
            <>
              <h2 style={{ textAlign: "center" }}>
                {" "}
                There are no Jobs currently
              </h2>
            </>
          ) : (
            <>

              <table id="tasklist">
                <thead>
                  <tr>
                    <th>S. No </th>
                    <th>Task Name</th>
                    <th>Deadline</th>
                    <th>Notification Type</th>
                    <th>Task Status</th>
                    <th >Edit</th>
                    {edit ? null : (<th>Delete</th>)}
                  </tr>
                </thead>
                {edit ? (
                  <tbody>

                    <tr >
                      <td>1</td>
                      <td >
                        <input
                          type="text"
                          placeholder="Enter your taskname"
                          name="taskname"
                          value={formData.taskname}
                          onChange={onChange}
                        />
                      </td>
                      <td >
                        <input
                          type="datetime-local"
                          placeholder="Enter your Task Deadline"
                          name="deadline"
                          value={formData.deadline}
                          onChange={onChange}
                        />
                      </td>
                      <td >
                        <select name="notificationType" onChange={onChange} value={formData.notificationType}>
                          <option value="">
                            Choose your Notification Type
                          </option>
                          <option value="sms">SMS</option>
                          <option value="email">Email</option>
                          <option value="both">Both</option>
                        </select>
                      </td>
                      <td >
                        <input
                          type="checkbox"
                          name="isCompleted"
                          checked={formData.isCompleted}
                          onChange={onChange}
                        ></input>
                      </td>
                      <td>
                        <button className="btn2" onClick={() => { isGonnaSave(taskId) }}>
                          Save
                        </button>
                      </td>

                    </tr>

                  </tbody>

                ) : (
                  <tbody>
                    {

                      tasks.map((ele, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{ele.taskname}</td>
                          <td>{convertDate(ele.deadline)}</td>
                          <td>{ele.notificationType}</td>
                          <td>{ele.isCompleted ? "true" : "false"}</td>
                          <td>{
                            ele.isCompleted ? "Cannot Edit" : <button className="btn2" onClick={() => EditingHandler(ele)}>
                              Edit
                            </button>
                          }

                          </td>
                          <td>
                            <button
                              className="btn2"
                              style={{ color: "red", backgroundColor: "white" }}
                              onClick={() => OnclickHandler(ele._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                )}
              </table>
            </>
          )}
        </div>
        <div className="menu">
          <Link to="/dashboard/add">Add a new Task</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/" onClick={logout}>Log out</Link>
        </div>
      </div>
    </>
  )

}

export default Dashboard;

