import {iTokenManager} from "../utils/interfaces";
import { HttpRes } from "../utils/types/Http-types";
import AuthMiddleware from "./auth-middleware";

class TokenManagerSpy implements iTokenManager {
	public verifyReturns : string | { userId: string} = { userId: "any_id"};
	public token = "";

	verify(token: string): string | { userId: string; } {
		this.token = token;
		return this.verifyReturns;
	}

	generate(userId: string): string {
		return userId;
	}
}

const makeSut = () => {
	const tokenManager = new TokenManagerSpy();
	const sut = new AuthMiddleware(tokenManager);

	return {sut, tokenManager};
};


describe("AuthMiddleware", () => {
	test("should return 500 if invalid token manager has sent", () => {
		const tokenManager = {} as iTokenManager;
		const sut = new AuthMiddleware(tokenManager);

		const httpReq = {
			body: {},
			headers: {
				authorization: "Bearer any_token"
			}
		};

		const httpResponse = sut.verifyToken(httpReq) as HttpRes;

		expect(httpResponse.statusCode).toEqual(500);
	});

	test("should return 401 and invalid token on body if invalid token has sent", () => {
		const {sut} = makeSut();

		const httpReq = {
			body: {},
			headers: {
				authorization: "invalid any_token"
			}
		};

		const httpResponse = sut.verifyToken(httpReq) as HttpRes;
    
		expect(httpResponse.body).toBe("Invalid token");
		expect(httpResponse.statusCode).toBe(401);
	});

	test("should return 401 and missing token on body if no token has providade", () => {
		const {sut} = makeSut();

		const httpReq = {
			body: {},
			headers: {
			}
		};

		const httpResponse = sut.verifyToken(httpReq) as HttpRes;

		expect(httpResponse.statusCode).toBe(401);
		expect(httpResponse.body).toBe("Missing token");
	});

	test("should return 401 and unauthorized if invalid authorization has sent", () => {
		const {sut} = makeSut();

		const httpReq = {
			body: {},
			headers: {
				authorization: 1
			}
		};

		const httpResponse = sut.verifyToken(httpReq) as HttpRes;

		expect(httpResponse.statusCode).toBe(401);
		expect(httpResponse.body).toBe("Unauthorized");
	});

	test("should return 401 and expired token if invalid token has sent", () => {
		const {sut, tokenManager} = makeSut();

		tokenManager.verifyReturns = "Expired token";

		const httpReq = {
			body: {},
			headers: {
				authorization: "Bearer invalid_invalid token"
			}
		};

		const httpResponse = sut.verifyToken(httpReq) as HttpRes;

		expect(httpResponse.statusCode).toBe(401);
		expect(httpResponse.body).toBe("Expired token");
	});

	test("should return userId if correct token has sent", () => {
		const {sut} = makeSut();

		const httpReq = {
			body: {},
			headers: {
				authorization: "Bearer any_token"
			}
		};

		const userId = sut.verifyToken(httpReq);

		expect(typeof userId === "string").toBe(true);
	});

	test("should pass the parameters correctly to the TokenManager", () => {
		const { sut, tokenManager} = makeSut();

		const httpReq = {
			body: {},
			headers: {
				authorization: "Bearer any_token"
			}
		};

		sut.verifyToken(httpReq);

		expect(tokenManager.token).toEqual("any_token");
	});
});