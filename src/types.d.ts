type Env = {
	DISCORD_USER_ID: string;
	DISCORD_APPLICATION_ID: string;
	DISCORD_TOKEN: string;
};

namespace NodeJS {
	interface Process {
		env: Env;
	}
}
