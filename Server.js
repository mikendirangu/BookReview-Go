const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hello from server.js!'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// const jsonServer = require('json-Server');
// const server = jsonServer.create();
// const router = jsonServer.router('db.json');
// const middlewares = jsonServer.defaults();

// Server.use(middlewares);
// Server.use(router);

// const port = process.env.PORT || 3000;
// server.listen(port, () => {
//   console.log(`JSON Server is running on port ${port}`);
// });
