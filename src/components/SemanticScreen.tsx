import React from "react";
import styled from "styled-components";
import SummaryRegion from "./SummaryRegion";
import Rim from "./Rim";
import { MessageI } from '../interfaces';

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100#;
  z-index: 999;
  display: grid;
  grid-template-columns: 2rem auto 2rem;
  grid-template-rows: 2rem auto 2rem;
`;

const SemanticScreen = (props: { message : MessageI }) => (
  <Wrapper>
    <SummaryRegion type="Facts" />
    <SummaryRegion type="Merits" />
    <SummaryRegion type="People" />
    <SummaryRegion type="Thoughts" />
    <Rim message={props.message} />
    <SummaryRegion type="Actions" />
    <SummaryRegion type="Needs" />
    <SummaryRegion type="Feelings" />
    <SummaryRegion type="Topics" />
  </Wrapper>
);

export default SemanticScreen;
