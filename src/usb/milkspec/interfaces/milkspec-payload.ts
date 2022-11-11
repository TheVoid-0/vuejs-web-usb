import { MilkspecDeviceProtocol } from "../protocol/milkspec.protocol";

export interface MilkspecPayload {
  opCode?: MilkspecDeviceProtocol;
  data?: number;
}
