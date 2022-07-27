import React from "react";
import styled from "styled-components";
import { lightGrey } from "../../styles/colors";
import { DclAircraftRow, PdcAircraftRow } from "./AircraftRows";
import { useAppSelector } from "../../redux/hooks";
import { dclSelector } from "../../redux/slices/dclSlice";

const AircraftListDiv = styled.div`
  font-size: 11pt;
  margin: 2px 2px;
  border: 2px solid ${lightGrey};
  display: flex;
  flex-flow: column wrap;
  align-content: flex-start;
  overflow-x: auto;
  height: 135px;
`;

const ClearedAircraftListDiv = styled(AircraftListDiv)`
  height: 100%;
`;

export const DclAircraftList: React.FC = () => {
  const { flightPlans } = useAppSelector(dclSelector);
  return (
    <AircraftListDiv>
      {flightPlans.map((f) => !f.cleared && <DclAircraftRow key={`dcl-flight-list-${f.aircraftId}`} aircraftId={f.aircraftId} />)}
    </AircraftListDiv>
  );
};

export const PdcAircraftList: React.FC = () => {
  const { flightPlans } = useAppSelector(dclSelector);
  return (
    <ClearedAircraftListDiv>
      {flightPlans.map((f) => f.cleared && <PdcAircraftRow key={`pdc-flight-list-${f.aircraftId}`} aircraftId={f.aircraftId} />)}
    </ClearedAircraftListDiv>
  );
};

export const CpdlcAircraftList: React.FC = () => {
  return <ClearedAircraftListDiv />;
};
