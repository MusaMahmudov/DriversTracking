export const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance;
};
export const zipCodeRegularExpression = /\b\d{5}\b/;
