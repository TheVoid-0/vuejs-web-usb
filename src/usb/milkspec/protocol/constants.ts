import { WaveForm } from "./milkspec-waveform";
import { MilkspecDeviceProtocol } from "./milkspec.protocol";

export const _WAVE_FREQ_RES = 0.004656613;
export const _FS_FREQ_RES = 0.009313226;
export const _USB_AQUIRE_BUFFER = 8192;
export const DEVICE_AQUIRE_WAVE_TIMEOUT = 1000;

export const WAVE_FORM_PROTOCOL_MAP: Record<WaveForm, MilkspecDeviceProtocol> =
  {
    [WaveForm.SINE]: MilkspecDeviceProtocol.CMD_SINE_WAVE,
    [WaveForm.SQUARE]: MilkspecDeviceProtocol.CMD_SQUARE_WAVE,
    [WaveForm.SAWTOOTH]: MilkspecDeviceProtocol.CMD_SAWTOOTH_WAVE,
  };
