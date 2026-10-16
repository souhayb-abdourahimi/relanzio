import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./test',testMatch:'maintenance-pilot.browser.spec.js',workers:1,use:{baseURL:'http://127.0.0.1:5178',headless:true},webServer:{command:'npx vite --config client/vite.config.js --host 127.0.0.1 --port 5178',url:'http://127.0.0.1:5178',reuseExistingServer:false}});
