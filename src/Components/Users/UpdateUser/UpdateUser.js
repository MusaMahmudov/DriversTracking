import { useNavigate, useParams } from "react-router-dom";
import { useService } from "../../../hooks";
import { useMutation, useQuery } from "react-query";
import { QueryKeys } from "../../../APIs/QueryKeys";
import { useEffect, useReducer, useState } from "react";
import "./updateuser.scss";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { UpdateUserReducer } from "../../../Reducers/UpdateUserReducer";
import { getDecodedToken, getToken } from "../../../utils/TokenServices";
import { tokenRoleProperty } from "../../../utils/TokenProperties";
export const UpdateUser = () => {
  const navigate = useNavigate();
  const token = getToken();
  const { roleServices, userServices } = useService();
  const { Id } = useParams();
  const [error, setError] = useState();
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [inputstate, dispatch] = useReducer(UpdateUserReducer, {});
  const mutate = useMutation(
    () => userServices.updateUserById(inputstate, Id, token),
    {
      onError: () => handleClick(),
      onSuccess: () => navigate("/Users"),
    }
  );
  var roleQuery = useQuery([QueryKeys.getRolesForUser], () =>
    roleServices.getAllRolesForUserActions()
  );
  var userQuery = useQuery([QueryKeys.getUserByIdForUpdateKey], () =>
    userServices.getUserByIdForUpdate(Id, token)
  );
  useEffect(() => {
    if (userQuery.isSuccess) {
      dispatch({
        type: "init",
        payload: userQuery.data?.data,
      });
    }
  }, [userQuery.isSuccess]);
  const handleUserChange = ({ target: { value, name } }) => {
    if (name === "password" || name === "confirmPassword") {
      if (value.trim() === "") {
        dispatch({
          type: name,
          payload: null,
        });
      } else {
        dispatch({
          type: name,
          payload: value,
        });
      }
    } else {
      dispatch({
        type: name,
        payload: value,
      });
    }
  };
  const handleClick = () => {
    setOpenError(true);
  };
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenError(false);
  };
  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };
  useEffect(() => {
    if (mutate.isError) {
      setError("");
      handleCloseSuccess();
      if (mutate.error.response.data.message) {
        setError(mutate.error.response.data.message);
      } else if (mutate.error.response.data.errors) {
        setError(
          Object.entries(mutate.error.response.data.errors).map(
            ([key, value]) => `${key} - ${value}`
          )
        );
      }
    }
  }, [mutate.isError]);

  const handleUserUpdate = (e) => {
    e.preventDefault();
    mutate.mutate();
  };
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
    return <h1>...Is Loading</h1>;
  }
  if (userQuery.isError) {
    return <h1>...Error</h1>;
  }

  return (
    <div className="update-form">
      <div className="container">
        <section className="heading">
          <div>
            <h1>Update User</h1>
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
              label="User Name"
              name="userName"
              variant="outlined"
              size="small"
              required
              value={inputstate.userName}
              defaultValue={userQuery.data?.data.userName}
              onChange={handleUserChange}
            />
            <TextField
              id="outlined-basic"
              label="Full Name"
              variant="outlined"
              name="fullName"
              size="small"
              required
              value={inputstate.fullName}
              defaultValue={userQuery.data?.data.fullName}
              onChange={handleUserChange}
            />
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              size="small"
              name="email"
              required
              value={inputstate.email}
              defaultValue={userQuery.data?.data.email}
              onChange={handleUserChange}
            />
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              size="small"
              name="password"
              type="password"
              value={inputstate.password}
              onChange={handleUserChange}
            />
            <TextField
              id="outlined-basic"
              label="Confirm Password"
              variant="outlined"
              size="small"
              type="password"
              name="confirmPassword"
              value={inputstate.confirmPassword}
              onChange={handleUserChange}
            />

            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={roleQuery.data?.data ?? []}
              getOptionLabel={(option) => option.name}
              sx={{ width: 300 }}
              value={inputstate.roleId}
              multiple
              onChange={(e, newValue) => {
                newValue.length > 0
                  ? dispatch({
                      type: "roleId",
                      payload: newValue.map((role) => role.id),
                    })
                  : dispatch({
                      type: "roleId",
                      payload: [],
                    });
              }}
              defaultValue={roleQuery.data?.data.filter((role) =>
                userQuery.data?.data.roleId?.some(
                  (userRole) => userRole === role.id
                )
              )}
              renderInput={(params) => <TextField {...params} label="Roles" />}
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
                defaultValue={userQuery.data?.data.isActive}
                onChange={handleUserChange}
              >
                <MenuItem value={false}>No</MenuItem>
                <MenuItem value={true}>Yes</MenuItem>
              </Select>
            </FormControl>
            <Snackbar
              open={openError}
              autoHideDuration={6000}
              onClose={handleCloseError}
            >
              <Alert
                onClose={handleCloseError}
                severity="error"
                sx={{ width: "100%" }}
                variant="filled"
              >
                {Array.isArray(error)
                  ? error?.map((err) => <h1 style={{ margin: 0 }}>{err}</h1>)
                  : error}
              </Alert>
            </Snackbar>
          </Box>
          <Button
            sx={{ width: 200 }}
            variant="contained"
            onClick={handleUserUpdate}
          >
            Update User
          </Button>
          <div className="progress">
            {mutate.isLoading ? <CircularProgress /> : ""}{" "}
          </div>
        </section>
      </div>
    </div>
  );
};
