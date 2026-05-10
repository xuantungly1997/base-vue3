<template>
  <div class="h-screen flex bg-gray-50 overflow-hidden">
    
    <!-- 1. Nhúng Sidebar vào bên trái -->
    <AppSidebar />

    <!-- 2. Vùng nội dung bên phải -->
    <div class="flex-1 flex flex-col overflow-hidden">
      
      <!-- Header nằm trên cùng bên phải -->
      <header class="bg-white shadow-sm h-16 px-6 flex justify-between items-center z-10 relative">
        <h2 class="text-lg font-semibold text-gray-800">
          <!-- Có thể hiển thị tên trang động ở đây nếu muốn -->
          {{ currentRouteName }}
        </h2>
        
        <div class="flex items-center gap-4">
          <div class="text-sm text-gray-600">Xin chào, Admin</div>
          <button 
            @click="handleLogout" 
            class="text-sm font-medium px-3 py-1.5 rounded text-red-600 hover:bg-red-50 transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </header>
  
      <!-- Vùng render trang con (Home, Dashboard...) có thanh cuộn riêng -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
        <!-- transition giúp chuyển trang mượt mà hơn -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

    </div>
  </div>
</template>
  
<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/useAuthStore';
import AppSidebar from '@/components/layout/AppSidebar.vue'; // Import component Sidebar

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Lấy tên route hiện tại để hiển thị lên Header cho đẹp
const currentRouteName = computed(() => {
  // Map path ra tên tiếng Việt
  const path = route.path;
  if (path === '/') return 'Trang chủ';
  if (path.includes('/dashboard')) return 'Dashboard';
  return 'Quản trị';
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login'); 
};
</script>

<style scoped>
/* CSS cho hiệu ứng chuyển trang (Transition) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>