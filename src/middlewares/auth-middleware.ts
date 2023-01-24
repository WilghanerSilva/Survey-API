import {iTokenManager} from "../utils/interfaces";
import { HttpReq } from "../utils/types/Http-types";

export default class AuthMiddleware {
	constructor (private readonly tokenManager: iTokenManager){}
  
	verifyToken(httpRequest: HttpReq){
		const {authorization} = httpRequest.headers;
		const regex = new RegExp("Bearer");

		if(!authorization)
			return { statusCode: 401, body: "Missing token"};

		if(typeof authorization !== "string")
			return { statusCode: 401, body: "Unauthorized"};

		if(!this.tokenManager || !this.tokenManager.verify)
			throw new Error("Invalid TokenGenerator");

		const authorizationSplit = authorization.split(" ");

		if(!regex.test(authorizationSplit[0]))
			return { statusCode: 401, body: "Invalid token"};

		const verifyResult = this.tokenManager.verify(authorizationSplit[1]);
    
		if(typeof verifyResult === "string")
			return {statusCode: 401, body: verifyResult};

		return verifyResult.userId;
	}
}