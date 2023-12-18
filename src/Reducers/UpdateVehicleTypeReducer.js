export const UpdateVehicleTypeReducer = (state, action) => {
  switch (action.type) {
    case "init":
      return { ...state, ...action.payload };
    case "name":
      return { ...state, name: action.payload };
  }
};
