import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import "./createdriver.scss";
import { useService } from "../../../hooks";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { QueryKeys } from "../../../APIs/QueryKeys";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../../utils/TokenServices";
import { getCurrentLocation } from "../../MapPage/mAP/MapComponent";

export const CreateDriver = () => {
  const navigate = useNavigate();
  const token = getToken();
  const { driverServices, vehicleTypeServices } = useService();
  const vehicleTypeQuery = useQuery(
    [QueryKeys.getAllVehicleTypesForDriverKey],
    () => vehicleTypeServices.getAllVehicleTypesForDriverActions(token)
  );
  const [newDriver, setNewDriver] = useState({
    name: "",
    owner: "",
    phone: "",
    dimensions: "",
    capacity: "",
    currentLocation: "No Location",
    latitude: null,
    longitude: null,
    notes: "",
    zipCode: "",
    isActive: true,
    isReserved: false,
    vehicleTypeId: null,
  });
  const [newDriverIsValid, setNewDriverIsValid] = useState({
    name: true,
    owner: true,
    phone: true,
    dimensions: true,
    capacity: true,
    vehicleTypeId: true,
    zipCode: true,
  });
  const mutate = useMutation(
    () => driverServices.createDriver(newDriver, token),
    {
      onSuccess: () => navigate("/Drivers"),
    }
  );

  const handleChangeNewDriver = async ({ target: { name, value } }) => {
    try {
      if (name === "zipCode") {
        let response = await getCurrentLocation(value);
        if (response) {
          setNewDriver((prev) => ({
            ...prev,
            currentLocation: `${response?.city} , ${
              response?.state
            } ${value}, ${
              response.countryCode === "US" ? "United States" : "Canada"
            }`,
          }));
          setNewDriver((prev) => ({
            ...prev,
            latitude: response?.latitude,
            longitude: response.longitude,
          }));
        }
      }
    } catch (error) {
      setNewDriver((prev) => ({ ...prev, currentLocation: `No Location` }));
      setNewDriver((prev) => ({
        ...prev,
        latitude: null,
        longitude: null,
      }));
      console.error(error);
    }
    setNewDriver((prev) => ({ ...prev, [name]: value }));
  };
  const handleValidateInputs = (e) => {
    if (
      e.target.name === "name" &&
      (newDriver.name === null || newDriver.name.length < 3)
    ) {
      setNewDriverIsValid((prev) => ({
        ...prev,
        name: false,
      }));
    } else if (e.target.name === "name") {
      setNewDriverIsValid((prev) => ({
        ...prev,
        name: true,
      }));
    }
    if (
      e.target.name === "owner" &&
      (newDriver.owner === null || newDriver.owner.length < 3)
    ) {
      setNewDriverIsValid((prev) => ({
        ...prev,
        owner: false,
      }));
    } else if (e.target.name === "owner") {
      setNewDriverIsValid((prev) => ({
        ...prev,
        owner: true,
      }));
    }
    if (
      e.target.name === "phone" &&
      (newDriver.phone === null || newDriver.phone.length < 3)
    ) {
      setNewDriverIsValid((prev) => ({
        ...prev,
        phone: false,
      }));
    } else if (e.target.name === "phone") {
      setNewDriverIsValid((prev) => ({
        ...prev,
        phone: true,
      }));
    }
    if (
      e.target.name === "dimensions" &&
      (newDriver.dimensions === null || newDriver.dimensions.length < 3)
    ) {
      setNewDriverIsValid((prev) => ({
        ...prev,
        dimensions: false,
      }));
    } else if (e.target.name === "dimensions") {
      setNewDriverIsValid((prev) => ({
        ...prev,
        dimensions: true,
      }));
    }
    if (
      e.target.name === "capacity" &&
      (newDriver.capacity === null || newDriver.capacity.length < 3)
    ) {
      setNewDriverIsValid((prev) => ({
        ...prev,
        capacity: false,
      }));
    } else if (e.target.name === "capacity") {
      setNewDriverIsValid((prev) => ({
        ...prev,
        capacity: true,
      }));
    }

    if (newDriver.vehicleTypeId === null || newDriver.vehicleTypeId === "") {
      setNewDriverIsValid((prev) => ({
        ...prev,
        vehicleTypeId: false,
      }));
    } else if (newDriver.vehicleTypeId !== "") {
      setNewDriverIsValid((prev) => ({
        ...prev,
        vehicleTypeId: true,
      }));
    }
    if (e.target.name === "zipCode" && newDriver.zipCode.length > 128) {
      setNewDriverIsValid((prev) => ({
        ...prev,
        zipCode: false,
      }));
    } else if (e.target.name === "zipCode") {
      setNewDriverIsValid((prev) => ({
        ...prev,
        zipCode: true,
      }));
    }
  };
  const handleMutation = (e) => {
    e.preventDefault();

    const checkArray = Object.entries(newDriverIsValid).filter((key) => {
      return key[1] === false;
    });
    if (checkArray.length === 0) {
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
    <div className="create-form">
      <div className="container">
        <section className="heading">
          <div>
            <h1>Create Driver</h1>
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
              onChange={handleChangeNewDriver}
              onBlur={handleValidateInputs}
              value={newDriver.name}
              error={newDriverIsValid.name ? null : "error"}
              helperText={
                newDriverIsValid.name ? "" : "Name's length must be at least 3"
              }
            />
            <TextField
              id="outlined-basic"
              label="Owner"
              variant="outlined"
              name="owner"
              size="small"
              required
              onBlur={handleValidateInputs}
              onChange={handleChangeNewDriver}
              value={newDriver.owner}
              error={newDriverIsValid.owner ? null : "error"}
              helperText={
                newDriverIsValid.owner
                  ? ""
                  : "Owner's length must be at least 3"
              }
            />
            <TextField
              id="outlined-basic"
              label="Phone"
              variant="outlined"
              size="small"
              name="phone"
              required
              onChange={handleChangeNewDriver}
              onBlur={handleValidateInputs}
              value={newDriver.phone}
              error={newDriverIsValid.phone ? null : "error"}
              helperText={
                newDriverIsValid.phone
                  ? ""
                  : "Phone's length must be at least 3"
              }
            />
            <TextField
              id="outlined-basic"
              label="Capacity"
              variant="outlined"
              size="small"
              name="capacity"
              required
              value={newDriver.capacity}
              onBlur={handleValidateInputs}
              onChange={handleChangeNewDriver}
              error={newDriverIsValid.capacity ? null : "error"}
              helperText={newDriverIsValid.capacity ? "" : "Capacity required"}
            />

            <TextField
              id="outlined-basic"
              label="Dimensions"
              variant="outlined"
              size="small"
              name="dimensions"
              required
              value={newDriver.dimensions}
              onBlur={handleValidateInputs}
              onChange={handleChangeNewDriver}
              error={newDriverIsValid.dimensions ? null : "error"}
              helperText={
                newDriverIsValid.dimensions
                  ? ""
                  : "Dimensions' length must be at least 3"
              }
            />
            <TextField
              id="outlined-basic"
              label="Zipcode"
              variant="outlined"
              size="small"
              name="zipCode"
              onChange={handleChangeNewDriver}
              onBlur={handleValidateInputs}
              error={newDriverIsValid.zipCode ? null : "error"}
              helperText={
                newDriverIsValid.zipCode
                  ? ""
                  : "Zipcode's length must be less than 128"
              }
            />
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              name="vehicleTypeId"
              options={vehicleTypeQuery.data?.data ?? []}
              getOptionLabel={(option) => option.name}
              sx={{ width: 300 }}
              onBlur={handleValidateInputs}
              onChange={(e, newValue) =>
                setNewDriver((prev) => ({
                  ...prev,
                  vehicleTypeId: newValue ? newValue.id : null,
                }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Vehicle Type"
                  error={newDriverIsValid.vehicleTypeId ? null : "error"}
                  helperText={
                    newDriverIsValid.vehicleTypeId
                      ? ""
                      : "Vehicle's Type Id required"
                  }
                />
              )}
            />
            <FormControl sx={{ width: 300 }}>
              <InputLabel id="demo-simple-select-label">Is Active</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                placeholder="Is Active"
                label="Is Active"
                defaultValue={true}
                name="isActive"
                onChange={(e) =>
                  setNewDriver((prev) => ({
                    ...prev,
                    isActive: e.target.value,
                  }))
                }
              >
                <MenuItem value={false}>No</MenuItem>
                <MenuItem value={true}>Yes</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: 300 }}>
              <InputLabel id="demo-simple-select-label">Is Reserved</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                placeholder="Is Reserved"
                label="Is Reserved"
                name="isReserved"
                defaultValue={false}
                onChange={(e) =>
                  setNewDriver((prev) => ({
                    ...prev,
                    isReserved: e.target.value,
                  }))
                }
              >
                <MenuItem value={false}>No</MenuItem>
                <MenuItem value={true}>Yes</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="outlined-basic"
              label="Notes"
              variant="outlined"
              size="small"
              sx={{ width: 225 }}
              multiline
              name="notes"
              onChange={handleChangeNewDriver}
            />
          </Box>
          <Button
            sx={{ width: 200 }}
            onClick={handleMutation}
            variant="contained"
          >
            Create Driver
          </Button>
          <div className="progress">
            {mutate.isLoading ? <CircularProgress /> : ""}{" "}
          </div>
        </section>
      </div>
    </div>
  );
};
