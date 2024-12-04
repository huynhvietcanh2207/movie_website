<template>
  <header class="navbar navbar-expand-lg navbar-dark">
    <div :class="{ dark: isDarkMode }" class="container">
      <a class="navbar-brand" href="#">
        <img src="@/assets/logo-web1.png" alt="Logo" srcset="" />
      </a>

      <div class="collapse navbar-collapse">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Trang chủ</router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: 'Category', params: { slug: 'phim-bo' } }"
              >Phim bộ</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: 'Category', params: { slug: 'phim-le' } }"
              >Phim lẻ</router-link
            >
          </li>

          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Thể loại
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li v-for="category in allCategories" :key="category.id">
                <router-link
                  class="dropdown-item"
                  :to="{ name: 'Category', params: { slug: category.slug } }"
                >
                  {{ category.name }}
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
       <!-- Thêm component tìm kiếm vào đây -->
        <MovieSearch />
      <!-- Dark Mode Toggle -->
      <input
        type="checkbox"
        id="checkbox"
        @change="$emit('toggle-dark-mode')"
      />
    </div>
  </header>
</template>
<script>
import MovieSearch from './MovieSearch.vue' // Import component tìm kiếm

export default {
  name: "MovieHeader",
   components: {
    MovieSearch // Đăng ký component
  },
  data() {
    return {
      allCategories: [
        { id: 1, name: "Hành Động", slug: "hanh-dong" },
        { id: 2, name: "Tình Cảm", slug: "tinh-cam" },
        { id: 3, name: "Hài Hước", slug: "hai-huoc" },
        { id: 4, name: "Cổ Trang", slug: "co-trang" },
        { id: 5, name: "Tâm Lý", slug: "tam-ly" },
        { id: 6, name: "Hình Sự", slug: "hinh-su" },
        { id: 7, name: "Chiến Tranh", slug: "chien-tranh" },
        { id: 8, name: "Thể Thao", slug: "the-thao" },
        { id: 9, name: "Võ Thuật", slug: "vo-thuat" },
        { id: 10, name: "Viễn Tưởng", slug: "vien-tuong" },
        { id: 11, name: "Phiêu Lưu", slug: "phieu-luu" },
        { id: 12, name: "Khoa Học", slug: "khoa-hoc" },
        { id: 13, name: "Kinh Dị", slug: "kinh-di" },
        { id: 14, name: "Âm Nhạc", slug: "am-nhac" },
        { id: 15, name: "Thần Thoại", slug: "than-thoai" },
        { id: 16, name: "Tài Liệu", slug: "tai-lieu" },
        { id: 17, name: "Gia Đình", slug: "gia-dinh" },
        { id: 18, name: "Chính Kịch", slug: "chinh-kich" },
        { id: 19, name: "Bí Ẩn", slug: "bi-an" },
        { id: 20, name: "Học Đường", slug: "hoc-duong" },
        { id: 21, name: "Kinh Điển", slug: "kinh-dien" },
        { id: 22, name: "Phim 18+", slug: "phim-18" },
      ],
    };
  },
};
</script>
<style scoped>
.navbar {
  margin-bottom: 20px;
}

.navbar-nav .nav-item {
  margin-left: 20px;
}

.nav-item.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu {
  display: none;
  column-count: 3;
  column-gap: 10px;
  width: 400px;
}

.dropdown-item {
  display: block;
  padding: 8px 16px;
  text-align: left;
  font-size: 14px;
  border: 1px solid #ffffff;
  border-radius: 5px;
  margin-bottom: 5px;
}

.dropdown-item:hover {
  background-color: #ee8a16;
  color: white;
  border-color: #fb8c00;
  border-radius: 5px;
  margin-bottom: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dropdown-menu {
  padding: 10px;
  column-count: 3;
  column-gap: 10px;
  width: 400px;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Dark Mode styles */
body.dark .dropdown-item {
  color: white;
  border: 1px solid #000000;
}
body.dark .dropdown-menu {
  background-color: rgb(0, 0, 0);
  color: white;
}
body.dark {
  background: #303030;
  color: white;
}
header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #f4f4f4;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
body.dark header {
  background: #212b36;
}
.navbar-brand {
  background: #f4f4f4;
  padding: 0;
}
.navbar-brand img {
  width: 200px;
  height: 50px;
  object-fit: cover;
}
body.dark .navbar-brand img {
  background: #212b36;
}

/* body.dark .navbar-brand {
    color: white;

} */
.nav-link {
  color: #e2491a !important;
  font-size: 20px !important;
  font-weight: bold !important; /* Đảm bảo in đậm */
}

.nav-link:hover {
  color: #67e7d4ef;
}
header .nav-item:hover .nav-link {
  color: #1af0e9 !important;
}

body.dark .nav-link {
  color: rgb(211, 113, 38) !important;
}
#checkbox {
  position: relative;
  appearance: none;
  outline: none;
  width: 80px;
  height: 40px;
  border-radius: 20px;
  background: #c3c3c3;
  box-shadow: none;
  cursor: pointer;
  overflow: hidden;
  transition: 0.3s ease-in-out;
}

#checkbox:checked {
  background: #8000c9;
}

#checkbox::before {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  border-radius: inherit;
  width: 36px;
  height: 36px;
  background: #ffff00;
  transition: inherit;
}

#checkbox::after {
  content: "";
  position: absolute;
  top: -6px;
  right: calc(100% + 36px);
  border-radius: inherit;
  width: 36px;
  height: 36px;
  background: #c3c3c3;
  transition: inherit;
}

#checkbox:checked::before {
  left: calc(100% - 38px);
  background: #cccccc;
}

#checkbox:checked::after {
  right: 12px;
  background: #8000c9;
}
</style>
