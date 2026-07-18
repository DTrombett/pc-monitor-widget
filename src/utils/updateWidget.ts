import { RouteBases, type RESTError } from "discord-api-types/v10";
import { uptime } from "node:os";

export default async (
	env: Env,
	battery: { perc: number; state: string },
	cpu: { speed: number; load: number },
	mem: { free: number; total: number },
	disk?: { used: number; size: number; perc: number },
	gpu?: { used: number; temp: number },
) => {
	const dynamic: ({ name: string } & (
		| { type: 1; value: string }
		| { type: 2; value: number }
		| { type: 3; value: { url: string } }
	))[] = [
		{
			type: 1,
			name: "cpu",
			value: `${Math.round(cpu.load)}% ${cpu.speed} GHz`,
		},
		{
			type: 1,
			name: "memory",
			value: `${((mem.total - mem.free) / 1000000000).toFixed(
				1,
			)}/${(mem.total / 1000000000).toFixed(1)} GB (${Math.round(
				100 - (mem.free / mem.total) * 100,
			)}%)`,
		},
		{
			type: 1,
			name: "battery",
			value: `${Math.round(battery.perc)}% (${battery.state})`,
		},
		{
			type: 2,
			name: "uptime",
			value: Math.ceil(uptime()) * 1000,
		},
	];
	if (disk)
		dynamic.push({
			type: 1,
			name: "disk",
			value: `${Math.round(
				disk.used / 1_000_000_000,
			)}/${Math.round(disk.size / 1_000_000_000)} GB (${Math.round(disk.perc)}%)`,
		});
	if (gpu)
		dynamic.push({
			type: 1,
			name: "gpu",
			value: `${Math.round(gpu.used)}% (${Math.round(gpu.temp)} °C)`,
		});
	const res = await fetch(
		`${RouteBases.api}/applications/${env.DISCORD_APPLICATION_ID}/users/${env.DISCORD_USER_ID}/identities/0/profile`,
		{
			method: "PATCH",
			body: JSON.stringify({
				data: { dynamic },
			} satisfies {
				data: {
					username?: string;
					dynamic?: ({ name: string } & (
						| { type: 1; value: string }
						| { type: 2; value: number }
						| { type: 3; value: { url: string } }
					))[];
				};
			}),
			headers: {
				authorization: `Bot ${env.DISCORD_TOKEN}`,
				"content-type": "application/json",
			},
		},
	);

	if (res.ok) return;
	throw new Error(
		res.headers.get("Content-Type")?.startsWith("application/json")
			? ((await res.json()) as RESTError).message
			: await res.text(),
	);
};
