import { createContext, useReducer } from "react";

export const AppContext = createContext();

const initialState = {
    userID: null,
    isBankLinked: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "setUserID":
      return { ...state, userID: action.value }
    case "setIsBankLinked":
      return { ...state, isBankLinked: action.value }
    default:
      return state
  }
};

export const AppContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AppContext.Provider>
  )
};