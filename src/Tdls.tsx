import React from "react";
import styled from "styled-components";
import { TdlsHeader } from "./components/Header";
import { Footer } from "./components/Footer";
import { Dcl } from "./components/Dcl";
import { HubProvider } from "./hub";

const TdlsDiv = styled.div`
  font-family: Consolas, monospace !important;
  margin: 0;
  background: #ffffff;
  color: #000000;
`;

const Tdls: React.FC = () => {
  return (
    <TdlsDiv>
      <TdlsHeader />
      <Dcl />
      <Footer />
    </TdlsDiv>
  );
};

const TdlsProvider: React.FC = () => (
  <HubProvider>
    <Tdls />
  </HubProvider>
);

export default TdlsProvider;
