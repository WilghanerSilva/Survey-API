import MissingParamError from '../utils/errors/MissingParam';
import iAuthService from '../interfaces/auth-service';

class AuthService implements iAuthService {
  async authenticate(email: string, password: string): Promise<String | undefined> {
    if(!email)
      throw new MissingParamError('email');
    
    if(!password)
      throw new MissingParamError('password')
    
    return 'any_token';
  }
}
describe("Auth Service", ()=>{
  test('should throw if an empty email was sent', async () => {
    const sut = new AuthService();
    
    expect(sut.authenticate('','any_password')).rejects.toThrow(new MissingParamError("email"));
  })

  test('should throw if an empty password was sent', async () => {
    const sut = new AuthService();
    
    expect(sut.authenticate('any_email@mail.com','')).rejects.toThrow(new MissingParamError("password"));
  })
  
})