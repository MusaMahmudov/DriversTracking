import { useQuery } from "react-query";
import { useService } from "../../hooks";
import { QueryKeys } from "../../APIs/QueryKeys";
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

import "./vehicletypes.scss";
import { getToken } from "../../utils/TokenServices";
export const VehicleTypes = () => {
  const token = getToken();
  const navigate = useNavigate();
  const { vehicleTypeServices } = useService();
  const vehicletypesQuery = useQuery([QueryKeys.getVehicleTypesByIdKey], () =>
    vehicleTypeServices.getAllVehicleTypes(token)
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

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  if (vehicletypesQuery.isLoading) {
    return <h1>...Is Loading</h1>;
  }
  if (vehicletypesQuery.isError) {
    return <h1>...Error</h1>;
  }

  return (
    <div className="vehicleType-list">
      <div className="container">
        <div className="vehicle-types">
          <TableContainer component={Paper}>
            <div className="heading">
              <h1>Vehicle's Types</h1>
            </div>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>

                  <StyledTableCell align="left">Actions</StyledTableCell>
                  <div
                    className="add-button"
                    onClick={() => navigate("/CreateVehicleType")}
                  >
                    <Fab color="primary" aria-label="add">
                      <AddIcon />
                    </Fab>
                  </div>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicletypesQuery.data?.data.map((vehicleType) => (
                  <StyledTableRow key={vehicleType.id}>
                    <StyledTableCell component="th" scope="row">
                      {vehicleType.name}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          navigate(`/VehicleTypeDetails/${vehicleType.id}`)
                        }
                      >
                        Details
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ ml: 5, mr: 5 }}
                        size="small"
                        color="warning"
                        onClick={() =>
                          navigate(`/UpdateVehicleType/${vehicleType.id}`)
                        }
                      >
                        Update
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() =>
                          navigate(`/DeleteVehicleType/${vehicleType.id}`)
                        }
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
