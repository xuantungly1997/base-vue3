import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/store/useAuthStore';

// Lấy Layout dùng chung
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: DefaultLayout,
    // TẤT CẢ các page trong admin đều nằm cùng 1 cấp ở đây
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/Home.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard.vue'),
        meta: { requiresAuth: true }
      },
      // --- CÁC ROUTE MỚI THEO MENU ---
      // {
      //   path: 'users',
      //   name: 'UserManagement',
      //   // Lưu ý: Bạn cần tạo file Users.vue trong thư mục pages
      //   component: () => import('@/pages/Users.vue'), 
      //   meta: { requiresAuth: true }
      // },
      // {
      //   path: 'roles/list',
      //   name: 'RoleList',
      //   // Tạo thư mục roles và file RoleList.vue
      //   component: () => import('@/pages/roles/RoleList.vue'),
      //   meta: { requiresAuth: true }
      // },
      // {
      //   path: 'roles/permissions',
      //   name: 'RolePermissions',
      //   component: () => import('@/pages/roles/RolePermissions.vue'),
      //   meta: { requiresAuth: true }
      // },
      // {
      //   path: 'roles/permissions/advanced',
      //   name: 'AdvancedPermissions',
      //   component: () => import('@/pages/roles/AdvancedPermissions.vue'),
      //   meta: { requiresAuth: true }
      // },
      // {
      //   path: 'settings',
      //   name: 'Settings',
      //   component: () => import('@/pages/Settings.vue'),
      //   meta: { requiresAuth: true }
      // }
    ]
  },
  
  // --- CÁC ROUTE KHÔNG DÙNG DEFAULT LAYOUT ---
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }; // Tự động scroll lên đầu khi đổi trang
  }
});

// Navigation Guards (Giữ nguyên, code của bạn đã rất chuẩn)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;