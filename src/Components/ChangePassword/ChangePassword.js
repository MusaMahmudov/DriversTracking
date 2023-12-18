import { Copyright, Token } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Snackbar,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useService } from "../../hooks";
import { getDecodedToken, getToken } from "../../utils/TokenServices";
import { useMutation } from "react-query";
import { tokenUserIDProperty } from "../../utils/TokenProperties";

const defaultTheme = createTheme();
export const ChangePassword = () => {
  const { userServices } = useService();
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [error, setError] = useState();
  const token = getToken();
  const decodedToken = getDecodedToken();
  const [changePasswordValues, setChangePasswordValues] = useState({});

  const mutate = useMutation(
    () =>
      userServices.changePasswordById(
        decodedToken[tokenUserIDProperty],
        changePasswordValues,
        token
      ),
    {
      onError: () => handleClick(),
      onSuccess: () => {
        return setOpenSuccess(true), setError(""), handleCloseError();
      },
    }
  );

  const handleChangePassword = ({ target: { value, name } }) => {
    setChangePasswordValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleClick = () => {
    setOpenError(true);
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
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate.mutate();
  };

  return (
    <div className="change-password">
      <div className="container">
        <div className="form">
          <ThemeProvider theme={defaultTheme}>
            <Container
              sx={{
                background: "white",
                borderRadius: 10,
              }}
              component="main"
              maxWidth="xs"
            >
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 6,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  pr: 5,
                  pl: 5,
                  pt: 3,
                  pb: 3,
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Change Password
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="userName"
                    type="password"
                    label="Old Password"
                    name="oldPassword"
                    autoComplete="oldPassword"
                    autoFocus
                    onChange={handleChangePassword}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="newPassword"
                    label="New Password"
                    type="password"
                    id="newPassword"
                    autoComplete="current-password"
                    onChange={handleChangePassword}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    autoComplete="current-password"
                    onChange={handleChangePassword}
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
                  <Snackbar
                    open={openSuccess}
                    autoHideDuration={6000}
                    onClose={handleCloseSuccess}
                  >
                    <Alert
                      onClose={handleCloseSuccess}
                      severity="success"
                      sx={{ width: "100%" }}
                      variant="filled"
                    >
                      Password Changed Successefully
                    </Alert>
                  </Snackbar>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Change Password
                  </Button>
                </Box>
              </Box>
              <Copyright sx={{ mt: 4, mb: 4, pb: 4 }} />
            </Container>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
};
