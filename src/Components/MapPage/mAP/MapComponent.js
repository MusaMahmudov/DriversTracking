import React, { useEffect, useMemo, useState } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import { useService } from "../../../hooks";
import { useMutation, useQuery } from "react-query";
import { QueryKeys } from "../../../APIs/QueryKeys";
import axios from "axios";
import { getDecodedToken, getToken } from "../../../utils/TokenServices";
import {
  Button,
  CircularProgress,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import "./map.scss";
import SearchIcon from "@mui/icons-material/Search";
import {
  tokenRoleProperty,
  tokenUserNameProperty,
} from "../../../utils/TokenProperties";
import {
  calculateDistance,
  zipCodeRegularExpression,
} from "../../../utils/MapServices";
import { colorOfVehicleType } from "../../../utils/DriverServices";
const MapComponent = () => {
  const token = getToken();
  const [locations, setLocations] = useState([]);
  const [distanceFilterValue, setDistanceFilterValue] = useState(
    localStorage.getItem("distanceFilter")
      ? localStorage.getItem("distanceFilter")
      : 250
  );
  const [driverId, setDriverId] = useState(null);
  const [reserveValue, setReserveValue] = useState({ isReserved: null });
  const [locationSearch, setLocationSearch] = useState(
    localStorage.getItem("searchField")
      ? localStorage.getItem("searchField")
      : ""
  );
  const [searchCoordinates, setSearchCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const { driverServices } = useService();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
  });
  const driversQuery = useQuery([QueryKeys.getDriversQueryKey], () =>
    driverServices.getAllDriversForMapPage(token)
  );
  const decodedToken = getDecodedToken();
  const userName = decodedToken ? decodedToken[tokenUserNameProperty] : "";
  const userRole = decodedToken ? decodedToken[tokenRoleProperty] : "";
  const mutate = useMutation(
    () => driverServices.revervDriverMapPage(driverId, reserveValue, token),
    {
      onSuccess: () => driversQuery.refetch(),
    }
  );
  const handleReserve = (driverId, isReserved) => {
    setDriverId(driverId);
    setReserveValue({
      isReserved: isReserved,
    });
  };
  const handleDistanceFilter = (e) => {
    e.preventDefault();
    setDistanceFilterValue(e.target.value);
    localStorage.setItem("distanceFilter", e.target.value);
  };
  useEffect(() => {
    if (driverId && reserveValue) {
      mutate.mutate();
    }
  }, [driverId, reserveValue]);
  const center = useMemo(() => ({ lat: 47.115204, lng: -101.935242 }), []);
  useEffect(() => {
    const fetchLocations = async () => {
      if (driversQuery.isSuccess && driversQuery.data?.data.length > 0) {
        const locationPromises = driversQuery.data?.data.map(async (driver) => {
          try {
            if (driver.latitude !== null && driver.longitude !== null) {
              return {
                lat: driver.latitude,
                lng: driver.longitude,
                driverName: driver.name,
                vehicleType: driver.vehicleType.name,
              };
            } else {
              return null;
            }
          } catch (error) {
            console.error(error);
            return null;
          }
        });
        const resolvedLocations = await Promise.all(locationPromises);
        setLocations(resolvedLocations.filter((location) => location !== null));
      }
    };
    fetchLocations();
  }, [driversQuery.isSuccess]);
  if (driversQuery.isLoading) {
    return <h1>...Is Loading</h1>;
  }
  const containerStyle = {
    width: `${window.innerWidth > 1000 ? "50%" : "100%"}`,
    height: "100vh",
  };

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    setLocationSearch(document.getElementById("searchField").value);
    localStorage.setItem(
      "searchField",
      document.getElementById("searchField").value
    );
    const zipCode = document
      .getElementById("searchField")
      .value.match(zipCodeRegularExpression);
    try {
      var response = await geoZipCode(zipCode ? zipCode[0] : null);
      if (response) {
        setSearchCoordinates({
          lat: response.lat,
          lng: response.lng,
        });
      }
    } catch (error) {
      setSearchCoordinates({
        lat: null,
        lng: null,
      });
      console.error(error);
    }
  };
  const createMarkerIcon = (color) => ({
    path: "M 0,0 m -2,0 a 2,2 0 1,0 4,0 a 2,2 0 1,0 -4,0",
    fillColor: color,
    fillOpacity: 1,
    strokeColor: "#000",
    strokeWeight: 1,
    scale: 7,
  });
  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };
  if (driversQuery.isLoading) {
    <h1>...Is Loading</h1>;
  }
  return (
    <div className="map">
      <div className="map-search">
        <div className="container">
          <div className="search">
            <TextField
              size="small"
              defaultValue={locationSearch}
              placeholder="Search..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e);
                }
              }}
              id="searchField"
            />
            <div className="search-settings">
              <button className="find-button" onClick={handleSearch}>
                <SearchIcon />
                {window.innerWidth < 320 ? "" : "Find"}
              </button>
              <Select
                defaultValue={distanceFilterValue}
                size="small"
                value={distanceFilterValue}
                onChange={handleDistanceFilter}
              >
                <MenuItem value="350">350 MI</MenuItem>
                <MenuItem value="250">250 MI</MenuItem>
                <MenuItem value="150">150 MI</MenuItem>
                <MenuItem value="50">50 MI</MenuItem>
              </Select>
            </div>
          </div>
          <div className="results">
            {driversQuery.data?.data
              .filter((driver) =>
                locationSearch.trim() !== ""
                  ? calculateDistance(
                      searchCoordinates.lat,
                      searchCoordinates.lng,
                      driver.latitude,
                      driver.longitude
                    ) <= distanceFilterValue ||
                    driver.currentLocation
                      .toLowerCase()
                      .includes(locationSearch.toLowerCase())
                  : null
              )
              .sort((a, b) =>
                searchCoordinates.lat
                  ? calculateDistance(
                      searchCoordinates.lat,
                      searchCoordinates.lng,
                      a.latitude,
                      a.longitude
                    ) -
                    calculateDistance(
                      searchCoordinates.lat,
                      searchCoordinates.lng,
                      b.latitude,
                      b.longitude
                    )
                  : 0
              )
              .map((driver) => (
                <div className="result" key={driver.id}>
                  <div className="result-left">
                    <section className="name">
                      <h1>{driver.name}</h1>
                    </section>
                    <section className="location">
                      <p>Location: {driver.currentLocation}</p>
                    </section>
                    <section className="dimensions">
                      <p>Dims: {driver.dimensions}</p>
                    </section>
                    <section className="capacity">
                      <p>Capacity: {driver.capacity}</p>
                    </section>
                    <section className="phone">
                      <p>Phone: {driver.phone}</p>
                    </section>
                    <section className="Notes">
                      <h2>Note: {driver.notes}</h2>
                    </section>
                  </div>
                  <div className="result-right">
                    <section className="distance">
                      <h1>
                        {searchCoordinates.lat
                          ? Math.round(
                              calculateDistance(
                                searchCoordinates.lat,
                                searchCoordinates.lng,
                                driver.latitude,
                                driver.longitude
                              )
                            )
                          : "*"}
                        -MI
                      </h1>
                    </section>
                    <section
                      className="vehicleType"
                      style={{
                        background:
                          driver.vehicleType.name === "Box Truck"
                            ? "#93ea93"
                            : driver.vehicleType.name === "Sprinter"
                            ? "#267dff"
                            : "yellow",
                      }}
                    >
                      <h1>{driver.vehicleType.name}</h1>
                    </section>
                    <section className="reserve">
                      <Button
                        disabled={
                          (driver.reservedBy !== userName &&
                            driver.isReserved &&
                            !userRole.includes("Admin")) ||
                          mutate.isLoading
                            ? true
                            : false
                        }
                        variant="contained"
                        color={driver.isReserved ? "error" : "success"}
                        onClick={() =>
                          handleReserve(driver.id, !driver.isReserved)
                        }
                      >
                        {driver.isReserved ? "Unreserve" : "Reserve"}
                      </Button>
                      {mutate.isLoading && driverId === driver.id ? (
                        <h1 style={{ margin: "0px" }}>...Loading</h1>
                      ) : (
                        ""
                      )}

                      {driver.isReserved && (
                        <p>{`  ${
                          driver.reservedAgo.slice(3, 5) >= 10
                            ? driver.reservedAgo.slice(3, 5)
                            : driver.reservedAgo.slice(4, 5)
                        } minutes ago by ${driver.reservedBy}`}</p>
                      )}
                    </section>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {!isLoaded ? (
        <h1>...Is Loading</h1>
      ) : (
        <GoogleMap
          center={center}
          options={options}
          zoom={4}
          mapContainerStyle={containerStyle}
        >
          {locations.map((location, index) => (
            <Marker
              key={index}
              position={{
                lat: Number(location.lat + index * 0.0001),
                lng: Number(location.lng),
              }}
              icon={createMarkerIcon(colorOfVehicleType(location.vehicleType))}
              label={{ text: `${location.driverName}` }}
              onClick={() =>
                handleMarkerClick({
                  lat: Number(location.lat),
                  lng: Number(location.lng),
                  driverName: location.driverName,
                })
              }
            />
          ))}

          {selectedMarker && (
            <InfoWindow
              position={selectedMarker}
              onCloseClick={handleInfoWindowClose}
              zoom={10}
            >
              <div>
                <h2>{selectedMarker.driverName}</h2>
                <p></p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </div>
  );
};
export default MapComponent;

export const geoZipCode = async (zipcode) => {
  try {
    var response = await axios.get(
      `https://api.zipcodestack.com/v1/search?apikey=${process.env.REACT_APP_ZIPCODE_KEY}&codes=${zipcode}&country=us`
    );
    const result = response.data?.results[zipcode][0];
    if (result) {
      return { lat: result.latitude, lng: result.longitude };
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Error geocoding zip code  ${error.message}`);
  }
};

export const getCurrentLocation = async (zipcode) => {
  try {
    var response = await axios.get(
      `https://api.zipcodestack.com/v1/search?apikey=${process.env.REACT_APP_ZIPCODE_KEY}&codes=${zipcode}&country=us`
    );
    const result = response.data?.results[zipcode][0];
    if (result) {
      return {
        state: result.state,
        city: result.city,
        countryCode: result.country_code,
        latitude: result.latitude,
        longitude: result.longitude,
      };
    }
  } catch (error) {
    throw new Error(`Error geocoding zip code  ${error.message}`);
  }
};
