import iEncrypter from "../interfaces/encrypter";
import iLoadUserByEmailRepository from "../interfaces/load-user-by-email-repository";
import iAuthService from "../interfaces/auth-service";
import MissingParamError from "../utils/errors/MissingParam";
import iTokenManager from "../interfaces/token-manager";

class AuthService implements iAuthService {
  constructor(
    private loadUserByRepository: iLoadUserByEmailRepository,
    private encrypter: iEncrypter,
    private tokenManager: iTokenManager
  ){}

  async authenticate(email: string, password: string): Promise<String | null> {
    if(!email)
      throw new MissingParamError('email');
    
    if(!password)
      throw new MissingParamError('password')

    const user = await this.loadUserByRepository.load(email);

    if(!user){return null}
    if(!await this.encrypter.compare(password, user.password)){return null}
    
    const acessToken = this.tokenManager.generate(user.id);

    return acessToken;
  }
}

export default AuthService;