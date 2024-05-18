'use client'
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  margin-bottom: 20px;

  span {
    font-size: 16px;
    width: 150px;

    &:nth-child(2) {
      width: 300px;
      @media (max-width: 1000px) {
        display: none;
      }
      @media (max-width: 768px) {
        width: 80px;
      }
    }
    &:nth-child(3) {
      @media (max-width: 540px) {
        display: none;
      }
    }
    &:nth-child(4) {
      @media (max-width: 540px) {
        display: none;
      }
    }

    @media (max-width: 1167px) {
    width: 110px;
    }
    @media (max-width: 768px) {
      font-size: 12px;
      width: 80px;
    }
  }

  img {
    cursor: pointer;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  padding-right: 8px;

  @media (max-width: 540px) {
    width: 50%;
    justify-content: flex-end;
  }
`;