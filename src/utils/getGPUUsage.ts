import { graphics } from "systeminformation";

export default async () => {
	const { controllers } = await graphics();
	const gpu = controllers.find(
		(
			g,
		): g is typeof g &
			Required<
				Pick<typeof g, "memoryFree" | "memoryTotal" | "temperatureGpu">
			> =>
			g.memoryFree != null && g.memoryTotal != null && g.temperatureGpu != null,
	);

	return (
		gpu && {
			used: (1 - gpu.memoryFree / gpu.memoryTotal) * 100,
			temp: gpu.temperatureGpu,
		}
	);
};
