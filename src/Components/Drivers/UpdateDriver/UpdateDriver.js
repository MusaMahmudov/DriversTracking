import { useNavigate, useParams } from "react-router-dom";
import { useService } from "../../../hooks";
import { useMutation, useQuery } from "react-query";
import { QueryKeys } from "../../../APIs/QueryKeys";
import { useEffect, useReducer, useState } from "react";
import "./updatedriver.scss";
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
import { UpdateDriverReducer } from "../../../Reducers/UpdateDriverReducer";
import { getDecodedToken, getToken } from "../../../utils/TokenServices";
import { getCurrentLocation } from "../../MapPage/mAP/MapComponent";
import {
  tokenRoleProperty,
  tokenUserNameProperty,
} from "../../../utils/TokenProperties";

export const UpdateDriver = () => {
  const navigate = useNavigate();
  const { driverServices, vehicleTypeServices } = useService();
  const { Id } = useParams();
  const token = getToken();
  const decodedToken = getDecodedToken();
  var userName = decodedToken[tokenUserNameProperty];
  var roleName = decodedToken[tokenRoleProperty];
  const [inputstate, dispatch] = useReducer(UpdateDriverReducer, {});
  const mutate = useMutation(
    () => driverServices.updateDriver(Id, inputstate, token),
    { onSuccess: () => navigate("/Drivers") }
  );
  var vehicleTypeQuery = useQuery(
    [QueryKeys.getAllVehicleTypesForDriverKey],
    () => vehicleTypeServices.getAllVehicleTypesForDriverActions(token)
  );
  var driverQuery = useQuery([QueryKeys.getDriverByIdQueryKey], () =>
    driverServices.getDriverByidForUpdate(Id, token)
  );
  const [driverIsValid, setDriverIsValid] = useState({
    name: true,
    owner: true,
    phone: true,
    dimensions: true,
    capacity: true,
    vehicleTypeId: true,
    zipCode: true,
  });
  useEffect(() => {
    if (driverQuery.isSuccess) {
      dispatch({
        type: "init",
        payload: driverQuery.data?.data,
      });
    }
  }, [driverQuery.isSuccess]);
  const handleValidateInputs = (e) => {
    if (
      e.target.name === "name" &&
      (inputstate.name === null || inputstate.name.length < 3)
    ) {
      setDriverIsValid((prev) => ({
        ...prev,
        name: false,
      }));
    } else if (e.target.name === "name") {
      setDriverIsValid((prev) => ({
        ...prev,
        name: true,
      }));
    }
    if (
      e.target.name === "owner" &&
      (inputstate.owner === null || inputstate.owner.length < 3)
    ) {
      setDriverIsValid((prev) => ({
        ...prev,
        owner: false,
      }));
    } else if (e.target.name === "owner") {
      setDriverIsValid((prev) => ({
        ...prev,
        owner: true,
      }));
    }
    if (
      e.target.name === "phone" &&
      (inputstate.phone === null || inputstate.phone.length < 3)
    ) {
      setDriverIsValid((prev) => ({
        ...prev,
        phone: false,
      }));
    } else if (e.target.name === "phone") {
      setDriverIsValid((prev) => ({
        ...prev,
        phone: true,
      }));
    }
    if (
      e.target.name === "dimensions" &&
      (inputstate.dimensions === null || inputstate.dimensions.length < 3)
    ) {
      setDriverIsValid((prev) => ({
        ...prev,
        dimensions: false,
      }));
    } else if (e.target.name === "dimensions") {
      setDriverIsValid((prev) => ({
        ...prev,
        dimensions: true,
      }));
    }
    if (
      e.target.name === "capacity" &&
      (inputstate.capacity === null || inputstate.capacity.length < 3)
    ) {
      setDriverIsValid((prev) => ({
        ...prev,
        capacity: false,
      }));
    } else if (e.target.name === "capacity") {
      setDriverIsValid((prev) => ({
        ...prev,
        capacity: true,
      }));
    }
    if (inputstate.vehicleTypeId === null || inputstate.vehicleTypeId === "") {
      setDriverIsValid((prev) => ({
        ...prev,
        vehicleTypeId: false,
      }));
    } else if (inputstate.vehicleTypeId !== "") {
      setDriverIsValid((prev) => ({
        ...prev,
        vehicleTypeId: true,
      }));
    }
    if (e.target.name === "zipCode" && inputstate.zipCode.length > 128) {
      setDriverIsValid((prev) => ({
        ...prev,
        zipCode: false,
      }));
    } else if (e.target.name === "zipCode") {
      setDriverIsValid((prev) => ({
        ...prev,
        zipCode: true,
      }));
    }
  };
  const handleChangeDriver = async ({ target: { value, name } }) => {
    try {
      if (name === "zipCode") {
        let response = await getCurrentLocation(value);
        if (response) {
          dispatch({
            type: "currentLocation",
            payload: `${response?.city} , ${response?.state} ${value}, ${
              response?.countryCode === "US" ? "United States" : "Canada"
            }`,
          });
          dispatch({
            type: "latitude",
            payload: response.latitude,
          });
          dispatch({
            type: "longitude",
            payload: response.longitude,
          });
        }
      }
    } catch (error) {
      dispatch({
        type: "currentLocation",
        payload: `No Location`,
      });
      dispatch({
        type: "latitude",
        payload: null,
      });
      dispatch({
        type: "longitude",
        payload: null,
      });
      console.error(error);
    }

    dispatch({
      type: name,
      payload: value,
    });
  };
  const handleDriverUpdate = (e) => {
    e.preventDefault();
    if (inputstate.vehicleTypeId === null || inputstate.vehicleTypeId === "") {
      setDriverIsValid((prev) => ({
        ...prev,
        vehicleTypeId: false,
      }));
    }
    const checkArray = Object.entries(driverIsValid).filter((key) => {
      return key[1] === false;
    });
    if (checkArray.length === 0) {
      mutate.mutate();
    }
  };

  if (driverQuery.isLoading) {
    return <h1>...Is Loading</h1>;
  }
  if (vehicleTypeQuery.isLoading) {
    return <h1>...isLoading</h1>;
  }
  if (driverQuery.isError) {
    return <h1>...Error</h1>;
  }
  if (driverQuery.isError) {
    return <h1>Driver not found</h1>;
  }

  return (
    <div className="update-form">
      <div className="container">
        <section className="heading">
          <div>
            <h1>Update Driver</h1>
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
              onBlur={handleValidateInputs}
              defaultValue={driverQuery.data?.data.name}
              onChange={handleChangeDriver}
              error={driverIsValid.name ? null : "error"}
              helperText={
                driverIsValid.name ? "" : "Name's length must be at least 3"
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
              defaultValue={driverQuery.data?.data.owner}
              onChange={handleChangeDriver}
              error={driverIsValid.owner ? null : "error"}
              helperText={
                driverIsValid.owner ? "" : "Owner's length must be at least 3"
              }
            />
            <TextField
              id="outlined-basic"
              label="Phone"
              variant="outlined"
              size="small"
              name="phone"
              required
              onBlur={handleValidateInputs}
              defaultValue={driverQuery.data?.data.phone}
              onChange={handleChangeDriver}
              error={driverIsValid.phone ? null : "error"}
              helperText={
                driverIsValid.phone ? "" : "Phone's length must be at least 3"
              }
            />
            <TextField
              id="outlined-basic"
              label="Dimensions"
              variant="outlined"
              size="small"
              name="dimensions"
              required
              onBlur={handleValidateInputs}
              defaultValue={driverQuery.data?.data.dimensions}
              onChange={handleChangeDriver}
              error={driverIsValid.dimensions ? null : "error"}
              helperText={
                driverIsValid.dimensions
                  ? ""
                  : "Dimensions' length must be at least 3"
              }
            />

            <TextField
              id="outlined-basic"
              label="Capacity"
              variant="outlined"
              size="small"
              required
              name="capacity"
              onBlur={handleValidateInputs}
              defaultValue={driverQuery.data?.data.capacity}
              onChange={handleChangeDriver}
              error={driverIsValid.capacity ? null : "error"}
              helperText={
                driverIsValid.capacity
                  ? ""
                  : "Capacity's length must be at least 3"
              }
            />

            <TextField
              id="outlined-basic"
              label="Zipcode"
              variant="outlined"
              size="small"
              name="zipCode"
              onBlur={handleValidateInputs}
              defaultValue={driverQuery.data?.data.zipCode}
              onChange={handleChangeDriver}
            />
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={vehicleTypeQuery.data?.data ?? []}
              getOptionLabel={(option) => option.name}
              sx={{ width: 300 }}
              onBlur={handleValidateInputs}
              onChange={(e, newValue) =>
                dispatch({
                  type: "vehicleTypeId",
                  payload: newValue ? newValue.id : null,
                })
              }
              defaultValue={vehicleTypeQuery.data?.data.find(
                (vehicleType) =>
                  vehicleType.id === driverQuery.data?.data.vehicleTypeId
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Vehicle Type"
                  error={driverIsValid.vehicleTypeId ? null : "error"}
                  helperText={
                    driverIsValid.vehicleTypeId
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
                name="isActive"
                value={inputstate.isActive}
                defaultValue={driverQuery.data?.data.isActive}
                onChange={handleChangeDriver}
              >
                <MenuItem value={false}>No</MenuItem>
                <MenuItem value={true}>Yes</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: 300 }}>
              <InputLabel id="demo-simple-select-label">Is Reserved</InputLabel>
              <Select
                disabled={
                  driverQuery.data?.data.isReserved &&
                  driverQuery.data?.data.reservedBy !== userName &&
                  !roleName.includes("Admin")
                    ? true
                    : false
                }
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                placeholder="Is Reserved"
                label="Is Reserved"
                name="isReserved"
                value={inputstate.isReserved}
                defaultValue={driverQuery.data?.data.isReserved}
                onChange={handleChangeDriver}
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
              defaultValue={driverQuery.data?.data.notes}
              onChange={handleChangeDriver}
            />
          </Box>
          <Button
            sx={{ width: 200 }}
            variant="contained"
            onClick={handleDriverUpdate}
          >
            Update Driver
          </Button>
          <div className="progress">
            {mutate.isLoading ? <CircularProgress /> : ""}{" "}
          </div>
        </section>
      </div>
    </div>
  );
};
