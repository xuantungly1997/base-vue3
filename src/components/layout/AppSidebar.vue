<template>
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      <!-- Logo App -->
      <div class="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
        <h1 class="text-xl font-bold text-blue-600">Vue 3 Base</h1>
      </div>
  
      <!-- Danh sách Menu -->
      <nav class="flex-1 overflow-y-auto py-4 px-3">
        <!-- Chỉ cần v-for ở cấp ngoài cùng -->
        <SidebarItem
          v-for="(menu, index) in menuData"
          :key="index"
          :item="menu"
        />
      </nav>
    </aside>
  </template>
  
  <script setup lang="ts">
  import type { MenuItem } from '@/types/menu';
  import SidebarItem from './SidebarItem.vue'; // Nhúng component con vào
  
  // Đây là cấu trúc dữ liệu có thể sâu vô tận (N-levels)
  const menuData: MenuItem[] = [
    {
      name: 'Trang chủ',
      path: '/',
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
    },
    {
      name: 'Quản trị hệ thống', // Thằng này là 1 group, không có path
      children: [
        {
          name: 'Quản lý Users',
          path: '/users',
        },
        {
          name: 'Phân quyền Role', // Menu này có cấp con nữa (Cấp 3)
          children: [
            {
              name: 'Danh sách Role',
              path: '/roles/list',
            },
          ]
        }
      ]
    },
    {
      name: 'Cài đặt (Settings)',
      path: '/settings',
    }
  ];
  </script>