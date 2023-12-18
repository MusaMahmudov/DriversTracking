import { AuthService } from "./APIs/Services/AuthService";
import { DriverService } from "./APIs/Services/DriverServices";
import { RoleService } from "./APIs/Services/RoleService";
import { UserService } from "./APIs/Services/UsersService";
import { VehicleTypeService } from "./APIs/Services/VehicleTypeService";
import { ZipCodeService } from "./APIs/Services/ZipCodeService";

export const useService = () => {
  const driverServices = new DriverService();
  const authServices = new AuthService();
  const vehicleTypeServices = new VehicleTypeService();
  const userServices = new UserService();
  const roleServices = new RoleService();
  const zipCodeServices = new ZipCodeService();
  return {
    zipCodeServices,
    driverServices,
    authServices,
    vehicleTypeServices,
    userServices,
    roleServices,
  };
};
