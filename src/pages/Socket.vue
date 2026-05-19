<template>
  <div class="max-w-2xl mx-auto space-y-4">
    <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <h2 class="text-xl font-semibold text-gray-800 mb-1">Chat mock (Socket.IO)</h2>
      <p class="text-gray-500 text-xs mb-4">
        Chạy
        <code class="bg-gray-100 px-1 rounded">npm run socket:mock</code>
        và
        <code class="bg-gray-100 px-1 rounded">npm run dev</code>
        — mở hai tab để thấy tin realtime.
      </p>

      <div class="flex flex-wrap items-center gap-2 mb-4">
        <span
          class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
          :class="statusBadgeClass"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass" />
          {{ statusLabel }}
        </span>
        <span v-if="connected && mySocketId" class="text-xs text-gray-400 font-mono truncate max-w-[12rem]">
          id: {{ mySocketId }}
        </span>
        <button
          type="button"
          class="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          :disabled="connected"
          @click="connect"
        >
          Kết nối
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          :disabled="!connected"
          @click="disconnect"
        >
          Ngắt
        </button>
      </div>

      <div class="flex gap-2 mb-3">
        <label class="sr-only">Tên hiển thị</label>
        <input
          v-model="displayName"
          type="text"
          maxlength="40"
          class="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-sm"
          placeholder="Tên hiển thị (tùy chọn)"
          :disabled="!connected"
        />
      </div>

      <div
        ref="listEl"
        class="border border-gray-100 rounded-xl bg-gray-50/80 p-3 space-y-2 min-h-[280px] max-h-[420px] overflow-y-auto"
      >
        <template v-if="messages.length === 0">
          <p class="text-sm text-gray-400 text-center py-12">Chưa có tin — kết nối để tải lịch sử mock.</p>
        </template>
        <div
          v-for="m in messages"
          :key="m.id"
          class="flex"
          :class="isOwn(m) ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm"
            :class="bubbleClass(m)"
          >
            <div class="text-[10px] font-medium opacity-80 mb-0.5 flex items-center gap-1.5">
              <span>{{ m.senderLabel }}</span>
              <span class="font-normal opacity-60">{{ formatTime(m.at) }}</span>
            </div>
            <p class="text-[13px] leading-snug whitespace-pre-wrap break-words">{{ m.text }}</p>
          </div>
        </div>
      </div>

      <form class="mt-3 flex gap-2" @submit.prevent="sendChat">
        <input
          v-model="draft"
          type="text"
          class="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
          placeholder="Nhập tin nhắn…"
          :disabled="!connected"
          maxlength="2000"
        />
        <button
          type="submit"
          class="shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
          :disabled="!connected || !draft.trim()"
        >
          Gửi
        </button>

      </form>
      {{ JSON.stringify(messages) }}

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { io, type Socket } from 'socket.io-client';

interface ChatMessage {
  id: string;
  text: string;
  at: string;
  senderId: string;
  senderLabel: string;
  kind: 'user' | 'bot' | 'system';
}

let socket: Socket | null = null;

const connected = ref(false);
const mySocketId = ref<string | null>(null);
const messages = ref<ChatMessage[]>([]);
const draft = ref('');
const displayName = ref('');
const listEl = ref<HTMLElement | null>(null);

const statusLabel = computed(() => (connected.value ? 'Đã kết nối' : 'Chưa kết nối'));

const statusBadgeClass = computed(() =>
  connected.value ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-600'
);

const statusDotClass = computed(() =>
  connected.value ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
);

function isOwn(m: ChatMessage) {
  return m.kind === 'user' && mySocketId.value !== null && m.senderId === mySocketId.value;
}

function bubbleClass(m: ChatMessage) {
  if (m.kind === 'system') return 'bg-slate-200 text-slate-800 rounded-tl-md';
  if (m.kind === 'bot') return 'bg-white border border-gray-200 text-gray-800 rounded-tl-md';
  if (isOwn(m)) return 'bg-blue-600 text-white rounded-tr-md';
  return 'bg-white border border-gray-200 text-gray-800 rounded-tl-md';
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

async function scrollToBottom() {
  await nextTick();
  const el = listEl.value;
  if (el) el.scrollTop = el.scrollHeight;
}

watch(
  () => messages.value.length,
  () => {
    scrollToBottom();
  }
);

function getSocketUrl(): string | undefined {
  const fromEnv = import.meta.env.VITE_SOCKET_URL as string | undefined;
  if (fromEnv) return fromEnv;
  if (import.meta.env.DEV) return window.location.origin;
  return undefined;
}

function attachHandlers(s: Socket) {
  s.on('connect', () => {
    connected.value = true;
    mySocketId.value = s.id ?? null;
  });

  s.on('disconnect', () => {
    connected.value = false;
    mySocketId.value = null;
  });

  s.on('connect_error', () => {
    connected.value = false;
    mySocketId.value = null;
  });

  s.on('chat:history', (list: unknown) => {
    if (!Array.isArray(list)) return;
    messages.value = list.filter(isChatMessage);
    scrollToBottom();
  });

  s.on('chat:message', (msg: unknown) => {
    if (!isChatMessage(msg)) return;
    messages.value = [...messages.value, msg];
  });
}

function isChatMessage(x: unknown): x is ChatMessage {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.text === 'string' &&
    typeof o.at === 'string' &&
    typeof o.senderId === 'string' &&
    typeof o.senderLabel === 'string' &&
    (o.kind === 'user' || o.kind === 'bot' || o.kind === 'system')
  );
}

function connect() {
  if (socket?.connected) return;

  const url = getSocketUrl();
  if (!url) return;

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
  }

  socket = io(url, {
    path: '/socket.io',
    autoConnect: true,
    transports: ['websocket', 'polling'],
  });

  attachHandlers(socket);
}

function disconnect() {
  socket?.disconnect();
  socket = null;
  connected.value = false;
  mySocketId.value = null;
}

function sendChat() {
  const text = draft.value.trim();
  if (!socket?.connected || !text) return;
  socket.emit('chat:message', {
    text,
    displayName: displayName.value.trim() || undefined,
  });
  draft.value = '';
}

onMounted(() => {
  if (import.meta.env.DEV) connect();
});

onBeforeUnmount(() => {
  disconnect();
});
</script>
