/*
 * Token Generator module
 * Copyright (c) Nexmo Inc. 2017
 */

const jwt = require("jsonwebtoken");

const generateMaxToken = (params) => {
	const appsMap = {
		"max": "ab618bb4-ac6a-46f9-b94d-54843e830609",
	}

	const apps = {
			"ab618bb4-ac6a-46f9-b94d-54843e830609": {
			private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCaAyG2we4uREkH\nQCHPRIvmNBh97vxRflcjBqY4i7FFMnAzdD5BhBF8YcA+neA5dYBG5fDB2c0WQjW+\nnu1ifJQun6FznXNfJVHopwxeLTGt9oqAQYbO1EmityiOBFwRPubatS38Kl0JB4KR\nwoKPju60wwGu/qAz13Ot87sfF7J+aw0ieFDMTH2Dr/1wQfH2sJGTo+UCas25Nyze\nc5bRM/ph3VpTGVRFflX8grcwb2NHB9vUHVNsCAKJkYFVusD7m3p+2e08A4wDDrZi\n9S9dpZ6REn8/1XPpO6WGKO3zu+y5eYlz8qt2U4dlaCCudBdSdGhlAcXOvrjx+M57\nia7t13AhAgMBAAECggEABpbjtmINwsUBKuI/kBKquaq48YpsGUCCkekS65BugTtr\nOYhbsYnpBZ1ZEFTI5yxz1JS5/FFJSQ6EJie+mFwkKuqBieTOrt915bJgAReF7J+D\nxYEIN4k1rVSQ06K0HbjHP8xIr2VQnbZIi9v6ohHHfMxrIgWa7RzmwiaPdwEYjfgN\nlbc16/kHMYakgso18tblEKQIYQroZ6uhtJto8J1ngwa3GHaX6Gj+EUoDH+dnFmZ0\nYfHOzrs8ob+qs2FKmPWC3/jHV7JQNkwOh37icrvhuoDocfTQsxYbncwzRr2aU+QU\naRPYf9q9UzbyVw/ScO4QM0buwirGpI73Q9Q74US50QKBgQDJCUODU6+8FW8zBLr5\nz6QJDEjUFl/kwlcEontNixUBKe26nznuzkRz6CTjFCuzJLHYx/OAFSefkmaOXPbY\n8D3kyVvtVz1Zj34BjNP/K5BY8CtwslEEbuBiYseMGdUytpb71nRoahuZZVKb+bGL\ngOiWMN4zJ+CgADa+Cqfq0+hTZwKBgQDEHpyM6BeJUrIt/KAZp4UOO0uiiSP55JzW\nC0wjqCTOFiKOnROVwxqdlIq1n95Brm3cTPe5ugWxwdKIDq1y+jEL5V0x4bOUoeuQ\nW6k6RfS6RbqZbf7lzzCnNaghrImBRSFWuwzogeFFd9eorUI58l4Rn/MufRh0TaPE\n9MMdzTAzNwKBgGPowK6xlnKIzHy0ax/fe4wrmL4eaIXNt2VMQq8k4cl0RvsqSqZN\nyGM6Car4yUb8g45SwMb0vH5nSaSSuvLRYlEjaRYo9wpdb6fhjzIPOmuY4F3foLft\nSoJayQTtibDsYVjDGZMSuKihXE675uqHpA+QNb2CofWiZZJIxW7E5X8dAoGBAJ6e\nF4XLTQXu0VdqQ96b43xgLssVWfiJkuN3HayVGLdppadsmWN9+e/LLOi6lRrQReBw\ni8c2Edbz6R/LpzMf8T0q09Y9Mm4bC5ek2tjbrZReQw5GrWsWyMXkGsipcEkSLWWl\nQUpniVgTFmRBRRfy02wzzo4h9P5TsQnh4FEhHEO/AoGAEWUC8IzL0JCvtjTT17TL\nv6VEydfZa7rGe0bksqlfuLBmQyWVac1409aKW7gf3B38Dd+emjlnMfWSPIMhdoE4\ndn4O1io4c02jxHdXZbZ/d3hyuB3s5NZhR3d83/8HoaHnjpv10kPNhSQGBEccXYZD\npB+kD6Iifqw0DP/DJLfgx0c=\n-----END PRIVATE KEY-----\n",
			app_name: "local-test-capi-fn-70fc6f56-ab29-43fe-ae9c-b77dd71a558a",
			iss_name: "Max NPE app",
			acl: {
				"paths": {
					"/*/users/**": {},
					"/*/conversations/**": {},
					"/*/sessions/**": {},
					"/*/devices/**": {},
					"/*/image/**": {},
					"/*/media/**": {},
					"/*/applications/**": {},
					"/*/push/**": {},
					"/*/knocking/**": {},
					"/*/calls/**": {},
					"/*/legs/**": {}
				}
			}
		}
	}

	const appname=  "ab618bb4-ac6a-46f9-b94d-54843e830609"; // 'local-test-capi-fn-70fc6f56-ab29-43fe-ae9c-b77dd71a558a'
	const appId = appsMap[appname];
	const app = {
		private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCaAyG2we4uREkH\nQCHPRIvmNBh97vxRflcjBqY4i7FFMnAzdD5BhBF8YcA+neA5dYBG5fDB2c0WQjW+\nnu1ifJQun6FznXNfJVHopwxeLTGt9oqAQYbO1EmityiOBFwRPubatS38Kl0JB4KR\nwoKPju60wwGu/qAz13Ot87sfF7J+aw0ieFDMTH2Dr/1wQfH2sJGTo+UCas25Nyze\nc5bRM/ph3VpTGVRFflX8grcwb2NHB9vUHVNsCAKJkYFVusD7m3p+2e08A4wDDrZi\n9S9dpZ6REn8/1XPpO6WGKO3zu+y5eYlz8qt2U4dlaCCudBdSdGhlAcXOvrjx+M57\nia7t13AhAgMBAAECggEABpbjtmINwsUBKuI/kBKquaq48YpsGUCCkekS65BugTtr\nOYhbsYnpBZ1ZEFTI5yxz1JS5/FFJSQ6EJie+mFwkKuqBieTOrt915bJgAReF7J+D\nxYEIN4k1rVSQ06K0HbjHP8xIr2VQnbZIi9v6ohHHfMxrIgWa7RzmwiaPdwEYjfgN\nlbc16/kHMYakgso18tblEKQIYQroZ6uhtJto8J1ngwa3GHaX6Gj+EUoDH+dnFmZ0\nYfHOzrs8ob+qs2FKmPWC3/jHV7JQNkwOh37icrvhuoDocfTQsxYbncwzRr2aU+QU\naRPYf9q9UzbyVw/ScO4QM0buwirGpI73Q9Q74US50QKBgQDJCUODU6+8FW8zBLr5\nz6QJDEjUFl/kwlcEontNixUBKe26nznuzkRz6CTjFCuzJLHYx/OAFSefkmaOXPbY\n8D3kyVvtVz1Zj34BjNP/K5BY8CtwslEEbuBiYseMGdUytpb71nRoahuZZVKb+bGL\ngOiWMN4zJ+CgADa+Cqfq0+hTZwKBgQDEHpyM6BeJUrIt/KAZp4UOO0uiiSP55JzW\nC0wjqCTOFiKOnROVwxqdlIq1n95Brm3cTPe5ugWxwdKIDq1y+jEL5V0x4bOUoeuQ\nW6k6RfS6RbqZbf7lzzCnNaghrImBRSFWuwzogeFFd9eorUI58l4Rn/MufRh0TaPE\n9MMdzTAzNwKBgGPowK6xlnKIzHy0ax/fe4wrmL4eaIXNt2VMQq8k4cl0RvsqSqZN\nyGM6Car4yUb8g45SwMb0vH5nSaSSuvLRYlEjaRYo9wpdb6fhjzIPOmuY4F3foLft\nSoJayQTtibDsYVjDGZMSuKihXE675uqHpA+QNb2CofWiZZJIxW7E5X8dAoGBAJ6e\nF4XLTQXu0VdqQ96b43xgLssVWfiJkuN3HayVGLdppadsmWN9+e/LLOi6lRrQReBw\ni8c2Edbz6R/LpzMf8T0q09Y9Mm4bC5ek2tjbrZReQw5GrWsWyMXkGsipcEkSLWWl\nQUpniVgTFmRBRRfy02wzzo4h9P5TsQnh4FEhHEO/AoGAEWUC8IzL0JCvtjTT17TL\nv6VEydfZa7rGe0bksqlfuLBmQyWVac1409aKW7gf3B38Dd+emjlnMfWSPIMhdoE4\ndn4O1io4c02jxHdXZbZ/d3hyuB3s5NZhR3d83/8HoaHnjpv10kPNhSQGBEccXYZD\npB+kD6Iifqw0DP/DJLfgx0c=\n-----END PRIVATE KEY-----\n",
		app_name: "local-test-capi-fn-70fc6f56-ab29-43fe-ae9c-b77dd71a558a",
		iss_name: "Max NPE app",
		acl: {
			"paths": {
				"/*/users/**": {},
				"/*/conversations/**": {},
				"/*/sessions/**": {},
				"/*/devices/**": {},
				"/*/image/**": {},
				"/*/media/**": {},
				"/*/applications/**": {},
				"/*/push/**": {},
				"/*/knocking/**": {},
				"/*/calls/**": {},
				"/*/legs/**": {}
			}
		}
	}
	const opts = {
		"iss": app.iss_name,
		"iat": Math.floor(Date.now() / 1000) - 30,
		"nbf": Math.floor(Date.now() / 1000) - 30,
		"exp": Math.floor(Date.now() / 1000) + Math.floor(1000/15*1440),
        "jti": Math.floor(Date.now()),
        "application_id": appId
	}
	console.log(opts.iss, "Mehboob Alam");
	if (app.acl) {
		opts["acl"] = app.acl
	}

	if (params.username) {
		opts["sub"] = params.username
	}

	const token = jwt.sign(opts, {
		key: app.private_key
	}, {
			algorithm: 'RS256'
		});
	return token
};
console.log(generateMaxToken({username: "js"}))
module.exports = generateMaxToken;