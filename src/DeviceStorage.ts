import { DeviceInfo } from "ts-web-usb";
import { MilkspecDevice } from "./usb/milkspec/milkspec.device";

export class DeviceStorage {
  private static device: MilkspecDevice | null = null;

  public static set(device: MilkspecDevice | null) {
    this.device = device;
    if (null !== device) this.setDeviceToLocalStorage(device.deviceInfo);
  }

  public static async get(): Promise<MilkspecDevice | null> {
    if (!this.device) {
      const deviceInfo = this.getDeviceFromLocalStorage();
      if (!deviceInfo) {
        return null;
      }

      return MilkspecDevice.create(deviceInfo);
    }

    return this.device;
  }

  private static getDeviceFromLocalStorage() {
    const device = localStorage.getItem("device");
    if (!device) {
      return null;
    }
    return JSON.parse(device) as DeviceInfo;
  }

  private static setDeviceToLocalStorage(device: DeviceInfo) {
    localStorage.setItem("device", JSON.stringify(device));
  }
}
