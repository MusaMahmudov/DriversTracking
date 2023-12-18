export const colorOfVehicleType = (vehicleType) => {
  let color;
  switch (vehicleType) {
    case "Box Truck":
      color = "green";
      break;
    case "Sprinter":
      color = "blue";
      break;
    case "Large straight":
      color = "yellow";
      break;
  }
  return color;
};
