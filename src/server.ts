import express, { Router } from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

export default class Server {
	private app = app;

	private port: number;

	private routes: Router[];

	constructor(port: number, routes: Router[]) {
		this.port = port;
		this.routes = routes;
	}

	private setupRoutes(): void {
		this.routes.forEach((route) => {
			this.app.use(route);
		});
	}

	public initServer(): void {
		this.setupRoutes();
		this.app.listen(this.port, () => {
			// eslint-disable-next-line no-console
			console.log(`Server running at ${this.port}`);
		});
	}
}
