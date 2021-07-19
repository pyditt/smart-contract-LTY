const WebSocket = require("ws");

const wsServer = new WebSocket.Server({ port: 9000 });

wsServer.on("connection", (ws) => {
  console.log("Новый пользователь");
  console.log(wsServer.clients.size);
  wsServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(wsServer.clients.size);
    }
  });
  ws.on("message", function (message) {
    /* обработчик сообщений от клиента */
  });
  ws.on("close", function () {
    // отправка уведомления в консоль
    console.log("Пользователь отключился");
    wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(wsServer.clients.size);
      }
    });
  });
});
