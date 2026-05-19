import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const PORT = Number(process.env.SOCKET_MOCK_PORT || 3333);
const ROOM = 'lobby';
const MAX_MESSAGES = 200;

const httpServer = createServer();
const io = new Server(httpServer, {
  path: '/socket.io',
  cors: { origin: true },
});

/** @type {Array<{ id: string; text: string; at: string; senderId: string; senderLabel: string; kind: 'user' | 'bot' | 'system' }>} */
const chatHistory = [];

function pushMessage(msg) {
  chatHistory.push(msg);
  if (chatHistory.length > MAX_MESSAGES) chatHistory.splice(0, chatHistory.length - MAX_MESSAGES);
}

const SEED_MESSAGES = [
  {
    id: 'seed-1',
    text: 'Chào bạn — đây là phòng chat mock qua Socket.IO.',
    senderId: 'system',
    senderLabel: 'Hệ thống',
    kind: 'system',
  },
  {
    id: 'seed-2',
    text: 'Mở thêm một tab trình duyệt nữa để thấy tin nhắn đồng bộ giữa các client.',
    senderId: 'mock-bot',
    senderLabel: 'Bot hệ thống',
    kind: 'bot',
  },
  {
    id: 'seed-3',
    text: 'Gửi tin bên dưới, bot sẽ trả lời ngẫu nhiên sau vài giây.',
    senderId: 'mock-bot',
    senderLabel: 'Bot hệ thống',
    kind: 'bot',
  },
];

for (const s of SEED_MESSAGES) {
  pushMessage({ ...s, at: new Date().toISOString() });
}

const BOT_REPLIES = [
  'Đã nhận (mock).',
  'Ok bạn nhé!',
  'Server đang chạy local, dữ liệu không lưu DB.',
  'Thử mở 2 tab xem tin có realtime không nhé.',
  'Socket.IO đang hoạt động tốt.',
  '👍',
];

function pickBotReply(userText) {
  const i = Math.floor(Math.random() * BOT_REPLIES.length);
  const base = BOT_REPLIES[i];
  if (userText.length <= 40) return `${base} Bạn vừa gửi: «${userText}»`;
  return `${base} (tin của bạn hơi dài nên bot không trích nguyên văn.)`;
}

io.on('connection', (socket) => {
  socket.join(ROOM);

  socket.emit('server:welcome', {
    message: 'Đã vào phòng chat mock',
    socketId: socket.id,
    room: ROOM,
    serverTime: new Date().toISOString(),
  });

  socket.emit('chat:history', [...chatHistory]);

  socket.on('chat:message', (payload) => {
    const text = String(payload?.text ?? '').trim().slice(0, 2000);
    if (!text) return;

    const displayName = String(payload?.displayName ?? '').trim().slice(0, 40);
    const msg = {
      id: randomUUID(),
      text,
      at: new Date().toISOString(),
      senderId: socket.id,
      senderLabel: displayName || `Khách ${socket.id.slice(0, 6)}`,
      kind: 'user',
    };
    pushMessage(msg);
    io.to(ROOM).emit('chat:message', msg);

    const delay = 500 + Math.random() * 900;
    setTimeout(() => {
      const reply = {
        id: randomUUID(),
        text: pickBotReply(text),
        at: new Date().toISOString(),
        senderId: 'mock-bot',
        senderLabel: 'Bot hệ thống',
        kind: 'bot',
      };
      pushMessage(reply);
      io.to(ROOM).emit('chat:message', reply);
    }, delay);
  });

  socket.on('client:ping', (payload) => {
    socket.emit('server:pong', {
      echo: payload,
      serverTime: new Date().toISOString(),
    });
  });
});

httpServer.listen(PORT, () => {
  console.log(`[mock-socket] chat mock on http://127.0.0.1:${PORT} (path /socket.io, room ${ROOM})`);
});
