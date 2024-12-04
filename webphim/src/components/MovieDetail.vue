<template>
  <div :class="{ dark: isDarkMode }" class="movie-detail">
    <div class="container">
      <div class="movie-header">
        <h1>{{ movie?.name || "Chi tiết phim" }}</h1>
      </div>
      <div class="movie-content">
        <div class="movie-poster">
          <img :src="movie?.poster_url" alt="Poster" class="poster-img" />
        </div>
        <div class="movie-info">
          <p>
            <b>Thể loại:</b> {{ movie?.category.map((c) => c.name).join(", ") }}
          </p>
          <p>
            <b>Quốc gia:</b> {{ movie?.country.map((c) => c.name).join(", ") }}
          </p>
          <p><b>Đạo diễn:</b> {{ movie?.director.join(", ") }}</p>
          <p><b>Diễn viên:</b> {{ movie?.actor.join(", ") }}</p>
          <p><b>Thời lượng:</b> {{ movie?.time }}</p>
          <p><b>Năm:</b> {{ movie?.year }}</p>
          <p><b>Trạng thái:</b> {{ movie?.status }}</p>
          <p><b>Chất lượng:</b> {{ movie?.quality }}</p>
          <p><b>Ngôn ngữ:</b> {{ movie?.lang }}</p>
          <!-- <p><b>Mô tả:</b> <span v-html="movie?.content"></span></p> -->
          <p>
            <b>Trailer:</b>
            <a :href="movie?.trailer_url" target="_blank">Xem trailer</a>
          </p>
          <div class="watch-movie">
            <a
              v-if="movie?.movie_url"
              :href="movie.movie_url"
              target="_blank"
              class="watch-movie-btn"
            >
              Xem phim Ngay
            </a>
          </div>
        </div>
      </div>
      <div class="episodes">
        <div class="row">
          <!-- Danh sách tập -->
          <div class="col-4 episode-list">
            <h3>Các tập:</h3>
            <br>
            <a
              v-for="episode in episodes"
              :key="episode.name"
              :href="episode.link_embed"
              class="episode-btn"
              target="_blank"
            >
              {{ episode.name }}
            </a>
          </div>

          <!-- Mô tả phim -->
          <div class="col-8">
            <h3>Mô tả phim:</h3>
            <p v-html="movie?.content"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "MovieDetail",
  props: {
    slug: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      movie: null,
      episodes: [],
    };
  },
  async mounted() {
    try {
      const response = await fetch(`https://ophim1.com/phim/${this.slug}`);
      const data = await response.json();

      // Gán thông tin phim và tập
      this.movie = data.movie;

      // Lấy danh sách các tập
      this.episodes = data.episodes?.[0]?.server_data || [];

      // Tạo URL xem phim nếu không có trực tiếp
      if (!this.movie.movie_url && this.episodes.length > 0) {
        this.movie.movie_url = this.episodes[0]?.link_embed || null; // Lấy tập đầu tiên
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết phim:", error);
    }
  },
};
</script>

<style scoped>
.watch-movie {
  margin-top: 20px;
}

.watch-movie-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #ffa500;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none !important;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.watch-movie-btn:hover {
  background-color: #e69500;
}
.dark .movie-detail {
  background-color: #000000;
  color: #fff;
}
.dark .movie-detail p {
  background-color: #000000;
  color: #fff;
}
body.dark h1 {
  background-color: #000000;
  color: #ffa500;
}
.movie-detail {
  background-color: #f9f9f9;
  padding: 40px 0;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

.movie-header h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #ffa500;
  margin-bottom: 20px;
}

.movie-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.movie-poster {
  flex: 1;
  max-width: 100%; /* Cho phép hình ảnh chiếm toàn bộ chiều rộng */
  text-align: center; /* Căn giữa hình ảnh */
}

.poster-img {
  width: auto; 
  height: 100%; 
  max-height: 300px;
  object-fit: contain; 
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}


.movie-info {
  flex: 2;
  max-width: 70%;
  padding: 0 20px;
  font-size: 1rem;
}

.movie-info p {
  margin: 10px 0;
  color: #000000;
  word-wrap: break-word;
  white-space: normal;
  word-break: break-word;
  max-width: 100%; 
}



.episodes {
  margin-top: 40px;
}
.episode-list {
  display: flex;
  flex-wrap: wrap; /* Cho phép các nút tập xuống dòng khi không đủ không gian */
  gap: 10px; /* Khoảng cách giữa các nút */
}

.episode-btn {
  width: 50px;  /* Chiều rộng cố định */
  height: 50px; /* Chiều cao cố định */
  display: flex; /* Sử dụng flex để dễ dàng căn giữa nội dung */
  justify-content: center; /* Căn giữa theo chiều ngang */
  align-items: center; /* Căn giữa theo chiều dọc */
  text-align: center;
  background-color: #c78e24;
  color: white;
  text-decoration: none !important;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  box-sizing: border-box; /* Đảm bảo padding không làm thay đổi kích thước phần tử */
}

.episode-btn:hover {
  background-color: #0056b3;
}


/* Đảm bảo tất cả các phần tử con trong episode-list có chiều rộng phù hợp */
.episode-list > a {
  box-sizing: border-box; /* Đảm bảo padding không làm thay đổi kích thước */
}



/* Điều chỉnh khi màn hình nhỏ hơn */
@media (max-width: 768px) {
  .episode-btn {
    flex: 1 1 calc(33.33% - 10px); /* Chuyển thành 3 tập trên mỗi dòng */
  }
}

@media (max-width: 480px) {
  .episode-btn {
    flex: 1 1 calc(50% - 10px); /* Chuyển thành 2 tập trên mỗi dòng */
  }
}

h3{
  padding-right:200px ;
}

@media (max-width: 768px) {
  .movie-content {
    flex-direction: column;
    align-items: center;
  }

  .movie-info {
    max-width: 100%;
  }

  .movie-poster {
    max-width: 80%;
  }
}
</style>
