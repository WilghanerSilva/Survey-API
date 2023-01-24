import MissingParamError from "../utils/errors/MissingParam";
import { 
	iLoadUserByEmailRepository, 
	iSingupService, 
	iCreateUserRepository, 
	iEncrypter 
} from "../utils/interfaces";

class SingupService implements iSingupService {
	constructor(
    private readonly loadUserByEmailRepository: iLoadUserByEmailRepository,
    private readonly createUserRepository: iCreateUserRepository,
    private readonly encrypter: iEncrypter
	){}

	async sing(name: string, email: string, password: string): Promise<boolean> {
		if(!name){throw new MissingParamError("name");};
		if(!email){throw new MissingParamError("email");};
		if(!password){throw new MissingParamError("password");};
    
		if(!this.loadUserByEmailRepository || !this.loadUserByEmailRepository.load)
			throw new Error("Invalid LoadUserByEmailRepository");
    
		if(!this.createUserRepository || !this.createUserRepository.create)
			throw new Error("Invalid CreateUserRepository");
    
		if(!this.encrypter || !this.encrypter.crypt)
			throw new Error("Invalid Encrypter");

		if(await this.loadUserByEmailRepository.load(email))
			return false;

		const hashedPassword = await this.encrypter.crypt(password);
		await this.createUserRepository.create({
			name,
			email,
			password: hashedPassword
		});
    
		return true;
	}
}

export default SingupService;