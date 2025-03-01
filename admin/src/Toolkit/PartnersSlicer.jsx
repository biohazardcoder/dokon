import { createSlice } from "@reduxjs/toolkit";

const PartnerSlicer = createSlice({
  name: "Partner",
  initialState: {
    data: [],
    isAuth: false,
    isPending: false,
    isError: "",
  },
  reducers: {
    getPartnerPending(state) {
      state.isPending = true;
      state.isError = "";
    },
    getPartnerSuccess(state, { payload }) {
      state.isAuth = true;
      state.data = payload;
      state.isPending = false;
    },
    getPartnerError(state, { payload }) {
      state.isPending = false;
      state.isError = payload;
    },
  },
});

export const { getPartnerError, getPartnerPending, getPartnerSuccess } =
  PartnerSlicer.actions;
export default PartnerSlicer.reducer;
