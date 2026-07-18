import { cpuCurrentSpeed, currentLoad } from "systeminformation";

export default async () => {
	const [speed, load] = await Promise.all([cpuCurrentSpeed(), currentLoad()]);

	return { speed: speed.avg, load: load.currentLoad };
};
