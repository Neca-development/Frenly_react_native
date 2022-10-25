import React from "react";
import { View, Text } from "react-native";

import Svg, { Path, Rect, Defs, G, ClipPath } from "react-native-svg";

export default function ArrowBack() {
  return (
    <Svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G clipPath="url(#clip0_662_6192)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.2071 3.29289C16.5976 3.68342 16.5976 4.31658 16.2071 4.70711L8.41421 12.5L16.2071 20.2929C16.5976 20.6834 16.5976 21.3166 16.2071 21.7071C15.8166 22.0976 15.1834 22.0976 14.7929 21.7071L6.29289 13.2071C5.90237 12.8166 5.90237 12.1834 6.29289 11.7929L14.7929 3.29289C15.1834 2.90237 15.8166 2.90237 16.2071 3.29289Z"
          fill="#71747A"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_662_6192">
          <Rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0 0.5)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
