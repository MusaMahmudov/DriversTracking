import { ThemeProvider } from "@emotion/react";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  createTheme,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { Copyright } from "@mui/icons-material";
import { useState } from "react";
import { useMutation } from "react-query";
import { useService } from "../../hooks";
const defaultTheme = createTheme();

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const email = decodeURIComponent(search.get("email"));
  const token = decodeURIComponent(search.get("token"));
  const { userServices } = useService();

  const [newPassword, setNewPassword] = useState({
    email: email,
    token: token,
    password: "",
    confirmPassword: "",
  });
  const mutate = useMutation(() => userServices.resetPassword(newPassword), {
    onSuccess: () => navigate("/SignIn"),
  });
  const handleChange = ({ target: { value, name } }) => {
    setNewPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate.mutate();
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
              Reset Password
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                type="password"
                margin="normal"
                required
                fullWidth
                id="newpassword"
                label="New Password"
                name="password"
                autoComplete="newPassword"
                autoFocus
                onChange={handleChange}
              />
              <TextField
                type="password"
                margin="normal"
                required
                fullWidth
                id="confirmPassword"
                label="Confirm Password"
                name="confirmPassword"
                autoComplete="confirmPassword"
                autoFocus
                onChange={handleChange}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Reset Password
              </Button>
            </Box>
          </Box>
          <Copyright sx={{ mt: 4, mb: 4, pb: 4 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
};
