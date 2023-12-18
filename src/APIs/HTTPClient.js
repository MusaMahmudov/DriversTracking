import axios from "axios";
export class HTTPClient {
  BaseUrl;
  constructor(BaseUrl) {
    this.BaseUrl = BaseUrl;
  }

  async getAll(endCode, token) {
    return await axios.get(`${this.BaseUrl}/${endCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async getById(endCode, id, token) {
    return await axios.get(`${this.BaseUrl}/${endCode}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async create(endCode, body, token) {
    return await axios.post(`${this.BaseUrl}/${endCode}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async post(endCode, body, token) {
    return await axios.post(`${this.BaseUrl}/${endCode}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async updateById(endCode, id, body, token) {
    return await axios.put(`${this.BaseUrl}/${endCode}/${id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async deleteById(endCode, id, token) {
    return await axios.delete(`${this.BaseUrl}/${endCode}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
