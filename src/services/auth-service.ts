import MissingParamError from "../utils/errors/MissingParam";
import {iEncrypter, iLoadUserByEmailRepository, iAuthService, iTokenManager} from "../utils/interfaces";

class AuthService implements iAuthService {
	constructor(
    private loadUserByRepository: iLoadUserByEmailRepository,
    private encrypter: iEncrypter,
    private tokenManager: iTokenManager
	){}

	async authenticate(email: string, password: string): Promise<string | null> {
		if(!email)
			throw new MissingParamError("email");
    
		if(!password)
			throw new MissingParamError("password");

		const user = await this.loadUserByRepository.load(email);

		if(!user){return null;}
		if(!await this.encrypter.compare(password, user.password)){return null;}
    
		const acessToken = this.tokenManager.generate(user.id);

		return acessToken;
	}
}

export default AuthService;