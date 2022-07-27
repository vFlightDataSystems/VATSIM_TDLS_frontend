import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AircraftId } from "../../types/aircraftId";
import { Flightplan } from "../../types/flightplan";

const initialState: DclState = {
  selectedAircraftId: null,
  facilityId: "",
  flightPlans: [],
};

interface DclState {
  selectedAircraftId: AircraftId | null;
  facilityId: string;
  flightPlans: Flightplan[];
}

export const dclSlice = createSlice({
  name: "dcl",
  initialState,
  reducers: {
    setSelectedAircraftId(state, action: { payload: string | null }) {
      state.selectedAircraftId = action.payload;
    },
    addFlightplan(state, action: { payload: Flightplan }) {
      const index = state.flightPlans.findIndex((f) => f.aircraftId === action.payload.aircraftId);
      if (index !== -1) {
        state.flightPlans[index] = action.payload;
      } else {
        state.flightPlans.push(action.payload);
      }
    },
  },
});

export const { addFlightplan, setSelectedAircraftId } = dclSlice.actions;
export const dclSelector = (state: RootState) => state.dcl;

export default dclSlice.reducer;
