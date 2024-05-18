'use client'
import styled from "styled-components";

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.black1};
  padding: 27px;
  border-radius: 8px;

  @media (max-width: 1240px) {
    margin-left: 60px;
  }
  @media (max-width: 800px) {
    margin-left: 0px;
  }
`;