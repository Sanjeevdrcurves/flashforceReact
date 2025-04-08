const initialState = {
  userToken: null,
  userData: null,
  userId: "",
  isLoggedIn: false,
  fullName: "",
  email: "",
  companyId: "",
  enableSMSOTP: false,
  imageName: "",
  enableTOTP: false,
  referralCode: "",
  theme: "light",
  enableTransparentSideBar: false,
  user2FA:false,
};

export const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        userToken: action.payload.token,
        userData: action.payload.data,
        userId: action.payload.userId,
        isLoggedIn: true,
        imageName: action.payload.imageName,
        companyId: action.payload.companyId,
        fullName: action.payload.fullName,
        email: action.payload.email,
        enableSMSOTP: action.payload.enableSMSOTP,
        enableTOTP: action.payload.enableTOTP,
        referralCode: action.payload.referralCode,
        theme: action.payload.theme,
        enableTransparentSideBar: action.payload.enableTransparentSideBar,
        parentUserId: action.payload.parentUserId
          ? action.payload.parentUserId
          : action.payload.userId,
        parentEmail: action.payload.parentEmail
          ? action.payload.parentEmail
          : action.payload.email,
        chargingAmount: action.payload.chargingAmount,
        user2FA:action.payload.user2FA
      };

    case "UPDATE_THEME_SETTINGS":
      return {
        ...state,
        theme: action.payload.theme,
        enableTransparentSideBar: action.payload.enableTransparentSideBar,
      };
    case "UPDATE_REFERRAL_CODE":
      return {
        ...state,
        referralCode: action.payload.referralCode,  
        user2FA:action.payload.user2FA
      };
    case "UPDATE_TWOFA":
      return {
        ...state,
        enableSMSOTP: action.payload.enableSMSOTP,
        enableTOTP: action.payload.enableTOTP,
      };
    case "UPDATE_USER_IMAGE":
      return {
        ...state,
        imageName: action.payload.imageName,
      };
    case "LOGOUT":
      return initialState;

    default:
      return state;
  }
};
