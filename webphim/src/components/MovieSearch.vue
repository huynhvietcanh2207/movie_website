<template>
  <div class="search-container">
    <div class="search-wrapper">
      <input
        type="text"
        v-model="searchQuery"
        @input="debounceSearch"
        placeholder="Tìm kiếm phim..."
        class="search-input"
      />
      <button class="search-button" @click="searchOnButtonClick">
        <i class="fas fa-search" style="color: #ffa500"></i>
      </button>
    </div>

    <ul v-if="searchResults.length > 0" class="search-suggestions">
      <li class="clear-results" @click="clearSearchResults">
        <span class="clear-icon">X</span>
      </li>
      <li
        v-for="movie in searchResults"
        :key="movie.slug"
        @click="selectMovie(movie)"
        class="suggestion-item"
      >
        <router-link :to="'/movie/' + movie.slug" class="movie-link">
          <img
            :src="`http://img.ophim1.com/uploads/movies/${movie.poster_url}`"
            :alt="movie.name"
            class="movie-poster"
            style="
              width: 70px;
              height: 70px;
              object-fit: cover;
              margin-right: 10px;
            "
          />
          <div class="suggestion-details">
            <span class="suggestion-name">{{ movie.name }}</span>
            <span class="suggestion-year">{{ movie.year }}</span>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import { debounce } from "lodash";

export default {
  name: "MovieSearch",
  data() {
    return {
      searchQuery: "",
      searchResults: [],
      isLoading: false,
    };
  },
  methods: {
    async fetchSearchResults() {
      if (this.searchQuery.length < 2) {
        this.searchResults = [];
        return;
      }

      try {
        const response = await axios.get("https://ophim1.com/v1/api/tim-kiem", {
          params: {
            keyword: this.searchQuery,
            limit: 20,
          },
        });

        if (response.data && response.data.data && response.data.data.items) {
          const normalizedQuery = this.searchQuery.toLowerCase().trim();

          this.searchResults = response.data.data.items.filter(
            (movie) =>
              movie.name.toLowerCase().includes(normalizedQuery) ||
              (movie.origin_name &&
                movie.origin_name.toLowerCase().includes(normalizedQuery))
          );

          console.log("Filtered Search Results:", this.searchResults);
        } else {
          console.error("Không có dữ liệu từ API");
          this.searchResults = [];
        }
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
        this.searchResults = [];
      }
    },

    selectMovie(movie) {
      if (movie && movie.slug) {
        this.$router.push({
          name: "movie-detail",
          params: { slug: movie.slug },
        });

        this.searchResults = [];
        this.searchQuery = "";
      } else {
        console.error("Slug không hợp lệ:", movie);
      }
    },

    debounceSearch: debounce(function () {
      this.fetchSearchResults();
    }, 300),
    searchOnButtonClick() {
      if (this.searchQuery.length > 0) {
        this.$router.push({
          name: "search-results",
          query: { q: this.searchQuery }, 
        });
      }
    },
    clearSearchResults() {
      this.searchResults = [];
      this.searchQuery = "";
    },

  },
};
</script>
<style scoped>
.movie-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  width: 100%;
}

.search-suggestions {
  padding: 0 !important;
}

.clear-results {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  cursor: pointer;
  font-size: 18px;
  color: #888;
}

.clear-results:hover {
  color: #ff0000;
}

.suggestion-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.search-container {
  margin-right: 90px;
  position: relative;
  width: 300px;
}

.search-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  height: 40px;
}

.search-input {
  flex-grow: 1;
  padding: 10px;
  border: none;
  outline: none;
  font-size: 16px;
}

.search-button {
  background: none;
  border: none;
  padding: 10px;
  cursor: pointer;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 10px 10px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.suggestion-item:hover {
  background-color: #f0f0f0;
}

.suggestion-poster {
  width: 50px;
  height: 75px;
  object-fit: cover;
  margin-right: 10px;
}

.suggestion-details {
  display: flex;
  flex-direction: column;
}

.suggestion-name {
  font-weight: bold;
}

.suggestion-year {
  color: #888;
  font-size: 0.8em;
}

/* Dark mode styles */
body.dark .search-container,
body.dark .search-input,
body.dark .search-suggestions {
  background-color: #303030;
  color: white;
  border-color: #555;
}

body.dark .suggestion-item:hover {
  background-color: #404040;
}
</style>
