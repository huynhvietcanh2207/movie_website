import { createRouter, createWebHistory } from 'vue-router';
import MovieList from '../components/MovieList.vue';
import MovieDetail from '../components/MovieDetail.vue';
import MovieCategory from '../components/MovieCategory.vue';  
import SearchResults from "../components/SearchResults.vue"; 

const routes = [
  {
    path: '/',
    name: 'home',
    component: MovieList
  },
    {
      path: "/search-results",
      name: "search-results",
      component: SearchResults,
      props: true

    },
  {
    path: '/movie/:slug',
    name: 'movie-detail',
    component: MovieDetail,
    props: true
  },
  {
    path: '/category/:slug',   // Route cho thể loại
    name: 'Category',
    component: MovieCategory,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
