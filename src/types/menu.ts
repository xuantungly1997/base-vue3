export interface MenuItem {
    name: string;
    path?: string; // Có thể không có path nếu nó chỉ là 1 cái group/folder chứa menu con
    icon?: string; // Dành cho icon sau này
    children?: MenuItem[]; // Mảng chứa các menu con (đệ quy)
  }