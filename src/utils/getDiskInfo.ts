import { fsSize } from "systeminformation";

export default async () => {
	const [diskInfo] = await fsSize("C:");

	return (
		diskInfo && { size: diskInfo.size, used: diskInfo.used, perc: diskInfo.use }
	);
};
