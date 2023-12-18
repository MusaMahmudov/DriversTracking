export const UpdateUserReducer = (state, action) => {
  switch (action.type) {
    case "init":
      return { ...state, ...action.payload };
    case "userName":
      return { ...state, userName: action.payload };
    case "fullName":
      return { ...state, fullName: action.payload };
    case "email":
      return { ...state, email: action.payload };
    case "password":
      return { ...state, password: action.payload };
    case "confirmPassword":
      return { ...state, confirmPassword: action.payload };
    case "isActive":
      return { ...state, isActive: action.payload };
    case "roleId":
      return { ...state, roleId: action.payload };
  }
};
