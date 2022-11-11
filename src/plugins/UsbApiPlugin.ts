import { USBApi } from "ts-web-usb";
import { InjectionKey, Plugin } from "vue";

export const usbApi = USBApi.initialize();
export const USB_API: InjectionKey<USBApi> = Symbol("UsbApiPlugin");

export const UsbApiPlugin: Plugin = {
  install(app) {
    app.config.globalProperties.$usbApi = usbApi;
    app.provide(USB_API, usbApi);
  },
};
