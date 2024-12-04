<template>
  <footer :class="{ dark: isDarkMode }" class="movie-footer">
    <div class="footer-content container">
      <div class="footer-logo">
        <a class="navbar-brand" href="#">
          <img src="@/assets/logo-web1.png" alt="Logo" />
        </a>
        <p>Web xem phim hàng đầu, nơi bạn có thể thưởng thức những bộ phim hấp dẫn.</p>
      </div>
      <div class="footer-links">
        <h5>Liên kết hữu ích</h5>
        <ul>
          <li><a href="#">Trang chủ</a></li>
          <li><a href="#">Phim mới</a></li>
          <li><a href="#">Thể loại</a></li>
          <li><a href="#">Liên hệ</a></li>
        </ul>
      </div>
      <div class="footer-social">
        <h5>Kết nối với chúng tôi</h5>
        <div class="social-icons">
          <a href="https://www.facebook.com/viet.canh.2207"><i class="fab fa-facebook"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-youtube"></i></a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 PhimChill.Huỳnh Viết Cảnh</p>
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style scoped>
.dark .movie-footer {
  background-color: #000000;
 color: #ffffff;
 }
.dark .footer-links a {
  color: #ffffff;
  text-decoration: none;
  transition: color 0.3s;
}
.movie-footer {
  background: #f4f4f4;
  color: #000000;
  padding: 20px 0;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.footer-logo img {
  max-width: 150px;
  margin-bottom: 10px;
}

.footer-logo p {
  font-size: 14px;
  margin: 0;
  line-height: 1.6;
}

.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: #000000;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #007bff;
}

.footer-social .social-icons {
  display: flex;
  gap: 15px;
}

.footer-social a {
  color: #2392f9;
  font-size: 28px;
  transition: color 0.3s;
}

.footer-social a:hover {
  color: #e8bf19;
}

.footer-bottom {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  border-top: 1px solid #3c4756;
  padding-top: 10px;
}
footer{
    margin-top:100px ;
}
</style>
