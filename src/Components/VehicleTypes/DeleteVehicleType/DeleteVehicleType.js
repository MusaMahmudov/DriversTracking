import { useMutation, useQuery } from "react-query";
import { useService } from "../../../hooks";
import { QueryKeys } from "../../../APIs/QueryKeys";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { getToken } from "../../../utils/TokenServices";
export const DeleteVehicleType = () => {
  const navigate = useNavigate();
  const token = getToken();
  const { vehicleTypeServices } = useService();
  const { Id } = useParams();
  const vehicleTypeQuery = useQuery([QueryKeys.getVehicleTypesByIdKey], () =>
    vehicleTypeServices.getVehicleTypeByid(Id, token)
  );
  const mutate = useMutation(
    () => vehicleTypeServices.deleteVehicleTypeById(Id, token),
    {
      onSuccess: () => navigate("/VehicleTypes"),
    }
  );
  const handleDelete = () => {
    mutate.mutate();
  };

  if (vehicleTypeQuery.isLoading) {
    return <h1>... Is Loading</h1>;
  }
  if (vehicleTypeQuery.isError) {
    return <h1>...Error</h1>;
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
        </section>
        <section className="details">
          <div className="info">
            <h1>Id:</h1>
            <p>{vehicleTypeQuery.data?.data.id}</p>
          </div>

          <div className="info">
            <h1>Name:</h1>
            <p>{vehicleTypeQuery.data?.data.name}</p>
          </div>

          <div className="info">
            <h1>Created By:</h1>
            <p>{vehicleTypeQuery.data?.data.createdBy}</p>
          </div>
          <div className="info">
            <h1>Updated By:</h1>
            <p>{vehicleTypeQuery.data?.data.updatedBy}</p>
          </div>
          <div className="info">
            <h1>Created At:</h1>
            <p>{vehicleTypeQuery.data?.data.createdAt}</p>
          </div>
          <div className="info">
            <h1>Updated At:</h1>
            <p>{vehicleTypeQuery.data?.data.updatedAt.slice(0, 10)}</p>
          </div>
        </section>
      </div>
    </div>
  );
};
