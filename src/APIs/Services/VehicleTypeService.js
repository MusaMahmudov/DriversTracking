import { BaseUrl } from "../BaseUrls";
import { HTTPClient } from "../HTTPClient";

export class VehicleTypeService extends HTTPClient {
  constructor() {
    super(BaseUrl);
  }
  async getAllVehicleTypes(token) {
    return await this.getAll("VehicleTypes", token);
  }
  async getAllVehicleTypesForDriverActions(token) {
    return await this.getAll("VehicleTypes/GetAllVehicleTypesForDriver", token);
  }
  async getVehicleTypeByIdForUpdate(id, token) {
    return await this.getById(
      "VehicleTypes/GetVehicleTypeForUpdate",
      id,
      token
    );
  }
  async getVehicleTypeByid(id, token) {
    return await this.getById("VehicleTypes", id, token);
  }
  async createVehicleType(body, token) {
    return await this.create("VehicleTypes", body, token);
  }
  async updateVehicleType(id, body, token) {
    return await this.updateById("VehicleTypes", id, body, token);
  }
  async deleteVehicleTypeById(id, token) {
    return await this.deleteById("VehicleTypes", id, token);
  }
}
