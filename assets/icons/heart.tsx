import React from "react";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

export default function HeartIcon() {
	return (
		<Svg width="16" height="15" viewBox="0 0 16 15" fill="none">
			<Path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M8.00016 2.23204C7.22104 1.06965 6.09185 0.333252 4.66683 0.333252C1.85666 0.333252 0.333496 2.7507 0.333496 4.99992C0.333496 7.5099 1.72407 9.56766 3.22476 11.063C4.41072 12.2446 5.79338 13.2279 7.2584 14.0329C7.37887 14.0991 7.53496 14.1849 7.73546 14.2255C7.90044 14.2589 8.09987 14.2589 8.26485 14.2255C8.46535 14.1849 8.62145 14.0991 8.74192 14.0329C10.207 13.2279 11.5896 12.2446 12.7756 11.063C14.2763 9.56766 15.6668 7.5099 15.6668 4.99992C15.6668 2.7507 14.1437 0.333252 11.3335 0.333252C9.90848 0.333252 8.77928 1.06965 8.00016 2.23204Z"
				fill="url(#paint0_linear_706_5439)"
			/>
			<Defs>
				<LinearGradient
					id="paint0_linear_706_5439"
					x1="8.00037"
					y1="14.2508"
					x2="8.00037"
					y2="0.333436"
					gradientUnits="userSpaceOnUse"
				>
					<Stop stop-color="#DB0100" />
					<Stop offset="0.5836" stop-color="#F31317" />
					<Stop offset="1" stop-color="#FF1C23" />
				</LinearGradient>
			</Defs>
		</Svg>
	);
}
