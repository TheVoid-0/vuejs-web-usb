<template>
  <aside>
    <ul>
      <li>
        <router-link to="/">Dashboards</router-link>
      </li>
      <li>
        <router-link to="/config">Configurações</router-link>
      </li>
    </ul>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AsideMenu",
  components: {},
});
</script>

<style scoped>
aside {
  background-color: #1e326a;
  padding: 10px !important;
  left: 0;
  top: 0;
  height: 100%;
  position: fixed;
  width: 160px;
}

aside {
  padding: 30px;
}

aside a {
  font-weight: normal;
  color: #bfc6cd;
}

aside a.router-link-exact-active {
  font-weight: bold;
  color: #fff;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  border-bottom: solid 1px #ededed;
  padding: 10px 0;
}

ul li a {
  text-decoration: none;
}
</style>
