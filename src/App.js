import logo from "./logo.svg";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import SignIn from "./Components/SignInPage/SignInPage";
import {
  getExpireDate,
  getToken,
  removeExpireDate,
  removeToken,
} from "./utils/TokenServices";
import { useEffect } from "react";
import { Layout } from "./Components/Layout/Layout";
import { Drivers } from "./Components/Drivers/Drivers";
import { DriverDetails } from "./Components/Drivers/DriverDetails/DriverDetails";
import { CreateDriver } from "./Components/Drivers/CreateDriver/CreateDriver";
import { DeleteDriver } from "./Components/Drivers/DeleteDriver/DeleteDriver";
import { UpdateDriver } from "./Components/Drivers/UpdateDriver/UpdateDriver";
import { VehicleTypes } from "./Components/VehicleTypes/VehicleTypes";
import { VehicleTypeDetails } from "./Components/VehicleTypes/VehicleTypeDetails/VehicleTypeDetails";
import { DeleteVehicleType } from "./Components/VehicleTypes/DeleteVehicleType/DeleteVehicleType";
import { CreateVehicleType } from "./Components/VehicleTypes/CreateVehicleType/CreateVehicleType";
import { UpdateVehicleType } from "./Components/VehicleTypes/UpdateVehicleType/UpdateVehicleType";
import { UserList } from "./Components/Users/UserList";
import { CreateUser } from "./Components/Users/CreateUser/CreateUser";
import { UserDetails } from "./Components/Users/UserDetails/UserDetails";
import { DeleteUser } from "./Components/Users/DeleteUser/DeleteUser";
import { UpdateUser } from "./Components/Users/UpdateUser/UpdateUser";
import { MapPage } from "./Components/MapPage/MapPage";
import { ChangePassword } from "./Components/ChangePassword/ChangePassword";
import { ForgotPassword } from "./Components/ForgotPassword/ForgotPassword";
import { ResetPassword } from "./Components/ResetPassword/ResetPassword";
import { ErrorPage } from "./Components/ErrorPage/ErrorPage";

function App() {
  const navigate = useNavigate();
  const queryClient = new QueryClient();
  const token = getToken();
  const expire = getExpireDate();
  const expireDate = new Date(expire);
  const currentDate = new Date();
  const location = useLocation();

  useEffect(() => {
    if (!token && location.pathname !== "/ResetPassword") {
      navigate("/SignIn");
    } else if (token && currentDate > expireDate) {
      localStorage.clear();
      removeExpireDate(token);
      removeToken(token);

      navigate("/SignIn");
      if (window.location.pathname !== "/SignIn") {
        navigate("/SignIn");
      }
    } else if (location.pathname === "" || location.pathname === "/") {
      navigate("/Drivers");
    }
  }, []);

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/Drivers" element={<Drivers />}></Route>
            <Route
              path="/DriverDetails/:Id"
              element={<DriverDetails />}
            ></Route>
            <Route path="/CreateDriver" element={<CreateDriver />}></Route>
            <Route path="/DeleteDriver/:Id" element={<DeleteDriver />}></Route>
            <Route path="/UpdateDriver/:Id" element={<UpdateDriver />}></Route>

            <Route path="/VehicleTypes" element={<VehicleTypes />}></Route>
            <Route
              path="/VehicleTypeDetails/:Id"
              element={<VehicleTypeDetails />}
            ></Route>
            <Route
              path="/DeleteVehicleType/:Id"
              element={<DeleteVehicleType />}
            ></Route>
            <Route
              path="/CreateVehicleType"
              element={<CreateVehicleType />}
            ></Route>
            <Route
              path="/UpdateVehicleType/:Id"
              element={<UpdateVehicleType />}
            ></Route>
            <Route path="/Users" element={<UserList />}></Route>
            <Route path="/CreateUser" element={<CreateUser />}></Route>
            <Route path="/DeleteUser/:Id" element={<DeleteUser />}></Route>
            <Route path="/UpdateUser/:Id" element={<UpdateUser />}></Route>

            <Route path="/Map" element={<MapPage />}></Route>

            <Route path="/UserDetails/:Id" element={<UserDetails />}></Route>
            <Route path="/ChangePassword" element={<ChangePassword />}></Route>
          </Route>
          <Route path="/ForgotPassword" element={<ForgotPassword />}></Route>
          <Route path="/ResetPassword" element={<ResetPassword />}></Route>
          <Route path="/*" element={<ErrorPage />}></Route>
          <Route path="/ErrorPage" element={<ErrorPage />}></Route>

          <Route path="/SignIn" element={<SignIn />}></Route>
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
