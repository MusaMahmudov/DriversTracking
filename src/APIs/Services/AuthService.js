import axios from "axios";
import { BaseUrl } from "../BaseUrls";
import { HTTPClient } from "../HTTPClient";

export class AuthService extends HTTPClient {
  constructor() {
    super(BaseUrl);
  }

  async Login(body) {
    return await this.post("Authentications", body);
  }
}
