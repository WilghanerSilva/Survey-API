import {iTokenManager} from "../utils/interfaces";
import { HttpReq } from "../utils/types/Http-types";
import HttpResponse from "../utils/HttpResponse";
import InvalidDependencyError from "../utils/errors/InvalidDependency";

export default class AuthMiddleware {
	constructor (private readonly tokenManager: iTokenManager){}
  
	verifyToken(httpRequest: HttpReq){
		const {authorization} = httpRequest.headers;
		const regex = new RegExp("Bearer");

		if(!authorization)
			return HttpResponse.unauthorized("Missing token");

		if(typeof authorization !== "string")
			return HttpResponse.unauthorized("Unauthorized");

		if(!this.tokenManager || !this.tokenManager.verify){
			console.error(new InvalidDependencyError("Invalid TokenManager"));
			return HttpResponse.serverError();
		}

		const authorizationSplit = authorization.split(" ");

		if(!regex.test(authorizationSplit[0]))
			return HttpResponse.unauthorized("Invalid token");

		const verifyResult = this.tokenManager.verify(authorizationSplit[1]);
    
		if(typeof verifyResult === "string")
			return HttpResponse.unauthorized(verifyResult);

		return verifyResult.userId;
	}
}