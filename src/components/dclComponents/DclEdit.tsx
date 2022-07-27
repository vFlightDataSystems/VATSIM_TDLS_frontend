import React from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { dclSelector, setSelectedAircraftId } from "../../redux/slices/dclSlice";
import { convertAltitudeToFlightLevel } from "../../utils/helpers";

const DclEditDiv = styled.div`
  font-family: "Consolas", monospace;
  position: fixed;
  height: 300px;
  width: calc(100vw - 75px);
  bottom: 20px;
  left: 50%;
  background-color: #ffffff;
  border: 1px solid;
  border-color: #000000 #000000 #ffffff;
  //-webkit-transform: translate(-50%);
  transform: translate(-50%);
  padding: 20px 5px;
  z-index: 10;
`;
const DclEditRowDiv = styled.div`
  min-height: 20px;
  position: relative;
  margin-bottom: 5px;

  > div {
    display: inline-block;
  }
`;
const FloatRightDiv = styled.div`
  float: right;
`;
const JustifySpaceBetweenDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const DclEditCol1 = styled.div`
  width: 15%;
`;
const DclEditCol2 = styled.div`
  margin: 0 10px;
`;
const DclEditCol3 = styled.div`
  float: right;
  width: 15%;
`;
const DclEditCol4 = styled.div`
  float: right;
  width: 40%;
`;
const DclEditCol5 = styled.div`
  width: calc(85% - 10px);
  margin-left: 10px;
`;
const DclSelect = styled.select`
  display: inline-flex;
  vertical-align: top;
  border: 1px solid #767676;
  height: 24px;
  background-color: #ffffff;
  font-family: "VRC";
  border-radius: 4px !important;
`;
const DclSelectSid = styled(DclSelect)`
  margin-right: 5px;
  flex-grow: 1;
`;
const DclSelectTransition = styled(DclSelect)`
  margin-left: 5px;
  flex-grow: 1;
`;
const DclSelectExpect = styled(DclSelect)`
  width: 200px;
`;
const DclSelectClimbout = styled(DclSelect)`
  flex-grow: 3;
  margin-right: 5px;
`;
const DclSelectClimbvia = styled(DclSelect)`
  flex-grow: 3;
  margin-right: 5px;
  margin-left: 5px;
`;
const DclSelectInitialAlt = styled(DclSelect)`
  flex-grow: 1;
  margin-left: 5px;
`;
const DclSelectInfo = styled(DclSelect)`
  width: 25%;
`;
const DclSelectDepFreq = styled(DclSelect)`
  margin-left: 10px;
  width: 150px;
`;
const DclEditFooter = styled.div`
  position: absolute;
  bottom: 0;
  margin-bottom: 5px;
  width: calc(100% - 15px);
`;

const Button = styled.button`
  border: 1px solid #767676;
  display: inline-flex;
  margin-left: 10px;
  float: right;
  bottom: 0;
  padding: 2px 25px 2px 25px;
  background-color: white;
  border-radius: 4px;

  :hover:not(:disabled) {
    cursor: pointer;
  }

  :active:not(:disabled) {
    background-color: lightgrey;
  }
`;

type DclEditProps = Record<string, unknown>;

export const DclEdit: React.FC<DclEditProps> = () => {
  const dcl = useAppSelector(dclSelector);
  const flightPlan = dcl.flightPlans.find((f) => f.aircraftId === dcl.selectedAircraftId)!;
  const dispatch = useAppDispatch();

  return (
    <DclEditDiv>
      <DclEditRowDiv>
        <DclEditCol1>
          {flightPlan.aircraftId}
          <FloatRightDiv>{flightPlan.assignedBeaconCode}</FloatRightDiv>
        </DclEditCol1>
        <DclEditCol2>
          {flightPlan.departure} {flightPlan.route} {flightPlan.destination}
        </DclEditCol2>
        <DclEditCol3 />
      </DclEditRowDiv>
      <DclEditRowDiv />
      <DclEditRowDiv>
        <DclEditCol1>
          {flightPlan.equipment}
          <FloatRightDiv>P{flightPlan.estimatedDepartureTime}</FloatRightDiv>
        </DclEditCol1>
        <DclEditCol4>RMK: {flightPlan.remarks}</DclEditCol4>
      </DclEditRowDiv>
      <DclEditRowDiv>
        <DclEditCol1>
          {flightPlan.cid}
          <FloatRightDiv>{convertAltitudeToFlightLevel(flightPlan.altitude)}</FloatRightDiv>
        </DclEditCol1>
        <DclEditCol2>
          <DclSelectExpect>
            <option value="-1">- - - -</option>
          </DclSelectExpect>
        </DclEditCol2>
      </DclEditRowDiv>
      <DclEditRowDiv>
        <DclEditCol1>
          <JustifySpaceBetweenDiv>
            <DclSelectSid>
              <option value="-1">- - - -</option>
            </DclSelectSid>
            <DclSelectTransition>
              <option value="-1">- - - -</option>
            </DclSelectTransition>
          </JustifySpaceBetweenDiv>
        </DclEditCol1>
        <DclEditCol5>
          <JustifySpaceBetweenDiv>
            <DclSelectClimbout>
              <option value="-1">- - - -</option>
            </DclSelectClimbout>
            <DclSelectClimbvia>
              <option value="-1">- - - -</option>
            </DclSelectClimbvia>
            <DclSelectInitialAlt>
              <option value="-1">- - - -</option>
            </DclSelectInitialAlt>
          </JustifySpaceBetweenDiv>
        </DclEditCol5>
      </DclEditRowDiv>
      <DclEditRowDiv>
        <DclSelectInfo>
          <option value="-1">- - - -</option>
        </DclSelectInfo>
        <FloatRightDiv>
          DEP FREQ
          <DclSelectDepFreq>
            <option value="-1">- - - -</option>
          </DclSelectDepFreq>
        </FloatRightDiv>
      </DclEditRowDiv>
      <DclEditRowDiv>
        <DclSelectInfo>
          <option value="-1">- - - -</option>
        </DclSelectInfo>
      </DclEditRowDiv>
      <DclEditFooter>
        <Button disabled>Send</Button>
        <Button onClick={() => dispatch(setSelectedAircraftId(null))}>Cancel</Button>
      </DclEditFooter>
    </DclEditDiv>
  );
};
