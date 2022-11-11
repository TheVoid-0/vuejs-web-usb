<template>
  <div>
    <h1>Dashboards</h1>
    <!-- formulário -->
    <div class="card d-flex justify-content-between align-center">
      <div>
        <label class="d-block">Frequência da onda:</label>
        <input type="number" v-model="form.waveFrequency" />
      </div>

      <div>
        <label class="d-block">Frequência de amostra:</label>
        <input type="number" v-model="form.sampleFrequency" />
      </div>

      <div>
        <label class="d-block">Tipo de onda:</label>
        <select v-model="form.type">
          <option :value="1">Sine</option>
          <option :value="2">Square</option>
          <option :value="3">Sawtooth</option>
        </select>
      </div>

      <button @click="generateWave()">Gerar</button>
    </div>

    <!-- gráfico seno -->
    <div class="d-flex justify-content-center" v-if="showSine">
      <div class="card chart-card">
        <strong>Leituras:</strong>
        <apexchart
          width="500"
          type="line"
          :options="chartOptionsSine"
          :series="chartSeries"
        >
        </apexchart>
      </div>
    </div>

    <!-- gráfico quadrado -->
    <div class="d-flex justify-content-center" v-if="showSquare">
      <div class="card chart-card">
        <strong>Leituras:</strong>
        <apexchart
          width="500"
          type="line"
          :options="chartOptionsSquare"
          :series="chartSeries"
        >
        </apexchart>
      </div>
    </div>

    <!-- gráfico dente de serra -->
    <div class="d-flex justify-content-center" v-if="showSawtooth">
      <div class="card chart-card">
        <strong>Leituras:</strong>
        <apexchart
          width="500"
          type="line"
          :options="chartOptionsSawtooth"
          :series="chartSeries"
        >
        </apexchart>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { MilkspecDevice } from "../usb/milkspec/milkspec.device";
import { WaveForm } from "../usb/milkspec/protocol/milkspec-waveform";
import { MilkspecDeviceProtocol } from "../usb/milkspec/protocol/milkspec.protocol";

export default defineComponent({
  name: "DahboardView",
  components: {},
  data: () => ({
    device: null as unknown as MilkspecDevice,
    form: {
      waveFrequency: 0,
      sampleFrequency: 0,
      type: 1 as WaveForm,
    },
    showSine: false,
    showSquare: false,
    showSawtooth: false,
    chartOptionsSine: {
      chart: {
        id: "vuechart-example",
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: new Array<number>(),
      },
    },
    chartOptionsSawtooth: {
      chart: {
        id: "vuechart-example",
      },
      stroke: {
        curve: "straight",
      },
      xaxis: {
        categories: new Array<number>(),
      },
    },
    chartOptionsSquare: {
      chart: {
        id: "vuechart-example",
      },
      stroke: {
        curve: "stepline",
      },
      xaxis: {
        categories: new Array<number>(),
      },
    },
    chartSeries: [
      {
        name: "series-1",
        data: new Array<number>(),
      },
    ],
    counter: 0,
  }),
  async created() {
    // this.device = await MilkspecDevice.create();
  },
  methods: {
    startReading() {
      setInterval(() => {
        if (this.counter < 10) {
          this.counter++;
          if (this.counter > 10) {
            this.chartOptionsSine.xaxis.categories = [
              ...this.chartOptionsSine.xaxis.categories.slice(1),
              this.counter,
            ];

            this.chartOptionsSquare.xaxis.categories = [
              ...this.chartOptionsSquare.xaxis.categories.slice(1),
              this.counter,
            ];

            this.chartOptionsSawtooth.xaxis.categories = [
              ...this.chartOptionsSawtooth.xaxis.categories.slice(1),
              this.counter,
            ];

            this.chartSeries[0].data = [
              ...this.chartSeries[0].data.slice(1),
              Math.floor(Math.random() * 100),
            ];

            return;
          }

          this.chartOptionsSine.xaxis.categories.push(this.counter);
          this.chartOptionsSquare.xaxis.categories.push(this.counter);
          this.chartOptionsSawtooth.xaxis.categories.push(this.counter);
          this.chartSeries[0].data.push(Math.floor(Math.random() * 100));
        }
      }, 1000);
    },
    reatTemperature() {
      // this.device.send({
      //   readOptions: { length: 4 },
      //   data: { opCode: MilkspecDeviceProtocol.CMD_GETTEMP, data: []  },
      // });
    },
    generateWave() {
      this.showSine = this.form.type === WaveForm.SINE;
      this.showSquare = this.form.type === WaveForm.SQUARE;
      this.showSawtooth = this.form.type === WaveForm.SAWTOOTH;

      console.log("gerar");
      this.startReading();
    },
  },
});
</script>

<style scoped>
.chart-card {
  max-width: fit-content;
  max-height: fit-content;
}

input,
select {
  padding: 5px;
  width: 100%;
}

button {
  background-color: #1e326a;
  color: white;
  border: none;
  height: 35px;
}
</style>
