<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
    <section v-if="errored">
      <p>We're sorry, we're not able to retrieve this information at the moment</p>
    </section>
    {{ votes }}
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(VueAxios, axios);

export default {
  name: "App",
  data() {
    return {
      votes: null,
      info: null,
      loading: true,
      errored: false
    };
  },
  mounted() {
    Vue.axios
      .get("http://localhost:8000/votes")
      .then(response => {
        this.votes = response.data;
      })
      .catch(error => {
        console.log(error);
        this.errored = true;
      });
  },
  components: {}
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
