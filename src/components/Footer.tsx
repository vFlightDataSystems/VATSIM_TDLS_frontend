import React from "react";
import styled from "styled-components";
import Clock from "./Clock";

const FooterDiv = styled.div`
  position: fixed;
  display: flex;
  flex-direction: row-reverse;
  font-family: "RobotoMono", sans-serif;
  bottom: 0;
  font-size: 12px;
  width: 100vw;
  height: 20px;
  background-color: #ffffff;
`;

export const Footer: React.FC = () => {
  return (
    <FooterDiv>
      <Clock />
    </FooterDiv>
  );
};
