import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
} from "@mui/material";
import "./createuser.scss";
import { useService } from "../../../hooks";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { QueryKeys } from "../../../APIs/QueryKeys";
import { useNavigate } from "react-router-dom";
import { getDecodedToken, getToken } from "../../../utils/TokenServices";
import { tokenRoleProperty } from "../../../utils/TokenProperties";
export const CreateUser = () => {
  const navigate = useNavigate();
  const token = getToken();
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);
  const { userServices, roleServices } = useService();
  const [newUser, setNewUser] = useState({
    roleId: [],
  });

  const rolesQuery = useQuery([QueryKeys.getRolesForUser], () =>
    roleServices.getAllRolesForUserActions()
  );

  const mutate = useMutation(() => userServices.createUser(newUser, token), {
    onSuccess: () => navigate("/Users"),
    onError: () => handleClick(),
  });

  useEffect(() => {
    console.log(newUser);
  }, [newUser]);
  const handleChangeNewUser = ({ target: { name, value } }) => {
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };
  const handleMutation = (e) => {
    e.preventDefault();
    mutate.mutate();
  };
  const handleClick = () => {
    setOpenError(true);
  };
  useEffect(() => {
    if (mutate.isError) {
      setError("");
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

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenError(false);
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
  if (rolesQuery.isLoading) {
    return <h1>...Is Loading</h1>;
  }
  if (rolesQuery.isError) {
    return <h1>...Error</h1>;
  }

  return (
    <div className="create-form">
      <div className="container">
        <section className="heading">
          <div>
            <h1>Create User</h1>
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
              id="outlined-basic-username"
              label="User Name"
              name="userName"
              variant="outlined"
              size="small"
              required
              onChange={handleChangeNewUser}
            />
            <TextField
              id="outlined-basic-fullname"
              label="Full Name"
              variant="outlined"
              name="fullName"
              size="small"
              required
              onChange={handleChangeNewUser}
            />
            <TextField
              id="outlined-basic-email"
              label="Email"
              variant="outlined"
              size="small"
              name="email"
              required
              onChange={handleChangeNewUser}
            />
            <TextField
              id="outlined-basic-password"
              label="Password"
              variant="outlined"
              size="small"
              name="password"
              type="password"
              required
              onChange={handleChangeNewUser}
            />
            <TextField
              id="outlined-basic-confirmpassword"
              label="Confirm Password"
              variant="outlined"
              size="small"
              required
              type="password"
              name="confirmPassword"
              onChange={handleChangeNewUser}
            />
            <Autocomplete
              size="small"
              disablePortal
              multiple
              id="combo-box-demo"
              options={rolesQuery.data?.data ?? []}
              getOptionLabel={(option) => option.name}
              sx={{ width: 300 }}
              onChange={(e, newValue) => {
                console.log(newValue, "new");
                newValue?.length > 0
                  ? setNewUser((prev) => ({
                      ...prev,
                      roleId: newValue.map((value) => value.id),
                    }))
                  : setNewUser((prev) => ({
                      ...prev,
                      roleId: [],
                    }));
              }}
              renderInput={(params) => <TextField {...params} label="Roles" />}
            />
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
                  ? error?.map((err) => <h1>{err}</h1>)
                  : error}
              </Alert>
            </Snackbar>
          </Box>
          <Button
            sx={{ width: 200 }}
            onClick={handleMutation}
            variant="contained"
          >
            Create User
          </Button>
          <div className="progress">
            {mutate.isLoading ? <CircularProgress /> : ""}{" "}
          </div>
        </section>
      </div>
    </div>
  );
};
