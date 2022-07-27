import styled from "styled-components";
import { mediumGray } from "../../styles/colors";

const ArrowDiv = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
`;
export const ArrowLeft = styled(ArrowDiv)`
  border-right: 18px solid ${mediumGray};
`;
export const ArrowRight = styled(ArrowDiv)`
  right: 0;
  top: 0;
  border-left: 18px solid ${mediumGray};
`;
