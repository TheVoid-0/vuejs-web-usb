import { Device, DeviceConfigurationBuilder, DeviceInfo } from "ts-web-usb";
import { MilkspecPayload } from "./interfaces/milkspec-payload";
import { MilkspecDeviceProtocol } from "./protocol/milkspec.protocol";
import { MilkspecSerializer } from "./milkspec.serializer";
import { handleTemperatureResult } from "./protocol/milkspec-protocol.util";
import {
  DEVICE_AQUIRE_WAVE_TIMEOUT,
  WAVE_FORM_PROTOCOL_MAP,
  _USB_AQUIRE_BUFFER,
  _WAVE_FREQ_RES,
} from "./protocol/constants";
import { WaveForm } from "./protocol/milkspec-waveform";

export class MilkspecDevice extends Device<MilkspecPayload, Uint8Array> {
  static create(deviceFilter: DeviceInfo) {
    return new DeviceConfigurationBuilder()
      .useDeviceFilter({
        productId: deviceFilter.pid,
        vendorId: deviceFilter.vid,
      })
      .useSerializer(MilkspecSerializer)
      .useClass(MilkspecDevice)
      .getDevice();
  }

  public async readHarwdareVersion() {
    const result = await this.send({
      readOptions: { length: 4 + 2 },
      payload: { opCode: MilkspecDeviceProtocol.CMD_GETHWID },
    });
    await this.resetDevice();
    return result.getValueOrThrow();
  }

  public async resetDevice() {
    (
      await this.emit({ opCode: MilkspecDeviceProtocol.CMD_RESET, data: 0 })
    ).getValueOrThrow();
  }

  public async setWaveFrequency(frequency: number) {
    const waveFrequency = Math.trunc(frequency / _WAVE_FREQ_RES);
    await this.emit({
      opCode: MilkspecDeviceProtocol.CMD_SET_WAVEGEN_FREQ,
      data: waveFrequency,
    });
    await this.resetDevice();
  }

  public async setSamplingWaveFrequency(frequency: number) {
    const samplingFrequency = Math.trunc(frequency / _WAVE_FREQ_RES);
    await this.emit({
      opCode: MilkspecDeviceProtocol.CMD_SET_CLKFS_FREQ,
      data: samplingFrequency,
    });
    await this.resetDevice();
  }

  public async setWaveOut(enable: boolean) {
    await this.emit({
      opCode: enable
        ? MilkspecDeviceProtocol.CMD_DDSON
        : MilkspecDeviceProtocol.CMD_DDSOFF,
      data: 0,
    });
    await this.resetDevice();
  }

  public async setWaveForm(waveForm: WaveForm) {
    await this.emit({
      opCode: WAVE_FORM_PROTOCOL_MAP[waveForm],
      data: waveForm,
    });
    await this.resetDevice();
  }

  public async aquireWaveForm() {
    await this.emit({
      opCode: MilkspecDeviceProtocol.CMD_AQUIRE,
      data: 0,
    });

    await this.sleep(DEVICE_AQUIRE_WAVE_TIMEOUT);
    await this.resetDevice();
  }

  private async sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  public async readWavePoints() {
    await this.emit({ opCode: MilkspecDeviceProtocol.CMD_REQDATA, data: 0 });
    const result = await this.read({ length: _USB_AQUIRE_BUFFER });
    await this.resetDevice();

    const { data } = result.getValueOrThrow();

    if (!Array.isArray(data)) {
      throw new Error("Device returned invalid data");
    }

    return data;
  }

  public async readTemperature() {
    const result = await this.send({
      payload: { opCode: MilkspecDeviceProtocol.CMD_GETTEMP },
      readOptions: { length: 4 + 2 },
    });
    await this.resetDevice();

    const returnPayload = result.getValueOrThrow().data as unknown as DataView;

    if (returnPayload.byteLength < 4) {
      throw new Error("Invalid data returned");
    }

    const sensorValue = new DataView(returnPayload.buffer.slice(2)).getUint32(
      0,
      true
    );
    return handleTemperatureResult(sensorValue);
  }
}
