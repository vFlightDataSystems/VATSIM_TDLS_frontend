import React, { useEffect, useState } from "react";
import styled from "styled-components";

const ClockSpan = styled.span`
  font-family: "RobotoMono", sans-serif;
  padding: 0 10px 0 25px;
`;

const zeroPad = (n: number) => String(n).padStart(2, "0");

export default function Clock() {
  const [dateState, setDateState] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDateState(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ClockSpan>
      {zeroPad(dateState.getUTCHours())}:{zeroPad(dateState.getUTCMinutes())}
    </ClockSpan>
  );
}
