const initialState = {
    isPlanchanged:''
  };
  
  export const PlanReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'PlanUpdate':
        return {
          ...state,
          isPlanchanged:action.payload
        };
      default:
        return state;
    }
  };
  