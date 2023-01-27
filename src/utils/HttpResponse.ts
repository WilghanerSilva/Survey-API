import MissingParamError from "./errors/MissingParam";
import { HttpRes } from "./types/Http-types";

export default class HttpResponse{
	static badRequest(paramName: string): HttpRes{
		console.error(new MissingParamError(paramName));

		return {
			statusCode: 400,
			body: {
				message: `Missing param: ${paramName}`
			}
		};
	}

	static serverError(): HttpRes{
		return {
			statusCode: 500,
			body: {
				message: "An internal error has ocurred",
			}
		};
	}

	static unauthorized(message: string): HttpRes{
		return {
			statusCode: 401,
			body: {
				message,
			}
		};
	}

	static ok(data: object): HttpRes{
		return {
			statusCode: 200,
			body: {
				message: "ok",
				data
			}
		};
	}
}