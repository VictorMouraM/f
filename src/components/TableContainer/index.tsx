'use client'
import { ReactNode } from "react";
import { Container } from "./styles"

interface TableContainerprops {
  children: ReactNode;
}

const TableContainer = ({children}: TableContainerprops) => {
  return (
    <Container>
      {children}
    </Container>
  );
};

export default TableContainer;

