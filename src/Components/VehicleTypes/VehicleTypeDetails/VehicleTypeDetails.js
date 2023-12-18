import { useQuery } from "react-query";
import { useService } from "../../../hooks";
import { QueryKeys } from "../../../APIs/QueryKeys";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import "./vehicletypedetails.scss";
import { Button } from "@mui/material";
import { getToken } from "../../../utils/TokenServices";
export const VehicleTypeDetails = () => {
  const navigate = useNavigate();
  const token = getToken();
  const { vehicleTypeServices } = useService();
  const { Id } = useParams();
  const vehicletypeQuery = useQuery([QueryKeys.getDriverByIdQueryKey], () =>
    vehicleTypeServices.getVehicleTypeByid(Id, token)
  );

  if (vehicletypeQuery.isLoading) {
    return <h1>... Is Loading</h1>;
  }
  if (vehicletypeQuery.isError) {
    return <h1>...Error</h1>;
  }

  return (
    <div className="driver-details">
      <div className="container">
        <section className="button">
          <Button variant="contained" onClick={() => navigate(-1)}>
            Back
          </Button>
        </section>
        <section className="details">
          <div className="info">
            <h1>Id:</h1>
            <p>{vehicletypeQuery.data?.data.id}</p>
          </div>
          <div className="info">
            <h1>Name:</h1>
            <p>{vehicletypeQuery.data?.data.name}</p>
          </div>
          <div className="info">
            <h1>Created By:</h1>
            <p>{vehicletypeQuery.data?.data.createdBy}</p>
          </div>
          <div className="info">
            <h1>Updated By:</h1>
            <p>{vehicletypeQuery.data?.data.updatedBy}</p>
          </div>
          <div className="info">
            <h1>Created At:</h1>
            <p>
              {`${vehicletypeQuery.data?.data.createdAt.slice(
                0,
                10
              )} - ${vehicletypeQuery.data?.data.createdAt.slice(12, 19)}`}
            </p>{" "}
          </div>
          <div className="info">
            <h1>Updated At:</h1>
            <p>
              {`${vehicletypeQuery.data?.data.updatedAt.slice(
                0,
                10
              )} - ${vehicletypeQuery.data?.data.updatedAt.slice(12, 19)}`}
            </p>{" "}
          </div>
        </section>
      </div>
    </div>
  );
};
