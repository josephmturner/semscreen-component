/*
  Copyright (C) 2021 by USHIN, Inc.

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
//TODO: Fix types of ref props
export const useTextareaIndent = (parentRef: any, bannerRef?: any) => {
  //TODO: Add a callback inside useTextarea to improve performance
  let textareaIndent, textareaNewline;

  if (bannerRef.current) {
    //Indent the first line of the textarea by the width of the
    //banner + a little more than the width of the shape icon (32px)
    const bannerWidth = bannerRef.current.getBoundingClientRect().width;
    textareaIndent = `${32 + bannerWidth}px`;

    //If there isn't much space for the point's content to the right
    //of the banner, display the point content on the next line
    const parentWidth = parentRef.current.getBoundingClientRect().width;
    if (parentWidth - bannerWidth < 150) {
      textareaIndent = "0";
      textareaNewline = true;
    }
  }
  return { textareaIndent, textareaNewline };
};
