import AuthController from "../../controllers/auth-controller";
import { LoadUserByEmailRepository } from "../../repositories/load-user-by-email-repository";
import AuthService from "../../services/auth-service";
import TokenManager from "../../utils/helpers/token-manager";
import Encrypter from "../../utils/helpers/encrypter";
import EmailValidator from "../../utils/helpers/email-validator";

class AuthControllerComposer {
	static compose () {
		const loadUserByEmailRepo = new LoadUserByEmailRepository();
		const tokenManager = new TokenManager();
		const encrypter = new Encrypter();
		const emailValidator = new EmailValidator();
		const authService = new AuthService(
			loadUserByEmailRepo,
			encrypter,
			tokenManager
		);

		return new AuthController(emailValidator, authService);
	}
}

export default AuthControllerComposer;