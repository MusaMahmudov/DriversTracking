import axios from "axios";
import { BaseUrl } from "../BaseUrls";
import { HTTPClient } from "../HTTPClient";

export class ZipCodeService {
  async getAllLocations(zipcode) {
    return await axios.get(
      `https://app.zipcodebase.com/api/v1/search?apikey=6e2c1980-845a-11ee-9b59-452e6e390088&codes=${zipcode}&country=us`
    );
  }
  async getAllLocations(zipcode) {
    return await axios.get(`https://localhost:7217/WeatherForecast`);
  }
}
