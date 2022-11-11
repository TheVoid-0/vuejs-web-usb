import { DeviceSerializer, DeviceSerializerException } from "ts-web-usb";
import { MilkspecPayload } from "./interfaces/milkspec-payload";
import { MilkspecDeviceProtocol } from "./protocol/milkspec.protocol";

export class MilkspecSerializer extends DeviceSerializer<
  MilkspecPayload,
  Uint8Array
> {
  private readonly START_BYTE = MilkspecDeviceProtocol.CMD_STARTDEC;
  private readonly END_BYTE = MilkspecDeviceProtocol.CMD_ENDDEC;
  private readonly NOOP = 0x00;

  serialize(
    milkspecPayload: MilkspecPayload
  ): Uint8Array | Promise<Uint8Array> {
    debugger;
    try {
      const { opCode, data } = milkspecPayload;

      const parsedData = data ?? 0;

      const arrayBuffer = new ArrayBuffer(
        MilkspecDeviceProtocol.TRANSFER_BUFFER_SIZE
      );

      const dataView = new DataView(arrayBuffer);

      dataView.setUint8(0, this.START_BYTE);
      dataView.setUint8(1, opCode ?? this.NOOP);

      // Seta o numero passado como um valor de 4 bytes
      const uint8Array = this.unsignedIntToUint8Array(parsedData);

      uint8Array.forEach((uint8Value, index) =>
        dataView.setUint8(2 + index, uint8Value)
      );
      dataView.setUint8(dataView.byteLength - 1, this.END_BYTE);

      if (dataView.byteLength < MilkspecDeviceProtocol.TRANSFER_BUFFER_SIZE) {
        throw new DeviceSerializerException(
          MilkspecSerializer,
          "Data size is too small to fit in the transfer buffer"
        );
      }
      return new Uint8Array(arrayBuffer);
    } catch (error) {
      throw new DeviceSerializerException(MilkspecSerializer, error);
    }
  }

  // TODO: O Deserialize pode retornar dados muitos distintos quando nao existe uma estrutura especifica de dados para deseralizar, cada chamada pode retornar um dado completamente diferente, e talvez ate precise de um processo de deserializacao diferente dependendo da chamada. Portanto seria interessante desvincular o retorno do deserialize da entrada do serialize, e talvez permitir a passagem de algum parametro customizado que possa ser usado para definir o tipo de deserializacao a ser feita.
  deserialize(serializedData: DataView): MilkspecPayload {
    debugger;
    // A TEMPERATURA RETORNA A MESMA QUANTIDADE DE BYTES QUE O TESTE DE LED
    // if (serializedData.byteLength === 4) {
    //   // Temperatura
    //   return {
    //     data: serializedData.getUint32(0),
    //   };
    // }

    if (serializedData.byteLength === 2) {
      // GARBAGE FROM WEBUSB API
      throw new Error("GARBAGE FROM WEBUSB API");
    }

    if (serializedData.byteLength === 6) {
      return {
        data: serializedData as any,
      };
    }

    // transform the data view buffer into an uint16 array
    return {
      data: new Uint16Array(serializedData.buffer) as any,
    };
  }

  private unsignedIntToUint8Array(number: number): Uint8Array {
    const arrayBuffer = new ArrayBuffer(4);
    const dataView = new DataView(arrayBuffer);
    dataView.setUint32(0, number);
    return new Uint8Array(arrayBuffer);
  }
}
