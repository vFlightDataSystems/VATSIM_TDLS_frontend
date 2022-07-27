import { ApiFlightplan } from "./apiFlightplan";

export type Flightplan = ApiFlightplan & { cleared: boolean };
