import { ThemeProvider } from "@emotion/react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Snackbar,
  TextField,
  Typography,
  createTheme,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link, useNavigate } from "react-router-dom";
import { Copyright } from "@mui/icons-material";
import { useService } from "../../hooks";
import { useMutation } from "react-query";
import { useEffect, useState } from "react";
const defaultTheme = createTheme();

export const ForgotPassword = () => {
  const { userServices } = useService();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const mutate = useMutation(() => userServices.forgotPassword(email), {
    onSuccess: (response) => {
      return (
        setOpenSuccess(true),
        setError(""),
        setOpenError(false),
        setSuccess(response.data)
      );
    },
    onError: () => {
      return handleClick();
    },
  });

  useEffect(() => {
    if (mutate.isError) {
      setError("");
      handleCloseSuccess();
      if (mutate.error.response.data.message) {
        setError(mutate.error.response.data.message);
      }
    }
  }, [mutate.isError]);
  const handleEmail = ({ target: { value, name } }) => {
    setEmail((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate.mutate();
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

  return (
    <div className="forgotpassword">
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
              Forgot Password
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <Button variant="contained" onClick={() => navigate(-1)}>
                Back
              </Button>

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleEmail}
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
                  {success}
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
            </Box>
          </Box>
          <Copyright sx={{ mt: 4, mb: 4, pb: 4 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
};
