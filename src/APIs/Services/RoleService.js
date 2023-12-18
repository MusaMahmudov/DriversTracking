import { BaseUrl } from "../BaseUrls";
import { HTTPClient } from "../HTTPClient";

export class RoleService extends HTTPClient {
  constructor() {
    super(BaseUrl);
  }
  async getAllRoles() {
    return await this.getAll("Roles");
  }
  async getAllRolesForUserActions() {
    return await this.getAll("Roles/GetAllRolesForUserActions");
  }
  //   async getDriverByid(id) {
  //     return await this.getById("Drivers", id);
  //   }
  //   async getDriverByidForUpdate(id) {
  //     return await this.getById("Drivers/GetDriverByIdForUpdate", id);
  //   }
  //   async createDriver(body) {
  //     return await this.create("Drivers", body);
  //   }
  //   async updateDriver(id, body) {
  //     return await this.updateById("Drivers", id, body);
  //   }
  //   async deleteDriverById(id) {
  //     return await this.deleteById("Drivers", id);
  //   }
}
