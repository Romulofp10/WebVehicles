import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { FaChartBar,FaPlus } from "react-icons/fa";

export function PanelHeader(){
    async function handleLogOut(){
        await signOut(auth);
    }

    return(
        <div className="w-full items-center flex h-10 bg-green-500 text-black font-medium gap-4 px-4 mb-4 rounded-sm">
            <Link to='/dashboard' className="flex items-center"> DashBoard <FaChartBar className="ml-1"/>  </Link>
            <Link to='/dashboard/NewVehicle' className="flex items-center">New<FaPlus className="ml-1"/> </Link>
            <button className="ml-auto" onClick={handleLogOut}>LogOut</button>
        </div>
    )
}