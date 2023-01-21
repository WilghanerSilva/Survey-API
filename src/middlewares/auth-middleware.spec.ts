import {iTokenManager} from '../utils/interfaces';
import { HttpRes, HttpReq } from '../utils/types/Http-types';

class AuthMiddleware {
  constructor (private readonly tokenManager: iTokenManager){}
  
  verifyToken(httpRequest: HttpReq){
    const {authorization} = httpRequest.headers;
    const regex = new RegExp('Bearer');

    if(!authorization)
      return { statusCode: 401, body: "Missing token"};

    if(!this.tokenManager || !this.tokenManager.verify)
     throw new Error("Invalid TokenGenerator");

    const authorizationSplit = authorization.split(" ");

    if(!authorizationSplit)
      return { statusCode: 401, body: "Unauthorized"};

    if(!regex.test(authorizationSplit[0]))
      return { statusCode: 401, body: "Invalid token"};

    const verifyResult = this.tokenManager.verify(authorizationSplit[1]);
    if(typeof verifyResult === "string")
      return {statusCode: 401, body: verifyResult};

    return verifyResult.userId;
  }
}

class TokenManagerSpy implements iTokenManager {
  public verifyReturns : string | { userId: string} = { userId: "any_id"};

  verify(token: string): string | { userId: string; } {
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
}


describe('AuthMiddleware', () => {
  test('should throw if invalid token manager has sent', () => {
    const tokenManager = {} as iTokenManager;
    const sut = new AuthMiddleware(tokenManager);

    const httpReq = {
      body: {},
      headers: {
        authorization: "Bearer any_token"
      }
    }

    expect(()=>{sut.verifyToken(httpReq)}).toThrow(new Error("Invalid TokenGenerator"))
  })

  test('should return 401 and invalid on body if invalid token is sent', () => {
    const {sut} = makeSut();

    const httpReq = {
      body: {},
      headers: {
        authorization: "invalid any_token"
      }
    }

    const httpResponse = sut.verifyToken(httpReq) as HttpRes;
    
    expect(httpResponse.body).toBe("token expired");
    expect(httpResponse.statusCode).toBe(401);
  })

  test("should return userId if correct token has sent", () => {
    const {sut} = makeSut();

    const httpReq = {
      body: {},
      headers: {
        authorization: "Bearer any_token"
      }
    }

    const userId = sut.verifyToken(httpReq);

    expect(typeof userId === "string").toBe(true);
  })
})