<template>
  <div :class="{ dark: isDarkMode }" class="row">
    <h1>Phim mới nhất</h1>
    <!-- Thanh loading -->
    <div v-if="loading" class="loading-container">
      <div class="classic-7"></div>
    </div>
    <div class="col-md-9">
      <div class="row row-cols-1 row-cols-md-7 g-4 card-movie">
        <MovieCard v-for="movie in movies" :key="movie.slug" :movie="movie" />
      </div>
    </div>

    <div class="col-md-3">
      <div class="popular-movies">
        <h4>Phim Lẻ</h4>
        <ul>
          <li v-for="movie in popularMovies" :key="movie.slug">
            <router-link :to="'/movie/' + movie.slug" class="movie-link">
              <img
                :src="`http://img.ophim1.com/uploads/movies/${movie.poster_url}`"
                :alt="movie.name"
                class="movie-poster"
                style="
                  width: 70px;
                  height: 120px;
                  object-fit: cover;
                  margin-right: 10px;
                "
              />
              <span>{{ movie.name }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="popular-movies">
        <h4>Phim Bộ</h4>
        <ul>
          <li v-for="movie in serialMovies" :key="movie.slug">
            <router-link :to="'/movie/' + movie.slug" class="movie-link">
              <img
                :src="`http://img.ophim1.com/uploads/movies/${movie.poster_url}`"
                :alt="movie.name"
                class="movie-poster"
                style="
                  width: 70px;
                  height: 120px;
                  object-fit: cover;
                  margin-right: 10px;
                "
              />
              <span>{{ movie.name }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <div class="col-md-12">
      <div class="pagination">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
        >
          &lt;&lt;
        </button>
        <button
          v-for="page in totalPagesToShow"
          :key="page"
          @click="changePage(page)"
          :class="{ active: page === currentPage }"
        >
          {{ page }}
        </button>
        <input
          type="number"
          v-model.number="pageInput"
          @keyup.enter="goToPage"
          :min="1"
          :max="totalPages"
          :placeholder="`Nhập trang (1-${totalPages})`"
        />
        <button
          @click="goToPage"
          :disabled="pageInput < 1 || pageInput > totalPages"
        >
          Go
        </button>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import MovieCard from "./MovieCard.vue";

export default {
  name: "MovieList",
  components: { MovieCard },
  data() {
    return {
      movies: [],
      popularMovies: [],
      serialMovies: [],
      currentPage: 1,
      totalPages: 0,
      isDarkMode: false,
      pageInput: 1,
      totalPagesToShow: [],
      loading: false,
    };
  },

  methods: {
    async fetchMovies(page = 1) {
      this.loading = true;
      try {
        const response = await fetch(
          `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page}`
        );
        const data = await response.json();
        this.movies = data.items || [];
        this.totalPages = data.pagination.totalPages || 1;
        this.currentPage = page;

        const moviePromises = this.movies.map((movie) =>
          this.fetchMovieDetails(movie.slug)
        );
        await Promise.all(moviePromises);

        this.fetchPopularMovies();
        this.updatePagination();
      } catch (error) {
        console.error("Lỗi khi tải danh sách phim:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchMovieDetails(slug) {
      try {
        const response = await fetch(`https://ophim1.com/phim/${slug}`);
        const data = await response.json();
        const movie = this.movies.find((movie) => movie.slug === slug);
        if (movie && data.movie) {
          movie.episode_total = data.movie.episode_total;
          movie.episode_current = data.movie.episode_current;
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin chi tiết phim:", error);
      }
    },

    fetchPopularMovies() {
      const singleMovies = this.movies.filter((movie) => {
        const totalEpisodes = parseInt(movie.episode_total, 10);
        return (
          totalEpisodes === 1 &&
          movie.episode_current?.toLowerCase().includes("full")
        );
      });

      const serialMovies = this.movies.filter((movie) => {
        const totalEpisodes = parseInt(movie.episode_total, 10);
        return (
          totalEpisodes > 2 &&
          movie.episode_current &&
          !movie.episode_current.toLowerCase().includes("full")
        );
      });

      this.popularMovies = singleMovies.length
        ? singleMovies.sort((a, b) => b.view - a.view).slice(0, 5)
        : [];
      this.serialMovies = serialMovies.length
        ? serialMovies.sort((a, b) => b.view - a.view).slice(0, 5)
        : [];
    },

    updatePagination() {
      const maxPagesToShow = 3;
      let startPage = this.currentPage - Math.floor(maxPagesToShow / 2);
      let endPage = this.currentPage + Math.floor(maxPagesToShow / 2);

      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(maxPagesToShow, this.totalPages);
      }

      if (endPage > this.totalPages) {
        endPage = this.totalPages;
        startPage = Math.max(1, this.totalPages - maxPagesToShow + 1);
      }

      this.totalPagesToShow = [];
      for (let i = startPage; i <= endPage; i++) {
        this.totalPagesToShow.push(i);
      }
    },

    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.fetchMovies(page);
      }
    },

    goToPage() {
      const page = parseInt(this.pageInput);
      if (page >= 1 && page <= this.totalPages) {
        this.fetchMovies(page);
      }
    },
  },

  mounted() {
    this.fetchMovies();
  },
};
</script>



<style scoped>
/* Thêm style cho chế độ dark */
.row {
  display: flex;
  text-decoration: none;
}

.col-md-9 {
  flex: 0 0 75%;
}

.col-md-3 {
  flex: 0 0 25%;
}

.popular-movies {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.popular-movies h4 {
  font-size: 1.25rem;
  margin-bottom: 10px;
   color: #ffa500;
}

.popular-movies ul {
  list-style-type: none;
  padding: 0;
}

.popular-movies li {
  margin-bottom: 10px;
}

.popular-movies li a {
  text-decoration: none;
  color: #333;
}

.popular-movies li a:hover {
  color: #ffa500;
}

.movie-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
}

.movie-poster:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 20px rgba(214, 37, 37, 0.2);
}

.movie-poster {
  border-radius: 5px;
}

/* dark mode */
.dark .popular-movies {
  background-color: #000000;
  color: #fff;
}
span{
  color: #ce1717;
  font-size: 16px;
}
.dark .popular-movies span {
  background-color: #000000;
 color: #ffa500;
 }

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  background: #ffffff;
  color: #000000;
}
.dark .pagination button {
  background: #000000;
  color: #efefef;
}
.pagination button:hover {
  background: #ec7310;
  
}
.pagination button.active {
  background: #ec7310;
  color: white;
}

.pagination button:disabled {
  background-color: #1ec4da;
  cursor: not-allowed;
}
.dark .pagination input {
  
    background: #000000;
  color: #ffffff;

}
.pagination input {
  width: 50px;
  margin: 0 5px;
  padding: 5px;
    background: #ffffff;
  color: #000000;

}

[class*="classic"]:before {
  content: "Loading...";
}
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.classic-7 {
  font-weight: bold;
  font-family: monospace;
  font-size: 30px;
  color: #0000;
  background: linear-gradient(90deg, red calc(50% + 0.5ch), #000 0)
    right/calc(200% + 1ch) 100%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: c7 2s infinite steps(11);
}
@keyframes c7 {
  to {
    background-position: left;
  }
}
h1 {
  color: #ef4c15;
}
.dark h1 {
  color: #ec7310;
}
</style>
