import { Routes , Route } from "react-router-dom";
import Private from "./private";


import Home from "../pages/home";
import Register from "../pages/Register";
import Admin from "../pages/Admin"

//meuuuu
function RouterApp(){
    return(
        <Routes>
            <Route path="/" element= { <Home/>} ></Route>
            <Route path="/register" element= { <Register/>} ></Route>


            <Route path="/admin" element= { <Private> <Admin/> </Private> } ></Route>           
        </Routes>
    )
}

export default RouterApp