import { battery } from "systeminformation";

export default async () => {
	const batteryData = await battery();

	return {
		perc: batteryData.percent,
		state: batteryData.isCharging
			? "charging"
			: batteryData.acConnected
				? "connected"
				: "discharging",
	};
};
