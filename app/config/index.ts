const isProduction = true; // Change this to true for production

const Config = {
	REACT_NATIVE_SERVER_API_FULL_URL: isProduction
		? 'https://api.jikan.moe/v4'
		: 'http://localhost:3000/api',

	REACT_NATIVE_SERVER_API_KEY: '', // any ApiKey Here!
};

const getFullApiUrl = (endpoint: string | undefined): string | undefined => {
	if (endpoint && endpoint.length > 0) {
		return Config.REACT_NATIVE_SERVER_API_FULL_URL + endpoint;
	}
};

export { Config, getFullApiUrl };