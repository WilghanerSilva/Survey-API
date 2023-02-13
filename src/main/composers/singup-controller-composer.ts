import SingupController from "../../controllers/singup-controller";
import SingupService from "../../services/singup-service";
import EmailValidator from "../../utils/helpers/email-validator";
import Encrypter from "../../utils/helpers/encrypter";
import { LoadUserByEmailRepository } from "../../repositories/load-user-by-email-repository";
import CreateUserRepository from "../../repositories/create-user-repository";


class SingupControllerComposer {
	static compose() {
		const emailValidator = new EmailValidator();
		const loadUserByEmailRepo = new LoadUserByEmailRepository();
		const createUserRepository = new CreateUserRepository();
		const encrypter = new Encrypter();
		const singupService = new SingupService(
			loadUserByEmailRepo,
			createUserRepository,
			encrypter
		); 

		return new SingupController(
			emailValidator,
			singupService
		);
	}
}

export default SingupControllerComposer;