import React from "react";
import styled from "styled-components";
import { mediumGreen, lightGreen, brightGreen, darkGreen, lighterGreen, darkMediumGreen } from "../styles/colors";
import { ArrowLeft, ArrowRight } from "./arrows/Arrows";
import { CpdlcAircraftList, DclAircraftList } from "./dclComponents/AircraftLists";
import { DclEdit } from "./dclComponents/DclEdit";
import { useAppSelector } from "../redux/hooks";
import { dclSelector } from "../redux/slices/dclSlice";

// TODO: fix text center for header
const DclDiv = styled.div`
  height: calc(100vh - 54px);
  font-family: "VRC", monospace;
  background-color: #ffffff;
`;
const DclHeaderDiv = styled.div`
  height: 26px;
  font-family: "RobotoMono", sans-serif;
  background-color: ${mediumGreen};
  border-top: 2px solid ${lightGreen};
  border-bottom: 2px solid ${darkGreen};
  text-align: center;
  position: relative;
  font-weight: bolder;
  font-size: 16px;
`;

const ClearedDiv = styled.div`
  display: flex;
  height: calc(100% - 202px);
`;

const CpdlcListDiv = styled.div`
  width: 100%;
  height: 100%;
`;

const ClearedHeaderDiv = styled(DclHeaderDiv)`
  background-color: ${brightGreen};
  border-top: 2px solid ${lighterGreen};
  border-bottom: 2px solid ${darkMediumGreen};
  font-weight: normal;
  margin: 2px;
`;

const DclHeader = () => (
  <DclHeaderDiv>
    <ArrowLeft />
    DCL
    <ArrowRight />
  </DclHeaderDiv>
);

const CpdlcHeader = () => (
  <ClearedHeaderDiv>
    <ArrowLeft />
    CPDLC
    <ArrowRight />
  </ClearedHeaderDiv>
);

type DclProps = Record<string, unknown>;

export const Dcl: React.FC<DclProps> = () => {
  const { selectedAircraftId } = useAppSelector(dclSelector);

  return (
    <DclDiv>
      <DclHeader />
      <DclAircraftList />
      <ClearedDiv>
        <CpdlcListDiv>
          <CpdlcHeader />
          <CpdlcAircraftList />
        </CpdlcListDiv>
      </ClearedDiv>
      {selectedAircraftId && <DclEdit />}
    </DclDiv>
  );
};
