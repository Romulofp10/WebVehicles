import { Outlet } from "react-router-dom";
import { NavBar } from "../navbar/NavBar";

export function Layout(){
    return(
        <>
        <NavBar/>
        <Outlet/>
        </>
    )
}