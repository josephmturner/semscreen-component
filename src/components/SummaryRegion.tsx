import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SummaryRegion = ({ type }: { type: string }) => {
  return <SummaryRegionView className={`${type}`} />;
};

SummaryRegion.propTypes = {
  type: PropTypes.string.isRequired,
};

const SummaryRegionView = styled.div`
  &.Facts,
  &.Merits,
  &.People,
  &.Thoughts,
  &.Actions,
  &.Needs,
  &.Feelings,
  &.Topics {
    position: relative;
  }
  &.Facts:before,
  &.Merits:before,
  &.People:before,
  &.Thoughts:before,
  &.Actions:before,
  &.Needs:before,
  &.Feelings:before,
  &.Topics:before {
    content: '';
    background-size: contain;
    background-repeat: no-repeat;
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.33;
    z-index: -1;
  }
  &.Facts:before {
    background-image: url(${require('./../images/Facts.svg')});
    background-position: top left;
  }
  &.Merits:before {
    background-image: url(${require('./../images/Merits.svg')});
    background-position: top center;
  }
  &.People:before {
    background-image: url(${require('./../images/People.svg')});
    background-position: top right;
  }
  &.Thoughts:before {
    background-image: url(${require('./../images/Thoughts.svg')});
    background-position: center left;
  }
  &.Actions:before {
    background-image: url(${require('./../images/Actions.svg')});
    background-position: center right;
  }
  &.Needs:before {
    background-image: url(${require('./../images/Feelings.svg')});
    background-position: bottom left;
  }
  &.Feelings:before {
    background-image: url(${require('./../images/Needs.svg')});
    background-position: bottom center;
  }
  &.Topics:before {
    background-image: url(${require('./../images/Topics.svg')});
    background-position: bottom right;
  }
`;

export default SummaryRegion;
