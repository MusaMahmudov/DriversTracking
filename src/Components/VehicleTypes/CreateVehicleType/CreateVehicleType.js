import { Box, Button, TextField } from "@mui/material";
import "./createvehicletype.scss";
import { useService } from "../../../hooks";
import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../../utils/TokenServices";
export const CreateVehicleType = () => {
  const navigate = useNavigate();
  const token = getToken();
  const { vehicleTypeServices } = useService();
  const [vehicleTypeIsValid, setVehicleTypeIsValid] = useState({
    name: true,
  });
  const [newVehicleType, setNewVehicleType] = useState({
    name: "",
  });
  const mutate = useMutation(
    () => vehicleTypeServices.createVehicleType(newVehicleType, token),
    {
      onSuccess: () => navigate("/VehicleTypes"),
    }
  );

  const handleChangeNewVehicleType = ({ target: { name, value } }) => {
    setNewVehicleType((prev) => ({ ...prev, [name]: value }));
  };
  const handleCheckVehicleType = (e) => {
    e.preventDefault();
    if (e.target.value.length < 3) {
      setVehicleTypeIsValid({ name: false });
    } else {
      setVehicleTypeIsValid({ name: true });
    }
  };

  const handleMutation = (e) => {
    e.preventDefault();
    if (vehicleTypeIsValid.name) {
      mutate.mutate();
    }
  };

  return (
    <div className="create-form">
      <div className="container">
        <section className="heading">
          <div>
            <h1>Create Vehicle's Type</h1>
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
              onBlur={(e) => handleCheckVehicleType(e)}
              variant="outlined"
              size="small"
              required
              onChange={handleChangeNewVehicleType}
              error={vehicleTypeIsValid.name ? "" : "Error"}
              helperText={
                vehicleTypeIsValid.name
                  ? ""
                  : "Vehicle's Type's name length must be at least 3"
              }
            />
          </Box>
          <Button
            sx={{ width: 200, fontSize: 14, marginTop: 3 }}
            onClick={handleMutation}
            variant="contained"
          >
            Create Vehicle's Type
          </Button>
        </section>
      </div>
    </div>
  );
};
