import { ReactNode,useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Loading } from "../components/loading/Loading";

interface privateProps{
    children: ReactNode
}

export function Private({children}:privateProps):any{
    const {signed,loadingAuth} = useContext(AuthContext);

    if(loadingAuth){
       return <Loading/>
    }

    if(!signed){
        return <Navigate to='/login'/>
    }
    return children;    
}