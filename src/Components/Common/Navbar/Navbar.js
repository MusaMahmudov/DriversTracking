import { Box, Button, Drawer, Popover } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./navbar.scss";
import React, { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import {
  getToken,
  removeExpireDate,
  removeToken,
} from "../../../utils/TokenServices";
import { jwtDecode } from "jwt-decode";
import {
  tokenRoleProperty,
  tokenUserNameProperty,
} from "../../../utils/TokenProperties";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";

export const Navbar = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const token = getToken();
  const [userInformation, setUserInformation] = useState({
    userName: "",
    role: "",
  });
  const handleDrawerOpen = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const handleLogout = () => {
    if (token) {
      removeExpireDate(token);
      removeToken(token);
      localStorage.clear();
      if (window.location.pathname !== "/SignIn") {
        navigate("/SignIn");
        return;
      }
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      if (!Array.isArray(decodedToken[tokenRoleProperty])) {
        setUserInformation({
          userName: decodedToken[tokenUserNameProperty],
          role: decodedToken[tokenRoleProperty],
        });
      } else {
        setUserInformation({
          userName: decodedToken[tokenUserNameProperty],
          role: decodedToken[tokenRoleProperty].join(" - "),
        });
      }
    }
  }, []);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <header>
      <div className="container">
        <div className="navbar">
          {window.innerWidth > 450 ? (
            <section className="navbar-left">
              {" "}
              <Button
                sx={{
                  color: "white",
                  width: {
                    xs: 140,
                    sm: 170,
                    md: 200,
                    lg: 260,
                    xl: 310,
                  },
                }}
                variant="filled"
                onClick={() => navigate("/Drivers")}
              >
                Drivers
              </Button>
              <Button
                sx={{
                  color: "white",
                  width: {
                    xs: 140,
                    sm: 170,
                    md: 200,
                    lg: 260,
                    xl: 310,
                  },
                }}
                variant="filled"
                onClick={() => navigate("/VehicleTypes")}
              >
                Vehicle's Types
              </Button>
              {userInformation.role.includes("Admin") ? (
                <Button
                  sx={{
                    color: "white",
                    width: {
                      xs: 140,
                      sm: 170,
                      md: 200,
                      lg: 260,
                      xl: 310,
                    },
                  }}
                  variant="filled"
                  onClick={() => navigate("/Users")}
                >
                  Users
                </Button>
              ) : (
                ""
              )}
              <Button
                sx={{
                  color: "white",
                  width: {
                    xs: 140,
                    sm: 170,
                    md: 200,
                    lg: 260,
                    xl: 310,
                  },
                }}
                variant="filled"
                onClick={() => navigate("/Map")}
              >
                Map
              </Button>{" "}
            </section>
          ) : (
            <section className="navbar-left-responsive">
              <Button className="toggleButton" onClick={handleDrawerOpen}>
                <DensityMediumIcon></DensityMediumIcon>
              </Button>
              <Drawer
                anchor="left"
                onClose={handleDrawerOpen}
                open={isDrawerOpen}
              >
                <Button
                  sx={{
                    color: "white",
                    marginTop: 15,
                  }}
                  variant="contained"
                  onClick={() => navigate("/Drivers")}
                >
                  Drivers
                </Button>
                <Button
                  sx={{
                    color: "white",
                    marginTop: 5,
                  }}
                  variant="contained"
                  onClick={() => navigate("/VehicleTypes")}
                >
                  Vehicle's Types
                </Button>
                {userInformation.role.includes("Admin") ? (
                  <Button
                    sx={{
                      color: "white",
                      marginTop: 5,
                    }}
                    variant="contained"
                    onClick={() => navigate("/Users")}
                  >
                    Users
                  </Button>
                ) : (
                  ""
                )}
                <Button
                  sx={{
                    color: "white",
                    marginTop: 5,
                  }}
                  variant="contained"
                  onClick={() => navigate("/Map")}
                >
                  Map
                </Button>{" "}
              </Drawer>
            </section>
          )}
          <section className="navbar-right">
            <div className="user-info">
              <Button
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 4,
                }}
                aria-describedby={id}
                variant="contained"
                onClick={handleClick}
              >
                <span className="user-icon">
                  <PersonIcon sx={{ fontSize: 40, marginTop: 1 }} />
                </span>
                <span>
                  <h1>{userInformation.userName}</h1>
                  <p>{userInformation.role}</p>
                </span>
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    zIndex: "9999",
                  }}
                >
                  <Button
                    sx={{ padding: "10px 10px", fontSize: "13px" }}
                    onClick={() => navigate("ChangePassword")}
                  >
                    Change Password
                  </Button>
                  <Button
                    sx={{ padding: "10px 30px" }}
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </Button>
                </Box>
              </Popover>
            </div>
          </section>
        </div>
      </div>
    </header>
  );
};
