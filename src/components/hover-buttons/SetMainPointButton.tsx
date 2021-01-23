/*
  Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/
import React from "react";
import { Button } from "./Button";

interface Props {
  handleClick: (e: React.MouseEvent) => void;
  darkMode?: boolean;
  isSelected?: boolean;
}

export const SetMainPointButton = (props: Props) => (
  <Button
    onClick={props.handleClick}
    darkMode={props.darkMode}
    isSelected={props.isSelected}
    viewBox="0 0 16 16"
  >
    <title>"Set main point"</title>
    <path d="M 7.5737257,1.6940213 C 7.4525792,1.7167874 7.3453254,1.7737198 7.2521431,1.8647272 7.1775906,1.9330038 7.1170682,2.0240375 7.0704793,2.1377997 7.0332008,2.240209 7.0098348,2.3425156 7.0005199,2.4449011 l 0.3356075,6.3315737 c 0.037271,0.34133 0.1909275,0.5687717 0.4611717,0.6825407 0.046589,0.02275 0.1118164,0.03431 0.1956886,0.03431 l 0.2097135,-0.03431 C 8.2958824,9.4135105 8.37977,9.3510785 8.4543242,9.2714363 8.5754609,9.1349078 8.6453945,8.9698959 8.6640378,8.7764748 8.6640319,8.7423525 8.7198476,7.6956003 8.8316766,5.6362795 L 8.9994805,2.4449011 C 8.9901554,2.3425156 8.9667893,2.240209 8.9295209,2.1377997 8.8642848,1.9671503 8.7617367,1.8420147 8.6219633,1.7623598 8.5287718,1.716862 8.3285466,1.6940343 8.0210375,1.6940213 Z m 0.4473118,10.2909877 -0.4753616,0.01687 c -0.1304652,0.03414 -0.2422607,0.108127 -0.3354425,0.221891 -0.083872,0.09102 -0.1396871,0.187832 -0.1676388,0.290226 -0.02796,0.102395 -0.042078,0.312792 -0.042075,0.631357 -3.7e-6,0.318565 0.014114,0.529246 0.042075,0.631638 0.027952,0.09103 0.083767,0.187545 0.1676388,0.289947 0.074545,0.09102 0.1537267,0.153727 0.2375982,0.187861 0.018632,0.01136 0.037293,0.01687 0.055934,0.01687 l 0.531131,0.03431 c 0.2981906,0 0.4938745,-0.02861 0.587066,-0.08549 0.1397734,-0.07964 0.2423215,-0.204777 0.3075576,-0.375439 0.046587,-0.113778 0.069954,-0.346995 0.06996,-0.699695 -5.9e-6,-0.352698 -0.023373,-0.585915 -0.06996,-0.699693 -0.065236,-0.170655 -0.1677842,-0.295797 -0.3075576,-0.375439 -0.093191,-0.05689 -0.2934167,-0.08521 -0.6009258,-0.08521 z" />
  </Button>
);
