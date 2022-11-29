
import './App.css';
import ResetPwd from './components/ResetPwd';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import {Route,Routes,BrowserRouter} from "react-router-dom";
import PrivatesRoutes from './utils/PrivateRoutes';
import { useState } from 'react';
import ScheduleTask from './components/ScheduleTasks';


function App() {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const showAlert = (alert) => {
    setAlert(alert);
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  }
  const showLoading = (status) => {
    setLoading(status);
  }
  return (
    <BrowserRouter>
    <Routes>
    <Route path='/ResetPwd' element={<ResetPwd  alert={alert} showAlert={showAlert} loading={loading} showLoading={showLoading}/>} />
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login alert={alert} showAlert={showAlert} loading={loading} showLoading={showLoading}/>}/>
      <Route path='/register' element={<Register alert={alert} showAlert={showAlert} loading={loading} showLoading={showLoading} />} />
      <Route element={<PrivatesRoutes />}>
            <Route path="/dashboard" element={<Dashboard loading={loading} showLoading={showLoading} alert={alert} showAlert={showAlert} />} /> </Route>
            <Route path="/dashboard/add" element={<ScheduleTask loading={loading} showLoading={showLoading} alert={alert} showAlert={showAlert}/>} />
            
    </Routes>
    </BrowserRouter>
  );
}

export default App;
