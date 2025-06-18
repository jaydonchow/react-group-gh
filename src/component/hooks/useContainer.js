import { produce } from "immer";
import React, { createContext, useContext, useEffect, useReducer } from "react";

const Ctx = createContext({});

export const useContainer = () => useContext(Ctx);

const reducer = produce((store, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SYSTEM_THEME":
      store.systemTheme = payload;
      break;
    case "USER_DATA":
      store.userData = payload;
      break;
    case "CATEGORY":
      store.category = payload;
      break;
    default:
      throw new Error();
  }
  return store;
});

export function Provider({ children }) {
  const [store, dispatch] = useReducer(reducer, {
    systemTheme: "dark",
    userData: null,
    category: [],
    isDesktop: true,
  });

  useEffect(() => {
    console.log("%c Store: %o", "background: green;font-size: 16px;color: #fff;", store);
  }, [store]);

  return <Ctx.Provider value={{ store, dispatch }}>{children}</Ctx.Provider>;
}
