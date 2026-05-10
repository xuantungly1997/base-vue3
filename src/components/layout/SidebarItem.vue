<template>
    <div>
      <!-- TRƯỜNG HỢP 1: Menu KHÔNG CÓ menu con (Là Link bấm được) -->
      <router-link
        v-if="!item.children || item.children.length === 0"
        :to="item.path || '#'"
        class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1"
        :class="[
          isActive(item.path)
            ? 'bg-blue-50 text-blue-700' // Đang chọn
            : 'text-gray-700 hover:bg-gray-100' // Bình thường
        ]"
      >
        {{ item.name }}
      </router-link>
  
      <!-- TRƯỜNG HỢP 2: Menu CÓ menu con (Là nút Dropdown) -->
      <div v-else class="mb-1">
        <button
          @click="toggleOpen"
          class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          :class="{ 'bg-gray-50': isOpen }"
        >
          <span>{{ item.name }}</span>
          
          <!-- Mũi tên chỉ xuống, xoay 180 độ khi mở -->
          <svg
            class="w-4 h-4 transition-transform duration-200"
            :class="isOpen ? 'rotate-180' : ''"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
  
        <!-- Gọi ĐỆ QUY: Tự gọi lại chính nó để render các menu con -->
        <!-- Sử dụng Transition/v-show để làm hiệu ứng đóng mở -->
        <div v-show="isOpen" class="pl-4 mt-1 border-l ml-3 border-gray-200">
          <SidebarItem
            v-for="(child, index) in item.children"
            :key="index"
            :item="child"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import type { MenuItem } from '@/types/menu';
  
  const props = defineProps<{
    item: MenuItem;
  }>();
  
  const route = useRoute();
  const isOpen = ref(false);
  
  const toggleOpen = () => {
    isOpen.value = !isOpen.value;
  };
  
  // Hàm check xem đường dẫn hiện tại có khớp với menu không
  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === '/') return route.path === '/';
    return route.path === path || route.path.startsWith(path + '/');
  };
  
  // Hàm đệ quy kiểm tra xem trong đống menu con, có thằng nào đang active không
  // Nếu có, thằng cha phải tự động mở ra (isOpen = true) khi vừa load web
  const checkHasActiveChild = (menu: MenuItem): boolean => {
    if (isActive(menu.path)) return true;
    if (menu.children) {
      return menu.children.some(child => checkHasActiveChild(child));
    }
    return false;
  };
  
  onMounted(() => {
    if (props.item.children) {
      isOpen.value = checkHasActiveChild(props.item);
    }
  });
  </script>