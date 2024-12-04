<template>
  <div id="app">
    <MovieHeader @toggle-dark-mode="toggleDarkMode" />
    <div class="container mt-4">
     
      <router-view />
    </div>
        <MovieFooter />

  </div>
</template>

<script>
import MovieHeader from "./components/MovieHeader.vue";
import MovieFooter from "./components/MovieFooter.vue";

export default {
  components: {
    MovieHeader,
        MovieFooter,

  },
  methods: {
    toggleDarkMode() {
      document.body.classList.toggle("dark");
    },
  },
};
</script>


<style>
/* CSS tổng quát */
body {
  font-family: Arial, sans-serif;
  background: #ffffff;
  color: #000;
  text-decoration: none !important;
}

body.dark {
  background: #212b36; 
  color: #fff; 
}

</style>
