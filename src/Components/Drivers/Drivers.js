import { useQuery } from "react-query";
import { useService } from "../../hooks";
import { QueryKeys } from "../../APIs/QueryKeys";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Fab, TextField, createTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import "./drivers.scss";
import { getToken } from "../../utils/TokenServices";
export const Drivers = () => {
  const navigate = useNavigate();
  const token = getToken();
  const [nameSearch, setNameSearch] = useState("");
  const [vehicleTypeSearch, setVehicleTypeSearch] = useState("");
  const [ownerSearch, setOwnerSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const { driverServices } = useService();
  const driverQuery = useQuery([QueryKeys.getDriversQueryKey], () =>
    driverServices.getAllDrivers(token)
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

  if (driverQuery.isLoading) {
    return <h1>...Is Loading</h1>;
  }
  if (driverQuery.isError) {
    return <h1>...Error</h1>;
  }
  return (
    <div className="drivers-list">
      <div className="container">
        <div className="drivers">
          <TableContainer component={Paper}>
            <div className="heading">
              <h1>Drivers</h1>
            </div>
            <div className="filter">
              <div className="container">
                <TextField
                  size="small"
                  sx={{ width: searchTextFieldDesign.textField.width }}
                  placeholder="Name..."
                  onBlur={(e) => setNameSearch(e.target.value)}
                ></TextField>
                <TextField
                  sx={{ width: searchTextFieldDesign.textField.width }}
                  onBlur={(e) => setVehicleTypeSearch(e.target.value)}
                  size="small"
                  placeholder="Vehicle's Type"
                ></TextField>
                <TextField
                  sx={{ width: searchTextFieldDesign.textField.width }}
                  size="small"
                  placeholder="Owner..."
                  onBlur={(e) => setOwnerSearch(e.target.value)}
                ></TextField>
                <TextField
                  sx={{ width: searchTextFieldDesign.textField.width }}
                  onBlur={(e) => setLocationSearch(e.target.value)}
                  size="small"
                  placeholder="Current Location..."
                ></TextField>
              </div>
            </div>
            <Table
              sx={{ width: "100%", overflowX: "scroll" }}
              aria-label="customized table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Id</StyledTableCell>
                  <StyledTableCell align="left">Owner</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell align="left">Phone</StyledTableCell>
                  <StyledTableCell align="left">Zip Code</StyledTableCell>
                  <StyledTableCell align="left">Dimensions</StyledTableCell>
                  <StyledTableCell align="left">Capacity</StyledTableCell>
                  <StyledTableCell align="left">Vehicle Type</StyledTableCell>

                  <StyledTableCell align="left">
                    Current Location
                  </StyledTableCell>
                  <StyledTableCell align="left">Is Active</StyledTableCell>
                  <StyledTableCell align="left">Actions</StyledTableCell>
                  <div
                    className="add-button"
                    onClick={() => navigate("/CreateDriver")}
                  >
                    <Fab color="primary" aria-label="add">
                      <AddIcon />
                    </Fab>
                  </div>
                </TableRow>
              </TableHead>
              <TableBody>
                {driverQuery.data?.data
                  .filter((driver) =>
                    driver.name
                      .toLocaleLowerCase()
                      .includes(nameSearch.toLocaleLowerCase().trim())
                  )
                  .filter((driver) =>
                    driver.owner
                      .toLocaleLowerCase()
                      .includes(ownerSearch.toLocaleLowerCase().trim())
                  )
                  .filter((driver) =>
                    driver.vehicleType.name
                      .toLocaleLowerCase()
                      .includes(vehicleTypeSearch.toLocaleLowerCase().trim())
                  )
                  .filter((driver) =>
                    driver.currentLocation
                      .toLocaleLowerCase()
                      .includes(locationSearch.toLocaleLowerCase().trim())
                  )
                  .map((driver, index) => (
                    <StyledTableRow key={driver.id}>
                      <StyledTableCell component="th" scope="row">
                        {index + 1}
                      </StyledTableCell>

                      <StyledTableCell align="left">
                        {driver.owner}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {driver.name}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {driver.phone}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {driver.zipCode ? driver.zipCode : "No Zip Code"}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {driver.dimensions}
                      </StyledTableCell>

                      <StyledTableCell align="left">
                        {driver.capacity}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {driver.vehicleType.name}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {driver.currentLocation
                          ? driver.currentLocation
                          : "No information"}
                      </StyledTableCell>

                      <StyledTableCell align="left">
                        {driver.isActive ? "Yes" : "No"}
                      </StyledTableCell>
                      <StyledTableCell align="left" sx={{ width: 280 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            navigate(`/DriverDetails/${driver.id}`)
                          }
                        >
                          <InfoIcon />
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ ml: 5, mr: 5 }}
                          size="small"
                          color="warning"
                          onClick={() => navigate(`/UpdateDriver/${driver.id}`)}
                        >
                          <ModeEditIcon />
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => navigate(`/DeleteDriver/${driver.id}`)}
                        >
                          x
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
export const searchTextFieldDesign = createTheme({
  textField: {
    width: { xs: 300, sm: 140, md: 180, lg: 220, xl: 350 },
    zIndex: 1,
  },
});
