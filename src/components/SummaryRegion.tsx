/*
  Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/
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
