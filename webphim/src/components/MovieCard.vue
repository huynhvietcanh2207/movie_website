<template>
  <div class="card">
    <router-link :to="'/movie/' + movie.slug" v-if="movie && movie.poster_url">
      <div class="card-image">
        <img
          :src="getPosterUrl(movie.poster_url)"
          :alt="movie.title"
          class="movie-poster"
        />
        <div class="card-overlay">
          <h5 class="card-title">{{ movie.name }}</h5>
          <p class="card-text">
            Số Tập: <b>{{ episodeCurrentDisplay }}</b>
          </p>
        </div>
        <span class="banner">Vietsub - HD</span>
      </div>
    </router-link>
  </div>
</template>

<script>
import axios from "axios"; 

export default {
  name: "MovieCard",
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      episodeCurrentDisplay: "Đang cập nhật",
    };
  },
  mounted() {
    this.fetchMovieDetails();
  },
  methods: {
    fetchMovieDetails() {
      const movieSlug = this.movie.slug;
      axios
        .get(`https://ophim1.com/phim/${movieSlug}`)
        .then((response) => {
          const movieDetails = response.data;
          if (movieDetails && movieDetails.episode_current) {
            this.episodeCurrentDisplay = movieDetails.episode_current;
          } else {
            this.episodeCurrentDisplay = "Đang cập nhật";
          }
        })
        .catch((error) => {
          console.error("Error fetching movie details:", error);
          this.episodeCurrentDisplay = "Đang cập nhật"; 
        });
    },

    getPosterUrl(posterUrl) {
      const baseUrl = "http://img.ophim1.com/uploads/movies/";
      if (posterUrl.startsWith("http")) {
        return posterUrl; 
      }
      return baseUrl + posterUrl; 
    },
  },
};
</script>


<style scoped>
.card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 30px 5px 5px 5px;
  text-decoration: none !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 220px;
  padding: 0;
  height: 300px;
  background-color: #fff;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(237, 55, 55, 0.2);
}

.card-image {
  position: relative;
  width: 100%;
  height: 300px;
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.card-overlay {
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: #0c0101;
  color: white;
  padding: 4px;
  border-radius: 8px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 2px;
  color: #fff;
  /*từ đây*/
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /*dau 3 cham*/
  max-width: 200px;
}

.card-text {
  font-size: 0.7rem;
  color: #fff;
}

.banner {
  position: absolute;
  top: 3px;
  left: 3px;
  background: linear-gradient(
    45deg,
    /* Góc xoay 45 độ */ rgba(163, 39, 39, 0.7),
    rgba(39, 39, 163, 0.7)
  );

  color: white;
  font-size: 0.8rem;
  padding: 5px 10px;
  border-radius: 8px 0px;
}

.card-body {
  display: none;
}

/* //dark mode */

.card {
  background-color: #f9f9f9;
  color: #000;
  transition: background-color 0.3s, color 0.3s;
}

body.dark .card {
  background-color: #1e1e1e;
  color: #fff;
}

.card-title {
  color: #ce1717;
  transition: color 0.3s;
}

body.dark .card-title {
  color: #ffa500;
}

/* Nội dung phụ */
.card-text {
  color: #ffffff;
  transition: color 0.3s;
}

body.dark .card-text {
  color: #ddd;
}
</style>
