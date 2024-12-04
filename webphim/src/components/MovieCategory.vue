<template>
  <div>
    <h2>{{ categoryName }}</h2>
    <!-- <div v-if="loading" class="loading">Đang tải dữ liệu...</div> -->
    <div v-if="loading" class="loading-container">
      <div class="classic-7"></div>
    </div>
    <div v-if="!loading && !error && filteredMovies.length === 0">
      Không có phim nào trong thể loại này.
    </div>

    <div v-if="error" class="error">
      Lỗi khi tải dữ liệu. Vui lòng thử lại sau.
    </div>
    <div v-else class="row row-cols-1 row-cols-md-7 g-4 card-movie">
      <MovieCard
        v-for="movie in filteredMovies"
        :key="movie.slug"
        :movie="movie"
      />
    </div>

    <div v-if="!loading && !error" class="pagination">
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
</template>

<script>
import MovieCard from "./MovieCard.vue";

export default {
  name: "MovieCategory",
  components: { MovieCard },
  props: {
    slug: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      movies: [],
      filteredMovies: [],
      categoryName: "",
      currentPage: 1,
      totalPages: 0,
      pageInput: 1,
      totalPagesToShow: [],
      loading: false,
      error: false,
    };
  },
  methods: {
    async fetchMoviesByCategory(page = 1) {
      this.loading = true;
      this.error = false;
      try {
        const response = await fetchWithTimeout(
          `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page}`,
          5000
        );
        const data = await response.json();
        const MAX_PAGES = 50;
        const totalPages = Math.min(data.pagination.totalPages, MAX_PAGES);

        const pagePromises = Array.from({ length: totalPages }, (_, i) =>
          fetchWithTimeout(
            `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${i + 1}`,
            5000
          )
            .then((res) => res.json())
            .catch((error) => {
              console.warn(`Lỗi tải trang ${i + 1}: ${error.message}`);
              return null;
            })
        );

        const pagesData = (await Promise.allSettled(pagePromises))
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);

        const movieDetailsPromises = pagesData.flatMap((pageData) =>
          pageData.items.map((movie) => this.fetchMovieDetails(movie.slug))
        );

        const allMoviesDetails = (
          await Promise.all(movieDetailsPromises)
        ).filter((movie) => movie !== null);

        this.movies = allMoviesDetails.filter((movie) => {
          const matchesCategory = movie.category.some(
            (cat) => cat.slug === this.slug
          );
          const totalEpisodes = parseInt(movie?.episode_total, 10);

          if (this.slug === "phim-le") {
            return (
              totalEpisodes === 1 &&
              movie.episode_current?.toLowerCase().includes("full")
            );
          }

          if (this.slug === "phim-bo") {
            return (
              totalEpisodes > 2 &&
              movie.episode_current &&
              !movie.episode_current.toLowerCase().includes("full")
            );
          }

          return matchesCategory;
        });

        this.categoryName =
          this.movies[0]?.category.find((cat) => cat.slug === this.slug)
            ?.name ||
          (this.slug === "phim-le"
            ? "Phim Lẻ"
            : this.slug === "phim-bo"
            ? "Phim Bộ"
            : "Không xác định");

        this.updateFilteredMovies();
        this.updatePagination();
      } catch (error) {
        this.error = true;
        console.error("Lỗi khi lấy danh sách phim:", error);
        this.movies = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchMovieDetails(slug) {
      try {
        const response = await fetchWithTimeout(
          `https://ophim1.com/phim/${slug}`,
          3000
        );
        const data = await response.json();
        return data.movie;
      } catch (error) {
        console.warn(`Lỗi tải chi tiết phim: ${slug}`);
        return null;
      }
    },

    updateFilteredMovies() {
      const itemsPerPage = 20;
      const start = (this.currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      this.filteredMovies = this.movies.slice(start, end);
      this.totalPages = Math.ceil(this.movies.length / itemsPerPage);
      this.updatePagination();
    },

    updatePagination() {
      const maxPagesToShow = 5;
      const delta = Math.floor(maxPagesToShow / 2);
      let startPage = Math.max(1, this.currentPage - delta);
      let endPage = Math.min(this.totalPages, this.currentPage + delta);

      if (this.totalPages > maxPagesToShow) {
        if (this.currentPage <= delta) {
          endPage = maxPagesToShow;
        } else if (this.currentPage + delta >= this.totalPages) {
          startPage = this.totalPages - maxPagesToShow + 1;
        }
      }

      this.totalPagesToShow = [];
      for (let i = startPage; i <= endPage; i++) {
        this.totalPagesToShow.push(i);
      }
    },

    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.updateFilteredMovies();
      }
    },

    goToPage() {
      const page = parseInt(this.pageInput);
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.updateFilteredMovies();
      }
    },
  },
  watch: {
    slug: "fetchMoviesByCategory",
  },
  mounted() {
    this.fetchMoviesByCategory();
  },
};

function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    ),
  ]);
}
</script>

<style scoped>
.movie-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.movie-item {
  text-align: center;
}

.movie-item img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.movie-item h3 {
  margin-top: 10px;
  font-size: 16px;
  color: #333;
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
  background-color: #393030;
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

/* .loading {
  text-align: center;
  font-size: 18px;
  color: #007bff;
} */

[class*=classic]:before {
  content:"Loading...";
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
  color:#0000;
  background:linear-gradient(90deg,red calc(50% + 0.5ch),#000 0) right/calc(200% + 1ch) 100%;
  -webkit-background-clip:text;
  background-clip:text;
  animation:c7 2s infinite steps(11);
}
@keyframes c7 {to{background-position: left}}
.error {
  text-align: center;
  font-size: 18px;
  color: red;
}
h2{
   color: #ffa500;
}
</style>
