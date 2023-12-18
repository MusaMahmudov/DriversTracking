import { useQuery } from "react-query";
import { useService } from "../../../hooks";
import { QueryKeys } from "../../../APIs/QueryKeys";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import "./userdetails.scss";
import { Button } from "@mui/material";
import { getDecodedToken, getToken } from "../../../utils/TokenServices";
import { tokenRoleProperty } from "../../../utils/TokenProperties";
export const UserDetails = () => {
  const navigate = useNavigate();
  const { userServices } = useService();
  const token = getToken();
  const { Id } = useParams();
  const userQuery = useQuery([QueryKeys.getUserByIdKey], () =>
    userServices.getUserById(Id, token)
  );
  useEffect(() => {
    const decodedToken = getDecodedToken();
    if (decodedToken) {
      const userRoles = decodedToken[tokenRoleProperty];
      if (Array.isArray(userRoles)) {
        if (!userRoles.includes("Admin")) {
          navigate("/ErrorPage", { replace: true });
        }
      } else {
        if (userRoles !== "Admin") {
          navigate("/ErrorPage", { replace: true });
        }
      }
    }
  }, []);

  if (userQuery.isLoading) {
    return <h1>... Is Loading</h1>;
  }
  if (userQuery.isError) {
    return <h1>...Error</h1>;
  }

  return (
    <div className="user-details">
      <div className="container">
        <section className="button">
          <Button variant="contained" onClick={() => navigate(-1)}>
            Back
          </Button>
        </section>
        <section className="details">
          <div className="info">
            <h1>Id:</h1>
            <p>{userQuery.data?.data.id}</p>
          </div>
          <div className="info">
            <h1>User Name:</h1>
            <p>{userQuery.data?.data.userName}</p>
          </div>
          <div className="info">
            <h1>Full Name:</h1>
            <p>{userQuery.data?.data.fullName}</p>
          </div>
          <div className="info">
            <h1>Email:</h1>
            <p>{userQuery.data?.data.email}</p>
          </div>
          <div className="info">
            <h1>Roles:</h1>
            <p>
              {userQuery.data?.data.roleName.map(
                (role, index, array) =>
                  `${index === array.length - 1 ? role : `${role}-`}`
              )}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
