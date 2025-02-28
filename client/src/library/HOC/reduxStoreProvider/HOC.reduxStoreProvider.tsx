"use client";
import { Provider } from "react-redux";
import { TComponentProps } from "@/types/interfacesAndtypes/interafacesAndtypes";
import { store } from "@/library/redux/store/redux.store";

export const ReduxStoreProvider = ({ children }: TComponentProps<"div">) => {
  return <Provider store={store}>{children}</Provider>;
};
