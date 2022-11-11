import { handleTemperatureResult } from "../milkspec-protocol.util";

describe("milkspec-protocol.util", () => {
  describe("handleTemperatureResult", () => {
    it("should return the correct temperature", () => {
      const dataView = new DataView(new ArrayBuffer(4));
      const value = 23337056;
      // const value = 28323680;
      dataView.setUint32(0, value);
      const temperature = handleTemperatureResult(dataView.getUint32(0));
      expect(temperature.boardTemperature).toEqual(24.375);
      expect(temperature.sampleTemperature).toEqual(22.25);
    });
  });
});
