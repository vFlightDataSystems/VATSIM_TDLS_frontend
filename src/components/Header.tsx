import React from "react";
import styled from "styled-components";
import { lightGreen, brightGreen } from "../styles/colors";
import { useAppSelector } from "../redux/hooks";
import { dclSelector } from "../redux/slices/dclSlice";

const fdioColor = "#1111EE";
const dclColor = "#000000";
const datisColor = "#C311C3";

const TdlsHeaderDiv = styled.div`
  width: 100%;
  background-color: #000000;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const LeftHeaderDiv = styled.div`
  width: -moz-fit-content;
  width: fit-content;
  justify-content: left;
  background-color: #d3d3d3;
  border: 3px solid #adadad;
  box-shadow: inset 1px 1px 3px #000;
  padding: 0 8px;
  display: flex;
  align-items: center;
`;

const LeftHeaderLeftButton = styled.button<{ selected?: boolean }>`
  font-family: "CourierPrime", sans-serif;
  padding: 0;
  font-size: 14pt;
  background-color: ${lightGreen};
  margin: 3px 6px;
  white-space: nowrap;
  color: #000000;
  pointer-events: none;
  font-weight: bold;
  min-width: 50px;
  height: 25px;

  ${(props) => props.selected && { border: "3px solid #000000" }}
`;

const PaddedLeftHeaderButton = styled(LeftHeaderLeftButton)`
  padding: 0 10px;
`;

const RightHeaderDiv = styled.div`
  background-color: #ffffff;
  border: 3px solid ${brightGreen};
  display: flex;
  flex-wrap: nowrap;
  padding: 0 8px;
`;

const DRightHeaderButton = styled.div<{ color: string; disabled: boolean }>`
  background-color: #ffffff;
  display: inline-flex;
  white-space: nowrap;
  margin: 0 12px;
  padding: 1px 3px;
  cursor: pointer;
  border: 3px solid ${(props) => props.color};
  ${(props) => props.disabled && { "pointer-events": "none" }}
`;

const RightHeaderButtonLabel = styled.div<{ color: string }>`
  //font-weight: bold;
  font-family: "CourierPrime", serif;
  font-size: 16pt;
  font-weight: bold;
  text-align: center;
  width: 80px;
  height: 25px;
  margin-left: 8px;
  margin-right: 4px;
  border: 3px solid ${(props) => props.color};
  color: ${(props) => props.color};
`;
const RightHeaderButtonIndicator = styled.div<{ color: string; active: boolean }>`
  width: 20px;
  height: 25px;
  margin-left: 10px;
  border: 3px solid ${(props) => props.color};
  ${(props) => props.active && { "background-color": props.color }};
`;

type ButtonProps = { active: boolean; disabled: boolean };

const RightHeaderButton: React.FC<{ content: string; color: string; disabled: boolean } & ButtonProps> = ({ content, color, active, disabled }) => (
  <DRightHeaderButton color={color} disabled={disabled}>
    <RightHeaderButtonLabel color={color}>{content}</RightHeaderButtonLabel>
    <RightHeaderButtonIndicator color={color} active={active} />
  </DRightHeaderButton>
);

const FdioButton: React.FC<ButtonProps> = ({ active, disabled }) => (
  <RightHeaderButton content="FDIO" color={fdioColor} active={active} disabled={disabled} />
);

const DclButton: React.FC<ButtonProps> = ({ active, disabled }) => (
  <RightHeaderButton content="DCL" color={dclColor} active={active} disabled={disabled} />
);

const DatisButton: React.FC<ButtonProps> = ({ active, disabled }) => (
  <RightHeaderButton content="D-ATIS" color={datisColor} active={active} disabled={disabled} />
);

export const TdlsHeader: React.FC = () => {
  const dcl = useAppSelector(dclSelector);

  return (
    <TdlsHeaderDiv>
      <LeftHeaderDiv>
        <LeftHeaderLeftButton selected>{dcl.facilityId && `${dcl.facilityId.toLowerCase()}a`}</LeftHeaderLeftButton>
        <LeftHeaderLeftButton>{dcl.facilityId && `${dcl.facilityId.toLowerCase()}b`}</LeftHeaderLeftButton>
        <PaddedLeftHeaderButton>TIMS</PaddedLeftHeaderButton>
        <PaddedLeftHeaderButton>ERAM</PaddedLeftHeaderButton>
        <PaddedLeftHeaderButton>CPDLC</PaddedLeftHeaderButton>
      </LeftHeaderDiv>
      <RightHeaderDiv>
        <FdioButton active disabled />
        <DclButton active={false} disabled />
        <DatisButton active disabled />
      </RightHeaderDiv>
    </TdlsHeaderDiv>
  );
};
