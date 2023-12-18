import { BaseUrl } from "../BaseUrls";
import { HTTPClient } from "../HTTPClient";

export class DriverService extends HTTPClient {
  constructor() {
    super(BaseUrl);
  }
  async getAllDrivers(token) {
    return await this.getAll("Drivers", token);
  }
  async getAllDriversForMapPage(token) {
    return await this.getAll("Drivers/GetDriversForMapPage", token);
  }
  async getDriverByid(id, token) {
    return await this.getById("Drivers", id, token);
  }
  async getDriverByidForUpdate(id, token) {
    return await this.getById("Drivers/GetDriverByIdForUpdate", id, token);
  }
  async createDriver(body, token) {
    return await this.create("Drivers", body, token);
  }
  async updateDriver(id, body, token) {
    return await this.updateById("Drivers", id, body, token);
  }
  async revervDriverMapPage(id, body, token) {
    return await this.updateById(
      "Drivers/ReserveDriverMapPage",
      id,
      body,
      token
    );
  }
  async deleteDriverById(id, token) {
    return await this.deleteById("Drivers", id, token);
  }
}
