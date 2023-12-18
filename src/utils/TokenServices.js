import { jwtDecode } from "jwt-decode";
import { Cookies, useCookies } from "react-cookie";

export const getToken = () => {
  const cookie = new Cookies();

  const token = cookie.get(
    localStorage.getItem("UI") ? localStorage.getItem("UI") : ""
  );
  if (token) {
    return token;
  }
  return null;
};

export const getDecodedToken = () => {
  const cookie = new Cookies();
  const token = getToken();
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken;
  }
  return null;
};

export const removeToken = (token) => {
  const cookie = new Cookies();
  if (token) {
    cookie.remove(
      `${localStorage.getItem("UI") ? localStorage.getItem("UI") : ""}`
    );
    return true;
  }
  return false;
};
export const getExpireDate = () => {
  const cookie = new Cookies();
  const token = getToken();
  const expireDate = cookie.get(
    `expireDate${localStorage.getItem("UI") ? localStorage.getItem("UI") : ""}`
  );
  if (token) {
    return expireDate;
  }
  return null;
};

export const removeExpireDate = (token) => {
  const cookie = new Cookies();
  if (token) {
    cookie.remove(
      `expireDate${
        localStorage.getItem("UI") ? localStorage.getItem("UI") : ""
      }`
    );
    return true;
  }
  return false;
};
