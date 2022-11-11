<template>
  <div>
    <h1>Configurações</h1>

    <div class="card d-flex justify-content-between">
      <form-group v-if="deviceOptions.length || selectedDevice">
        <label>Selecione um dispositivo:</label>
        <select class="config-select" v-model="selectedDevice">
          <option value="">Nenhum</option>
          <option
            v-for="device in deviceOptions"
            :value="device"
            :key="device.getPid()"
          >
            {{
              !device.deviceInfo.productName
                ? `Dispositivo ${device.getPid()}`
                : device.deviceInfo.productName
            }}
          </option>
        </select>
      </form-group>
      <button @click="requestNewDevice">Novo dispositivo</button>
    </div>

    <div v-if="selectedDevice">
      <div
        class="card"
        v-for="config in selectedDevice.exposeNativeDevice().configurations"
        :key="config.configurationValue"
      >
        <strong>
          {{
            !config.configurationName
              ? "Configuração"
              : config.configurationName
          }}
          {{ config.configurationValue }}
        </strong>
        <div class="d-flex justify-content-center">
          <button
            class="interface"
            v-for="deviceInterface in config.interfaces"
            :key="'i' + deviceInterface.interfaceNumber"
            @click="selectDeviceConfiguration(config, deviceInterface)"
          >
            Interface {{ deviceInterface.interfaceNumber }}
          </button>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-center">
      <div class="card card-leituras">
        <strong>Entradas</strong>
        <textarea v-model="inputs" readonly></textarea>
        <div class="d-flex">
          <input v-model="text" placeholder="Digite aqui..." type="text" />
          <button @click="send">Enviar</button>
        </div>
      </div>

      <div class="card card-leituras">
        <strong>Saídas</strong>
        <textarea v-model="outputs" readonly></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Device } from "ts-web-usb";
import { defineComponent, inject } from "vue";
import { USB_API } from "../plugins/UsbApiPlugin";
import { DeviceStorage } from "../DeviceStorage";
import { MilkspecDevice } from "../usb/milkspec/milkspec.device";
import { MilkspecDeviceProtocol } from "../usb/milkspec/protocol/milkspec.protocol";

export default defineComponent({
  name: "ConfigView",
  components: {},
  data: () => ({
    deviceOptions: [] as Array<Device<any, any>>,
    text: "",
    inputs: "",
    outputs: "",
    usbApi: inject(USB_API) ?? null,
    selectedDevice: null as MilkspecDevice | null,
  }),
  methods: {
    dataViewToText(dataView: DataView) {
      return dataView.getUint32(0, true).toString();
    },
    async send() {
      console.log(this.text);
      if (this.text.toUpperCase() === "A") {
        const emitResult = await this.selectedDevice!.emit({
          opCode: MilkspecDeviceProtocol.CMD_GETHWID,
        });

        console.log(emitResult.getValueOrThrow());
        const readResult = await this.selectedDevice!.read({ length: 4 + 2 });
        const value = readResult.getValueOrThrow().data as unknown as DataView;
        const bufferData = new DataView(value.buffer.slice(2));
        this.outputs += `${this.dataViewToText(bufferData)}\n`;
      }
      if (this.text.toUpperCase() === "R") {
        await this.selectedDevice!.emit({
          opCode: MilkspecDeviceProtocol.CMD_RESET,
        });
        console.log("device reseted");
      }

      if (this.text.toUpperCase() === "T") {
        const temperatureResult = await this.selectedDevice!.readTemperature();
        console.log("Temperature result", temperatureResult);
        this.outputs += `${temperatureResult.boardTemperature}, ${temperatureResult.sampleTemperature}\n`;
      }

      this.inputs = this.inputs + this.text + "\n";
      this.text = "";
    },
    async requestNewDevice() {
      // const deviceInfo = await this.usbApi?.requestDevice([]);
      // const device = await new DeviceConfigurationBuilder()
      //   .useDeviceFilter({
      //     vendorId: deviceInfo?.vendorId,
      //     productId: deviceInfo?.productId,
      //   })
      //   .useSerializer(TestSerializer)
      //   .getDevice();
      // TODO: fix device info to accept only one info
      const device = await MilkspecDevice.create();

      //   await this.connectedDevice?.selectConfiguration(1)
      // try {
      //   await this.connectedDevice?.claimInterface(1)
      // } catch (error) {
      //   console.log('Falha ao adquir a interface 1', error)
      // }
      // console.log('Conectado')
      // console.log(this.connectedDevice)

      // const encodedMessage = new Uint8Array([
      //   0,
      //   ...new TextEncoder().encode(JSON.stringify(this.messageToSend)),
      // ]);
      // // console.log(encodedMessage)
      // console.log(await this.connectedDevice?.transferIn(3, 6));
      // const result = await this.connectedDevice?.transferOut(
      //   4,
      //   new Uint8Array([0xff, 0x10, 0x00, 0x00, 0x00, 0x00, 0x0f])
      // );
      // // console.log(result);
      // const inMessage = await this.connectedDevice?.transferIn(3, 6);
      // console.log(inMessage);
      // await this.connectedDevice?.transferOut(
      //   4,
      //   new Uint8Array([0xff, 0x47, 0x00, 0x00, 0x00, 0x00, 0x0f])
      // );

      // device.emit({ data: 12 });

      // const result = await device.read({ length: 7 });

      // result.getValue().data;

      // this.deviceOptions.push(deviceInfo);
      this.deviceOptions.push(device);
    },
    selectDeviceConfiguration(config: any, deviceInterface: any) {
      this.selectedDevice!.selectConfiguration(config.configurationValue);
      this.selectedDevice!.claimInterface(deviceInterface.interfaceNumber);
      this.selectedDevice!.setDefaultEndpoints({
        writeEndpointNumber: 4,
        readEndpointNumber: 3,
      });
      DeviceStorage.set(this.selectedDevice as any);
      alert("Device configured!");
    },
  },
  watch: {
    selectedDevice: async function (
      value: MilkspecDevice,
      oldValue: MilkspecDevice | null
    ) {
      await value.open();
      console.log(value, value.exposeNativeDevice());
    },
  },
  async mounted() {
    if (null !== this.selectedDevice) {
      this.deviceOptions.push(this.selectedDevice);
    }
  },
});
</script>

<style scoped>
select {
  width: 300px;
  padding: 5px;
}

.config-select {
  margin-left: 10px;
}

.card-leituras {
  width: 47%;
}

textarea,
input {
  display: block;
}

textarea {
  border: #e3e3e3 1px solid;
  height: 300px;
  width: 100%;
  resize: none;
}

input {
  padding: 5px;
  width: 100%;
}

button {
  background-color: #1e326a;
  color: white;
  border: none;
}

.interface {
  margin-right: 20px;
}
</style>
