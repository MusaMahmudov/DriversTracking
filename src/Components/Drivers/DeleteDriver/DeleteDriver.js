import { useMutation, useQuery } from "react-query";
import { useService } from "../../../hooks";
import { QueryKeys } from "../../../APIs/QueryKeys";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";
import { getToken } from "../../../utils/TokenServices";
export const DeleteDriver = () => {
  const navigate = useNavigate();
  const token = getToken();
  const { driverServices } = useService();
  const { Id } = useParams();
  const driverQuery = useQuery([QueryKeys.getDriverByIdQueryKey], () =>
    driverServices.getDriverByid(Id, token)
  );
  const mutate = useMutation(() => driverServices.deleteDriverById(Id, token), {
    onSuccess: () => navigate("/Drivers"),
  });
  const handleDelete = () => {
    mutate.mutate();
  };

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
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete()}
          >
            Delete
          </Button>
          <div className="progress">
            {mutate.isLoading ? <CircularProgress /> : ""}{" "}
          </div>
        </section>
        <section className="details">
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
            <h1>Is Active:</h1>
            <p>{driverQuery.data?.data.isActive ? "Yes" : "No"}</p>
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
            <p>{driverQuery.data?.data.createdAt}</p>
          </div>
          <div className="info">
            <h1>Updated At:</h1>
            <p>{driverQuery.data?.data.updatedAt.slice(0, 10)}</p>
          </div>
        </section>
      </div>
    </div>
  );
};
