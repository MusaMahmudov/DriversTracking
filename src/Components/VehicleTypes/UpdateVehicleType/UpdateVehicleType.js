import { useNavigate, useParams } from "react-router-dom";
import { useService } from "../../../hooks";
import { useMutation, useQuery } from "react-query";
import { QueryKeys } from "../../../APIs/QueryKeys";
import { useEffect, useReducer, useState } from "react";
import "./updatevehicletype.scss";
import { Box, Button, TextField } from "@mui/material";
import { UpdateVehicleTypeReducer } from "../../../Reducers/UpdateVehicleTypeReducer";
import { getToken } from "../../../utils/TokenServices";

export const UpdateVehicleType = () => {
  const navigate = useNavigate();
  const token = getToken();
  const { vehicleTypeServices } = useService();
  const { Id } = useParams();
  const [vehicleTypeIsValid, setVehicleTypeIsValid] = useState({
    name: true,
  });
  const [inputstate, dispatch] = useReducer(UpdateVehicleTypeReducer, {});
  const mutate = useMutation(
    () => vehicleTypeServices.updateVehicleType(Id, inputstate, token),
    { onSuccess: () => navigate("/VehicleTypes") }
  );
  var vehicleTypeQuery = useQuery(
    [QueryKeys.getAllVehicleTypesForDriverKey],
    () => vehicleTypeServices.getVehicleTypeByIdForUpdate(Id, token)
  );

  useEffect(() => {
    if (vehicleTypeQuery.isSuccess) {
      dispatch({
        type: "init",
        payload: vehicleTypeQuery.data?.data,
      });
    }
  }, [vehicleTypeQuery.isSuccess]);
  const handleChangeVehicleType = ({ target: { value, name } }) => {
    dispatch({
      type: name,
      payload: value,
    });
  };
  const handleVehicleTypeValid = (e) => {
    if (e.target.value < 3) {
      setVehicleTypeIsValid((prev) => ({
        ...prev,
        name: false,
      }));
    } else {
      setVehicleTypeIsValid((prev) => ({
        name: true,
      }));
    }
  };
  const handleVehicleTypeUpdate = (e) => {
    e.preventDefault();
    if (vehicleTypeIsValid.name) {
      mutate.mutate();
    }
  };

  if (vehicleTypeQuery.isLoading) {
    return <h1>...Is Loading</h1>;
  }
  if (vehicleTypeQuery.isError) {
    return <h1>...Error</h1>;
  }
  return (
    <div className="update-form">
      <div className="container">
        <section className="heading">
          <div>
            <h1>Update VehicleType</h1>
          </div>
        </section>
        <section className="button">
          <Button variant="contained" onClick={() => navigate(-1)}>
            Back
          </Button>
        </section>
        <section className="form">
          <Box
            display="flex"
            flexWrap="wrap"
            component="form"
            sx={{
              "& > :not(style)": { m: 1 },
            }}
            noValidate
            autoComplete="off"
            width="90%"
          >
            <TextField
              id="outlined-basic"
              label="Name"
              name="name"
              variant="outlined"
              size="small"
              required
              onBlur={handleVehicleTypeValid}
              defaultValue={vehicleTypeQuery.data?.data.name}
              onChange={handleChangeVehicleType}
              error={vehicleTypeIsValid.name ? "" : "error"}
              helperText={
                vehicleTypeIsValid.name
                  ? ""
                  : "Vehicle's type's name must be at least 3 length"
              }
            />
          </Box>
          <Button
            sx={{ width: 200 }}
            variant="contained"
            onClick={handleVehicleTypeUpdate}
          >
            Update Vehicle's Type
          </Button>
        </section>
      </div>
    </div>
  );
};
