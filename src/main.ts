import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueApexCharts from "vue3-apexcharts";
import { UsbApiPlugin } from "./plugins/UsbApiPlugin";

createApp(App).use(router).use(VueApexCharts).use(UsbApiPlugin).mount("#app");
