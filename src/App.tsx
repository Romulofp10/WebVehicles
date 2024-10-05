import { Register } from "./pages/register/Register"
import { DashBoard } from "./pages/Dashboard/Dashboard"
import { Login } from "./pages/login/Login"
import { VehicleDetails } from "./pages/vehicle/VehicleDetails"
import { NewVehicle } from "./pages/Dashboard/new/NewVehicle"
import { Home } from "./pages/home/Home"
import { Layout } from "./components/layout/Layout"
import { createBrowserRouter } from "react-router-dom"
import { Private } from "./routes/Private"

const router = createBrowserRouter([

{
  element: <Layout/>,
  children:[
    {
      path: '/',
      element: <Home/>
    },
    {
      path: '/vehicleDetails/:id',
      element: <VehicleDetails/>
    },
    {
      path: '/login',
      element: <Login/>
    },
    {
      path: '/register',
      element: <Register/>
    },
    {
      path: '/dashboard',
      element: <Private><DashBoard/></Private>
    },
    {
      path: '/dashboard/NewVehicle',
      element: <Private><NewVehicle/></Private>
    }
  ]
}
])

export {router};

export default function App() {
  return (
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
  )
}