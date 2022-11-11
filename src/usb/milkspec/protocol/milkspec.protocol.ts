export enum MilkspecDeviceProtocol {
  TRANSFER_BUFFER_SIZE = 7,

  CMD_STARTDEC = 0xff,
  CMD_ENDDEC = 0x0f,

  CMD_RESET = 0x47,
  CMD_ALARM_ON = 0x52,
  CMD_ALARM_OFF = 0x55,

  CMD_USBEN = 0xf0,
  CMD_UARTEN = 0xfc,

  CMD_GETTEMP = 0xa3,

  /* wave generator */
  CMD_SINE_WAVE = 0xb1,
  CMD_SQUARE_WAVE = 0xb3,
  CMD_SAWTOOTH_WAVE = 0xb5,

  CMD_SET_CLKFS_FREQ = 0xb7,
  CMD_SET_WAVEGEN_FREQ = 0xb9,

  CMD_DDSON = 0xc3,
  CMD_DDSOFF = 0xc5,

  /* acquistion opcodes */
  CMD_AQUIRE = 0xd1,
  CMD_REQDATA = 0xd3,
  CMD_AQSTATUS = 0xd5,
  CMD_AQRESET = 0xd7,

  /* analog gain */
  CMD_GAIN1 = 0xe1,
  CMD_GAIN2 = 0xe3,
  CMD_GAIN5 = 0xe5,
  CMD_GAIN10 = 0xe7,
  CMD_SETGAINLOAD = 0xe9,
  CMD_SETGAINSHUNT = 0xeb,

  /* hw info opcode */
  CMD_GETHWID = 0x10,
  CMD_GETHWSTATUS = 0x3f,

  /* test mode */
  CMD_TESTON = 0x31,
  CMD_TESTOFF = 0x33,

  /* sensor led status */
  CMD_SLED_STATUS = 0x70,
}
