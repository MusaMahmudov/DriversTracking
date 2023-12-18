import { useQuery } from "react-query";
import { useService } from "../../../hooks";
import { QueryKeys } from "../../../APIs/QueryKeys";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./driverdetails.scss";
import { Button } from "@mui/material";
import { getToken } from "../../../utils/TokenServices";
export const DriverDetails = () => {
  const navigate = useNavigate();
  const { driverServices } = useService();
  const { Id } = useParams();
  const token = getToken();
  const driverQuery = useQuery([QueryKeys.getDriverByIdQueryKey], () =>
    driverServices.getDriverByid(Id, token)
  );

  if (driverQuery.isLoading) {
    return <h1>... Is Loading</h1>;
  }
  if (driverQuery.isError) {
    return <h1>Driver not found</h1>;
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
            <p>{driverQuery.data?.data.id}</p>
          </div>
          <div className="info">
            <h1>Name:</h1>
            <p>{driverQuery.data?.data.name}</p>
          </div>
          <div className="info">
            <h1>Owner:</h1>
            <p>{driverQuery.data?.data.owner}</p>
          </div>
          <div className="info">
            <h1>Phone:</h1>
            <p>{driverQuery.data?.data.phone}</p>
          </div>
          <div className="info">
            <h1>Capacity:</h1>
            <p>{driverQuery.data?.data.capacity}</p>
          </div>
          <div className="info">
            <h1>Dimensions:</h1>
            <p>{driverQuery.data?.data.dimensions}</p>
          </div>
          <div className="info">
            <h1>Current Location:</h1>
            <p>{driverQuery.data?.data.currentLocation}</p>
          </div>
          <div className="info">
            <h1>Notes:</h1>
            <p>{driverQuery.data?.data.notes}</p>
          </div>
          <div className="info">
            <h1>Zip Code:</h1>
            <p>{driverQuery.data?.data.zipCode}</p>
          </div>
          <div className="info">
            <h1>Vehicle Type:</h1>
            <p>{driverQuery.data?.data.vehicleType?.name}</p>
          </div>
          <div className="info">
            <h1>Is Active:</h1>
            <p>{driverQuery.data?.data.isActive ? "Yes" : "No"}</p>
          </div>
          <div className="info">
            <h1>Is Reserved:</h1>
            <p>{driverQuery.data?.data.isReserved ? "Yes" : "No"}</p>
            <p style={{ marginTop: 5 }}>
              {driverQuery.data?.data.isReserved && (
                <p>{`  ${
                  driverQuery.data?.data.reservedAgo.slice(3, 5) >= 10
                    ? driverQuery.data?.data.reservedAgo.slice(3, 5)
                    : driverQuery.data?.data.reservedAgo.slice(4, 5)
                } minutes ago by ${driverQuery.data?.data.reservedBy}`}</p>
              )}
            </p>
          </div>

          <div className="info">
            <h1>Created By:</h1>
            <p>{driverQuery.data?.data.createdBy}</p>
          </div>
          <div className="info">
            <h1>Updated By:</h1>
            <p>{driverQuery.data?.data.updatedBy}</p>
          </div>
          <div className="info">
            <h1>Created At:</h1>
            <p>
              {`${driverQuery.data?.data.createdAt.slice(
                0,
                10
              )} - ${driverQuery.data?.data.createdAt.slice(12, 19)}`}
            </p>
          </div>
          <div className="info">
            <h1>Updated At:</h1>
            <p>
              {`${driverQuery.data?.data.updatedAt.slice(
                0,
                10
              )} - ${driverQuery.data?.data.updatedAt.slice(12, 19)}`}
            </p>{" "}
          </div>
        </section>
      </div>
    </div>
  );
};
