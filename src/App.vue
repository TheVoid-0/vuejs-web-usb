<template>
  <div>
    <aside-menu></aside-menu>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AsideMenu from "@/components/AsideMenu.vue";

export default defineComponent({
  name: "App",
  components: {
    AsideMenu,
  },
});
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  background-color: #ededed;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.content {
  padding: 20px;
  width: calc(100vw - 235px);
  float: right;
}

.card {
  padding: 15px;
  background-color: #fff;
  border-radius: 5px;
  margin: 10px;
}

.d-flex {
  display: flex;
}

.d-block {
  display: block;
}

.justify-content-center {
  justify-content: center;
}

.justify-content-between {
  justify-content: space-between;
}

.align-center {
  align-items: center;
}

h1 {
  text-align: center;
}

button {
  padding: 7px;
}
</style>
