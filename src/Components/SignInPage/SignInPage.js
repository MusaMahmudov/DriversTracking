import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useState } from "react";
import { useEffect } from "react";
import { Alert, LinearProgress, Snackbar } from "@mui/material";
import { useService } from "../../hooks";
import { getToken } from "../../utils/TokenServices";
import { Cookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { tokenUserIDProperty } from "../../utils/TokenProperties";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      {new Date().getFullYear()} Developed by Musa Mahmudov
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();
export default function SignIn() {
  const navigate = useNavigate();

  useEffect(() => {
    const existingToken = getToken();

    if (existingToken) {
      return navigate("/Drivers", { replace: true });
    }
  }, []);
  const { authServices } = useService();
  const [token, setToken] = useState();
  const cookie = new Cookies();
  const [expireDate, setExpireDate] = useState();
  const [user, setUser] = useState({
    userName: "",
    password: "",
  });
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  var mutate = useMutation(() => authServices.Login(user), {
    onError: () => handleClick(),
    onSuccess: (res) => (
      setToken(res.data?.token), setExpireDate(res.data?._expireDate)
    ),
  });

  useEffect(() => {
    if (mutate.isSuccess) {
      const decodedToken = jwtDecode(token);
      localStorage.setItem("UI", decodedToken[tokenUserIDProperty]);
      cookie.set(`${decodedToken[tokenUserIDProperty]}`, token);
      cookie.set(`expireDate${decodedToken[tokenUserIDProperty]}`, expireDate);
      navigate("/Drivers");
    }
  }, [mutate.isSuccess]);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (user.password && user.userName) {
      mutate.mutate();
    }
  };
  return (
    <div className="adminPanelLogin">
      <ThemeProvider theme={defaultTheme}>
        <Container
          sx={{
            marginTop: 2,
            background: "white",
            borderRadius: 10,
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}
          component="main"
          maxWidth="xs"
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
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
              Sign in
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
                label="User Name"
                name="userName"
                autoComplete="userName"
                autoFocus
                onChange={(e) => {
                  setUser((prev) => ({
                    ...prev,
                    userName: e.target.value,
                  }));
                }}
                error={user.userName ? "" : "error"}
                helperText={user.userName ? "" : "User name is required"}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => {
                  setUser((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                }}
                error={user.password ? "" : "error"}
                helperText={user.password ? "" : "Password  is required"}
              />

              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
              >
                <Alert
                  onClose={handleClose}
                  severity="error"
                  sx={{ width: "100%" }}
                  variant="filled"
                >
                  Username or Password is wrong!
                </Alert>
              </Snackbar>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <div className="progress">
                {mutate.isLoading ? <LinearProgress /> : ""}{" "}
              </div>
              <Grid container>
                <Grid item xs>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate("/ForgotPassword")}
                  >
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 4, mb: 4, pb: 4 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
}
