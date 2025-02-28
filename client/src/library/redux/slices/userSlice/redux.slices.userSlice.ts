import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/redux.store";
import { IUserInfo } from "@/types/userModule/types.userModule";

// Define the initial state for the counter
interface UserSlice {
  auth: {
    acessToken: string;
  };
  userData: IUserInfo | null;
}

const initialState: UserSlice = {
  auth: {
    acessToken: "",
  },
  userData: null,
};

const userSlice = createSlice({
  name: "systemSlice",
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.auth.acessToken = action.payload;
    },
    setUserData: (state, action: PayloadAction<IUserInfo>) => {
      state.userData = action.payload;
    },
  },
});

export const { setAuthToken, setUserData } = userSlice.actions;

export const getLoggedUserAuthToken = (state: RootState) =>
  state.user.auth.acessToken;

export const getLoggedUserData = (state: RootState) => state.user.userData;

export const { reducer: userReducer } = userSlice;
