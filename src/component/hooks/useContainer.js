import { produce } from "immer";
import React, { createContext, useContext, useEffect, useReducer } from "react";

const Ctx = createContext({});

const useContainer = () => useContext(Ctx);

const ACTION_MAP = {
  SYSTEM_THEME: "systemTheme",
  USER_DATA: "userData",
  CATEGORY: "category",
  TODO_ITEMS: "todoItems",
};

const reducer = produce((store, action) => {
  const { type, payload } = action;
  if (ACTION_MAP[type]) {
    store[ACTION_MAP[type]] = payload;
  } else {
    throw new Error();
  }
  return store;
});

function Provider({ children }) {
  const [store, dispatch] = useReducer(reducer, {
    systemTheme: "dark",
    userData: null,
    category: [],
    todoItems: [],
    isDesktop: true,
  });

  useEffect(() => {
    console.log("%c Store: %o", "background: green;font-size: 16px;color: #fff;", store);
  }, [store]);

  return <Ctx.Provider value={{ store, dispatch }}>{children}</Ctx.Provider>;
}

export { useContainer, Provider, ACTION_MAP };
