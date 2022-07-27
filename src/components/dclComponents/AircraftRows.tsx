import React from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { dclSelector, setSelectedAircraftId } from "../../redux/slices/dclSlice";

const AircraftRowDiv = styled.div`
  display: inline-flex;
  align-items: center;
  width: -moz-fit-content;
  width: fit-content;
`;
const DclAircraftFlightDiv = styled(AircraftRowDiv)`
  width: 150px;
  &:hover {
    color: #ffffff;
    background-color: #000000;
    cursor: pointer;
  }
`;

type AircraftRowProps = { aircraftId: string };

const DclAircraftStatusDiv = styled.div<{ selected: boolean }>`
  text-align: left;
  padding: 0 8px;
  width: 25px;
  color: ${(props) => !props.selected && "transparent"};
`;

export const DclAircraftRow: React.FC<AircraftRowProps> = ({ aircraftId }) => {
  const { selectedAircraftId } = useAppSelector(dclSelector);
  const dispatch = useAppDispatch();

  return (
    <AircraftRowDiv>
      <DclAircraftStatusDiv selected={selectedAircraftId === aircraftId}>{">"}</DclAircraftStatusDiv>
      <DclAircraftFlightDiv onClick={() => dispatch(setSelectedAircraftId(aircraftId))}>{aircraftId}</DclAircraftFlightDiv>
    </AircraftRowDiv>
  );
};

export const PdcAircraftRow: React.FC<AircraftRowProps> = ({ aircraftId }) => {
  return (
    <AircraftRowDiv>
      <DclAircraftStatusDiv selected={false} />
      {aircraftId}
    </AircraftRowDiv>
  );
};
