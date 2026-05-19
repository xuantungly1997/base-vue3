<template>
    <div class="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h2 class="text-3xl font-semibold mb-4 text-gray-800">Trang chủ</h2>
      <p class="text-gray-600 text-lg">
        Chúc mừng bạn đã đăng nhập thành công và vượt qua Router Guard! 🎉
      </p>

      <p class="text-secondary">Đoạn văn này màu xanh lá (#10b981)</p>

      <div class="bg-primary-light p-4 rounded">Khối này có nền màu xanh</div>

      <p class="text-body-base font-weight-big">body-base: {{ name }}</p>

      <button @click="changeName">click</button>

    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  const user = ref({
    name: 'tung',
    age: 28
  })

  let {name, age} = user.value

  const changeName = () => {
    user.value.name = 'quaynh'

    console.log(name , user.value);
    
  }
  // Logic của trang Home ở đây
  </script>