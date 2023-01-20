import {iTokenManager} from '../utils/interfaces';
import { HttpRes } from '../utils/types/Http-types';

class AuthMiddleware {
  constructor (private readonly tokenManager: iTokenManager){}
  
  verifyToken(token: string){
    if(!this.tokenManager || !this.tokenManager.verify)
     throw new Error("Invalid TokenGenerator");

    const verifyResult = this.tokenManager.verify(token);
    
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

    expect(()=>{sut.verifyToken("any_token")}).toThrow(new Error("Invalid TokenGenerator"))
  })

  test('should return 401 if invalid token is sent', () => {
    const {tokenManager, sut} = makeSut();

    tokenManager.verifyReturns = "token expired";

    const httpResponse = sut.verifyToken("invalid_token") as HttpRes;
    
    expect(httpResponse.body).toBe("token expired");
    expect(httpResponse.statusCode).toBe(401);
  })

  test("should return userId if correct token has sent", () => {
    const {sut} = makeSut();

    const userId = sut.verifyToken("valid_token");

    expect(typeof userId === "string").toBe(true);
  })
})