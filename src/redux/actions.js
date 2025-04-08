export const Authhandler = (payload) => {
    return {
      type: "LOGIN",
      payload,

    };
  };
export const isPlanupdate = (payload) => {
    return {
      type: "PlanUpdate",
      payload,

    };
  };
export const updatImageUser = (payload) => {
    return {
      type: "UPDATE_USER_IMAGE",
      payload,

    };
  };
  
export const Logout = () => {
    return {
      type: "LOGOUT",
     

    };
  };
