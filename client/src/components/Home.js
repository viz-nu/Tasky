import { Link } from "react-router-dom";
import clock from "./clock_img.jpg";
function Home() {
    return(
        <>
        <div className="home">
            <center>
                <div>
                    <img src={clock} alt="img" />
                </div>
                <Link to="/dashboard"> <h3>Tasky App</h3></Link> 
                <Link to="/register"> <h5>New here? register </h5></Link> 
                <Link to="/login"> <h5>Or login </h5></Link> 
                
                
                
            </center>
        </div>
        </>
    );
}
export default Home