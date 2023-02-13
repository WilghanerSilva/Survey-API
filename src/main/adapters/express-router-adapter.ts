import { Request, Response } from "express";
import {iController} from "../../utils/interfaces";
import { HttpReq, HttpRes } from "../../utils/types/Http-types";

class ExpressRouterAdapter {
	static adapt(controller: iController) {

		return async (req: Request, res: Response) => {
			const httpReq: HttpReq = {
				body: req.body,
				headers: req.headers
			};

			const httpRes: HttpRes = await controller.route(httpReq);

			res.status(httpRes.statusCode).send(httpRes.body);
		};
	}
}

export default ExpressRouterAdapter;