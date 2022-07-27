import React, { createContext, useContext, useEffect, useRef } from "react";
import { HttpTransportType, HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { ApiFlightplan } from "./types/apiFlightplan";

const ATC_SERVER_URL = process.env.REACT_APP_ATC_SERVER_URL;

const useHubInit = () => {
  const ref = useRef<{ hubConnection: HubConnection | null }>({ hubConnection: null });

  /* eslint-disable no-console */

  useEffect(() => {
    if (!ATC_SERVER_URL) {
      return;
    }
    const hubConnection = new HubConnectionBuilder()
      .withUrl(ATC_SERVER_URL, {
        transport: HttpTransportType.WebSockets,
        skipNegotiation: true,
      })
      .withAutomaticReconnect()
      .build();

    async function start() {
      hubConnection.on("receiveFlightplan", (flightplan: ApiFlightplan) => {
        console.log("Received Flightplan:", flightplan);
      });

      await hubConnection
        .start()
        .then(() => {
          console.log("Connected to ATC server");
        })
        .catch((e) => {
          console.error("Error starting connection: ", e);
        });
    }

    hubConnection.keepAliveIntervalInMilliseconds = 1000;
    ref.current.hubConnection = hubConnection;

    start().then();
  }, []);

  /* eslint-enable no-console */

  return ref.current.hubConnection;
};

type HubContextValue = ReturnType<typeof useHubInit>;

const HubContext = createContext<HubContextValue>(null);

export const HubProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const hub = useHubInit();

  return <HubContext.Provider value={hub}>{children}</HubContext.Provider>;
};

export const useHub = () => {
  return useContext(HubContext);
};
