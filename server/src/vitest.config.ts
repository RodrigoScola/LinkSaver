import path from 'path';
import { defineConfig } from 'vitest/config';
export default defineConfig({
	test: {
		poolOptions: {
			threads: {
				minThreads: 3,
				singleThread: true,
			},
		},
	},
	server: {
		host: '0.0.0.0', // Change this to a valid IP address if needed
		port: 5172, // Optional otherwise your app will start on default port
	},
});
