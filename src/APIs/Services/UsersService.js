import { BaseUrl } from "../BaseUrls";
import { HTTPClient } from "../HTTPClient";

export class UserService extends HTTPClient {
  constructor() {
    super(BaseUrl);
  }
  async getAllUsers(token) {
    return await this.getAll("Users", token);
  }
  async getUserById(id, token) {
    return await this.getById("Users", id, token);
  }
  async getUserByIdForUpdate(id, token) {
    return await this.getById("Users/GetUserByIdForUpdate", id, token);
  }
  async checkUserIsActive(id, token) {
    return await this.getById("Users/CheckUserIsActive", id, token);
  }
  async changePasswordById(Id, body, token) {
    return await this.updateById(`Users/ChangePassword`, Id, body, token);
  }
  async forgotPassword(body) {
    return await this.post("Users/ForgotPassword", body);
  }
  async resetPassword(body) {
    return await this.post("Users/ResetPassword", body);
  }
  async createUser(body, token) {
    return await this.create("Users", body, token);
  }
  async deleteUserById(id, token) {
    return await this.deleteById("Users", id, token);
  }
  async updateUserById(body, id, token) {
    return await this.updateById("Users", id, body, token);
  }
}
