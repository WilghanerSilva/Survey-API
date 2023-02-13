import Server from "./server";
import userRouter from "./main/routes/user-router";

const server = new Server(3000, [userRouter]);

server.initServer();
