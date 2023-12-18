export const UpdateDriverReducer = (state, action) => {
  switch (action.type) {
    case "init":
      return { ...state, ...action.payload };
    case "name":
      return { ...state, name: action.payload };
    case "owner":
      return { ...state, owner: action.payload };
    case "phone":
      return { ...state, phone: action.payload };
    case "dimensions":
      return { ...state, dimensions: action.payload };
    case "currentLocation":
      return { ...state, currentLocation: action.payload };
    case "latitude":
      return { ...state, latitude: action.payload };
    case "longitude":
      return { ...state, longitude: action.payload };
    case "notes":
      return { ...state, notes: action.payload };
    case "capacity":
      return { ...state, capacity: action.payload };
    case "zipCode":
      return { ...state, zipCode: action.payload };
    case "isReserved":
      return { ...state, isReserved: action.payload };
    case "isActive":
      return { ...state, isActive: action.payload };
    case "vehicleTypeId":
      return { ...state, vehicleTypeId: action.payload };
  }
};
