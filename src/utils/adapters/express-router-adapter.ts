import Controller from "../interfaces/controller";
import { Request, Response} from "express";
import { HttpReq, HttpRes } from "../types/Http-types";

export default class ExpressRouterAdapter {
	static adapt (controller : Controller){
		return  async (req: Request, res: Response) => {
      
			const httpRequest : HttpReq = {
				body: req.body,
				headers: {}
			};

			const httpResponse : HttpRes = await controller.route(httpRequest);
			res.status(httpResponse.statusCode).send(httpResponse.body);
		};
	}
}