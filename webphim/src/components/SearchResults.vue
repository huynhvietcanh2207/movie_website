<template>
  <div class="search-results-container">
    <div class="row row-cols-1 row-cols-md-7 g-4 card-movie">
      <MovieCard
        v-for="movie in movies"
        :key="movie.slug"
        :movie="movie"
      />
    </div>
  </div>
</template>

<script>
import MovieCard from "./MovieCard.vue";
import axios from 'axios';

export default {
  name: "SearchResults",
  components: {
    MovieCard,
  },
  data() {
    return {
      movies: [],
    };
  },
  created() {
    this.fetchMoviesFromSearch();
  },
  methods: {
    fetchMoviesFromSearch() {
      const searchQuery = this.$route.query.q; // Lấy query từ URL

      if (searchQuery && searchQuery.length > 1) {
        // Gửi request tìm kiếm API nếu có từ khóa
        axios
          .get("https://ophim1.com/v1/api/tim-kiem", {
            params: {
              keyword: searchQuery,
              limit: 10,
            },
          })
          .then((response) => {
            if (
              response.data &&
              response.data.data &&
              response.data.data.items
            ) {
              this.movies = response.data.data.items;
            }
          })
          .catch((error) => {
            console.error("Lỗi khi tìm kiếm:", error);
          });
      }
    },
  },
};
</script>

<style scoped>
.search-results-container {
  margin-top: 20px;
}
</style>
