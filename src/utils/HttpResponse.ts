import MissingParamError from "./errors/MissingParam";
import { HttpRes } from "./types/Http-types";

export default class HttpResponse{
	static badRequest(paramName: string): HttpRes{
		return {
			statusCode: 400,
			body: new MissingParamError(paramName)
		};
	}

	static serverError(): HttpRes{
		return {
			statusCode: 500,
			body: "An internal error has ocurred"
		};
	}

	static unauthorized(message: string): HttpRes{
		return {
			statusCode: 401,
			body: message
		};
	}

	static ok(body: object): HttpRes{
		return {
			statusCode: 200,
			body: body
		};
	}
}