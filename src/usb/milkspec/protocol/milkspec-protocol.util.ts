// Segundo a DOC do JS, operadores bitwise são realizados em 32 bits ignorando os outros bits, mesmo que o JS utilize 64 bits para representar números.
export function handleTemperatureResult(data: number): {
  boardTemperature: number;
  sampleTemperature: number;
} {
  // Código traduzido do C++

  /* leitura de sinais das medidas e bits de falha */

  const bit_signal_thermo = (data >> 31) & 1;
  const bit_signal_tref = (data >> 14) & 1;
  const bit_fault = (data >> 15) & 1;

  const bit_3_res = (data >> 3) & 1;
  /* bit 3 RES; reservado, sempre em 0 quando ok */
  const bit_17_res = (data >> 16) & 1;
  /* bit 17 RES; reservado, sempre em 0 quando ok */

  const bit_short_vcc = (data >> 2) & 1;
  const bit_short_gnd = (data >> 1) & 1;

  const bit_open_circuit = data >> 18 == 0x1fff ? 1 : 0;
  const temperatura_fault = bit_fault; /* bit de falha */

  if (bit_short_vcc == 1) throw new Error("Termometro short VCC.");

  if (bit_short_gnd == 1) throw new Error("Termometro short GND.");

  if (bit_open_circuit == 1) throw new Error("Termometro desconectado.");

  if (temperatura_fault == 1 || bit_3_res == 1 || bit_17_res == 1)
    throw new Error("Termometro sem resposta. Bit fault detectado");

  /* mascara para extrair temperatura do thermopar */
  const temperatura_amostra = (data >> 18) & 0x1fff;

  const temperatura_placa = (data >> 4) & 0x7ff;

  return {
    sampleTemperature:
      bit_signal_thermo === 1
        ? handleNegativeTemperature(temperatura_amostra, 0x1fff, 0.25)
        : temperatura_amostra * 0.25,
    boardTemperature: bit_signal_tref
      ? handleNegativeTemperature(temperatura_placa, 0x7ff, 0.0625)
      : temperatura_placa * 0.0625,
  };
}

function handleNegativeTemperature(
  temperature: number,
  bitMask = 0x1fff,
  multiplier = 0.25
) {
  const twosComplementTemperature = (~temperature & bitMask) + 1;

  return -twosComplementTemperature * multiplier;
}
