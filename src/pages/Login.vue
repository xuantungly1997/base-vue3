<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Đăng Nhập</h2>
        
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700">Tài khoản</label>
            <input 
              v-model="username" 
              type="text" 
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập: admin"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input 
              v-model="password" 
              type="password" 
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập: 123456"
              required
            />
          </div>
  
          <!-- Hiển thị lỗi nếu sai pass -->
          <div v-if="errorMessage" class="text-red-500 text-sm text-center">
            {{ errorMessage }}
          </div>
  
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <span v-if="isLoading">Đang xử lý...</span>
            <span v-else>Đăng nhập</span>
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAuthStore } from '@/store/useAuthStore';
  
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  
  // Trạng thái của form
  const username = ref('admin'); // Đặt sẵn để test cho nhanh
  const password = ref('123456');
  const isLoading = ref(false);
  const errorMessage = ref('');
  
  const handleLogin = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
      await authStore.login(username.value, password.value);
      
      // Redirect về trang user muốn vào trước đó (hoặc về trang chủ '/')
      const redirectPath = route.query.redirect as string || '/';
      router.push(redirectPath);
    } catch (error: any) {
      errorMessage.value = error.message;
    } finally {
      isLoading.value = false;
    }
  };
  </script>