import { env, loadEnvFile } from "node:process";
import getBatteryInfo from "./utils/getBatteryInfo.ts";
import getCPUUsage from "./utils/getCPUUsage.ts";
import getDiskInfo from "./utils/getDiskInfo.ts";
import getGPUUsage from "./utils/getGPUUsage.ts";
import getRamUsage from "./utils/getRamUsage.ts";
import updateWidget from "./utils/updateWidget.ts";

loadEnvFile(".dev.vars");
const [disk, mem, cpu, gpu, battery] = await Promise.all([
	getDiskInfo(),
	getRamUsage(),
	getCPUUsage(),
	getGPUUsage(),
	getBatteryInfo(),
]);

await updateWidget(env, battery, cpu, mem, disk, gpu);
console.log("Profile updated!");
