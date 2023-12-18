import { useQuery } from "react-query";
import { useService } from "../../hooks";
import { QueryKeys } from "../../APIs/QueryKeys";
import { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Fab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import "./userlist.scss";
import { getDecodedToken, getToken } from "../../utils/TokenServices";
import { tokenRoleProperty } from "../../utils/TokenProperties";
export const UserList = () => {
  const token = getToken();
  const navigate = useNavigate();
  const { userServices } = useService();
  const userQuery = useQuery([QueryKeys.getUsersKey], () =>
    userServices.getAllUsers(token)
  );
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
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

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  if (userQuery.isLoading) {
    return <h1>...Is Loading</h1>;
  }

  return (
    <div className="drivers-list">
      <div className="container">
        <div className="drivers">
          <TableContainer component={Paper}>
            <div className="heading">
              <h1>Users</h1>
            </div>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Id</StyledTableCell>
                  <StyledTableCell>User Name</StyledTableCell>
                  <StyledTableCell align="left">Full Name</StyledTableCell>
                  <StyledTableCell align="left">Email</StyledTableCell>
                  <StyledTableCell align="left">Is Active</StyledTableCell>
                  <StyledTableCell align="left">Roles</StyledTableCell>
                  <StyledTableCell align="left">Actions</StyledTableCell>
                  <div
                    className="add-button"
                    onClick={() => navigate("/CreateUser")}
                  >
                    <Fab color="primary" aria-label="add">
                      <AddIcon />
                    </Fab>
                  </div>
                </TableRow>
              </TableHead>
              <TableBody>
                {userQuery.data?.data.map((user) => (
                  <StyledTableRow key={user.id}>
                    <StyledTableCell component="th" scope="row">
                      {user.id}
                    </StyledTableCell>

                    <StyledTableCell align="left">
                      {user.userName}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {user.fullName}
                    </StyledTableCell>
                    <StyledTableCell align="left">{user.email}</StyledTableCell>
                    <StyledTableCell align="left">
                      {user.isActive ? "Yes" : "No"}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {user.roleName?.map(
                        (role, index, array) =>
                          `${index === array.length - 1 ? role : `${role} - `} `
                      )}
                    </StyledTableCell>

                    <StyledTableCell align="left">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/UserDetails/${user.id}`)}
                      >
                        Details
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ ml: 5, mr: 5 }}
                        size="small"
                        color="warning"
                        onClick={() => navigate(`/UpdateUser/${user.id}`)}
                      >
                        Update
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        disabled={
                          user.roleName.some((role) => role === "Admin")
                            ? true
                            : false
                        }
                        onClick={() => navigate(`/DeleteUser/${user.id}`)}
                      >
                        Delete
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};
