import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // Lấy token từ localStorage nếu có
  const token = ref<string | null>(localStorage.getItem('token') || null);

  const userRole = ref<string>('admin')

  // Getter kiểm tra xem đã đăng nhập chưa
  const isAuthenticated = computed(() => !!token.value);

  // Action: Xử lý đăng nhập (Mock API)
  async function login(username: string, pass: string) {
    return new Promise<void>((resolve, reject) => {
      // Giả lập thời gian call API mất 1 giây
      setTimeout(() => {
        if (username === 'admin' && pass === '123456') {
          const fakeToken = 'fake-jwt-token-123';
          token.value = fakeToken;
          localStorage.setItem('token', fakeToken); // Lưu token để F5 không bị mất
          resolve();
        } else {
          reject(new Error('Sai tài khoản hoặc mật khẩu!'));
        }
      }, 1000); 
    });
  }

  // Action: Đăng xuất
  function logout() {
    token.value = null;
    localStorage.removeItem('token');
  }

  return { token, userRole, isAuthenticated, login, logout };
});