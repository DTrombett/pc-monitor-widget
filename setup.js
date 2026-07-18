let wpRequire = webpackChunkdiscord_developers.push([[Symbol()], {}, (r) => r]);
webpackChunkdiscord_developers.pop();
let UserStore = Object.values(wpRequire.c).find(
	(x) => x?.exports?.A?.__proto__?.getCurrentUser,
).exports.A;
let FluxDispatcher = Object.values(wpRequire.c).find(
	(x) => x?.exports?.A?.__proto__?.flushWaitQueue,
).exports.A;
let api = Object.values(wpRequire.c).find((x) => x?.exports?.Bo?.get).exports
	.Bo;
const userId = UserStore.getCurrentUser().id;

console.log(
	"[Widget Creator] Creating a new app... Please solve the captcha if prompted",
);
const appRes = await api.post({
	url: "/applications",
	body: { name: "PC Monitor", team_id: null },
});
FluxDispatcher.dispatch({
	type: "APPLICATION_CREATE_SUCCESS",
	application: appRes.body,
});
const appId = appRes.body.id;

console.log("[Widget Creator] Enabling social sdk...");
await api.post({
	url: `/applications/${appId}/social-sdk/enable`,
	body: {
		name: "a",
		business_email: "foo@bar.com",
		game_or_studio_name: "a",
		game_or_studio_url: "",
		email_updates_consent: false,
		country_or_region: "United States",
		title_role: "Founder",
		target_platforms: [],
		form_type: "Dev Solutions",
		sfdc_leadsource: "Dev Portal",
		utm_campaign: "SDK Enable Form",
	},
});

console.log("[Widget Creator] Creating a new widget...");
const configRes = await api.post({
	url: `/applications/${appId}/widget-configs`,
	body: { display_name: "PC Monitor" },
});
const configId = configRes.body.config_id;

console.log("[Widget Creator] Uploading required assets...");
for (const asset of (
	await api.get({
		url: `/applications/1526537433821352067/assets`,
	})
).body) {
	if (asset.visibility !== "public") continue;
	const assetRes = await fetch(
		`https://cdn.discordapp.com/app-assets/1526537433821352067/${asset.asset_id}.png?size=4096`,
	);
	const uploadRes = await api.post({
		url: `/applications/${appId}/assets/upload`,
		body: {
			filename: `${asset.asset_id}.png`,
			file_size: Number(assetRes.headers.get("Content-Length")),
		},
	});
	await fetch(uploadRes.body.upload_url, {
		method: "PUT",
		body: assetRes.body,
		headers: {
			"content-length": assetRes.headers.get("Content-Length") ?? "",
			"content-type":
				assetRes.headers.get("Content-Type") ?? "application/octet-stream",
		},
		duplex: "half",
	});
	await api.post({
		url: `/applications/${appId}/assets`,
		body: {
			key: asset.key,
			upload_filename: uploadRes.body.upload_filename,
			visibility: "public",
		},
	});
}

console.log("[Widget Creator] Updating widget config and publishing...");
await api.patch({
	url: `/applications/${appId}/widget-configs/${configId}`,
	body: {
		surfaces: {
			widget_bottom: {
				layout: "widget_bottom_stats",
				components: {
					stat_5: {
						fields: {
							value: {
								value_type: "data",
								presentation_type: "text",
								value: "battery",
							},
							label: {
								value_type: "custom_string",
								presentation_type: "text",
								value: "Battery",
							},
						},
					},
					stat_1: {
						fields: {
							value: {
								value_type: "data",
								presentation_type: "text",
								value: "cpu",
							},
							label: {
								value_type: "custom_string",
								presentation_type: "text",
								value: "CPU",
							},
						},
					},
					stat_3: {
						fields: {
							value: {
								value_type: "data",
								presentation_type: "text",
								value: "disk",
							},
							label: {
								value_type: "custom_string",
								presentation_type: "text",
								value: "Disk 0 (C:)",
							},
						},
					},
					stat_2: {
						fields: {
							value: {
								value_type: "data",
								presentation_type: "text",
								value: "memory",
							},
							label: {
								value_type: "custom_string",
								presentation_type: "text",
								value: "Memory",
							},
						},
					},
					stat_4: {
						fields: {
							value: {
								value_type: "data",
								presentation_type: "text",
								value: "gpu",
							},
							label: {
								value_type: "custom_string",
								presentation_type: "text",
								value: "GPU — NVIDIA GeForce MX350",
							},
						},
					},
					stat_6: {
						fields: {
							value: {
								value_type: "data",
								presentation_type: "duration",
								value: "uptime",
							},
							label: {
								value_type: "custom_string",
								presentation_type: "text",
								value: "Uptime",
							},
						},
					},
				},
			},
			add_widget_preview: {
				layout: "add_widget_preview_contained",
				components: {
					contained_image: {
						fields: {
							image: {
								value_type: "application_asset",
								presentation_type: "image",
								value: "1784027857773",
							},
						},
					},
				},
			},
			widget_top: {
				layout: "widget_top_contained",
				components: {
					subtitle_2: {
						fields: {
							text: {
								value_type: "custom_string",
								presentation_type: "text",
								value: "16.0 GB DDR4",
							},
							label: {
								value_type: "custom_string",
								presentation_type: "text",
								value: "Memory",
							},
						},
					},
					title: {
						fields: {
							text: {
								value_type: "custom_string",
								presentation_type: "text",
								value: "Acer Aspire A515-56G",
							},
						},
					},
					subtitle_1: {
						fields: {
							text: {
								value_type: "custom_string",
								presentation_type: "text",
								value: "Intel® Core™ i7-1165G7",
							},
							label: {
								value_type: "custom_string",
								presentation_type: "text",
								value: "CPU",
							},
						},
					},
					subtitle_3: {
						fields: {
							text: {
								value_type: "custom_string",
								presentation_type: "text",
								value: "1.00 TB SSD",
							},
							label: {
								value_type: "custom_string",
								presentation_type: "text",
								value: "Disk",
							},
						},
					},
					contained_image: {
						fields: {
							image: {
								value_type: "application_asset",
								presentation_type: "image",
								value: "1784027857773",
							},
						},
					},
				},
			},
		},
	},
});
await api.post({
	url: `/applications/${appId}/widget-configs/${configId}/publish`,
});

console.log("[Widget Creator] Adding the widget to profile...");
await api.patch({
	url: `/applications/${appId}`,
	body: { redirect_uris: ["http://127.0.0.1/callback"] },
});
await api.post({
	url: `/oauth2/authorize?client_id=${appId}&response_type=token&scope=sdk.social_layer_presence`,
	body: { authorize: true },
});
const profileRes = await api.get({ url: `/users/${userId}/profile` });
const existingWidgets = profileRes.body.widgets;
existingWidgets.unshift({
	data: { type: "application", application_id: appId },
});
await api.put({
	url: `/users/@me/widgets`,
	body: { widgets: existingWidgets },
});
console.log("[Widget Creator] Widget successfully added");
