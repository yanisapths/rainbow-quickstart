import { createContext, useContext } from "react";

export const defaultLoadingDelay = 400;
export const defaultToastAutoHideTimeout = 3000;

interface IAppContext {
  Loading: {
    show: () => void;
    hide: () => void;
  };
}

const defaultAppState = {
  Loading: {
    show: () => {},
    hide: () => {},
  },
};

export const AppContext = createContext<IAppContext>(defaultAppState);
AppContext.displayName = "Application";

export function useAppContext() {
  return useContext(AppContext);
}
