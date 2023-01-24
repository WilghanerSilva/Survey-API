import MissingParamError from "../utils/errors/MissingParam";
import AuthService from "./auth-service";
import User from "../utils/types/user-type";
import {iEncrypter, iLoadUserByEmailRepository, iTokenManager} from "../utils/interfaces";

const makeLoadUserByRepository = () => {
	class LoadUserByRepositorySpy implements iLoadUserByEmailRepository{
		public user: User | undefined = {
			id: "any_id",
			name: "any_name",
			email: "any_email@mail.com",
			password: "hashed_password"
		};
  
		public email = "";
  
		async load(email: string){
			this.email = email;
			return this.user;
		}
	}

	return new LoadUserByRepositorySpy();
};

const makeTokenManagerSpy = () => {
	class TokenManagerSpy implements iTokenManager{
		public userId = "";
		public token = "token";
    
		generate(userId: string): string {
			this.userId = userId;
			return this.token;
		}

		verify(token: string): string | { userId: string; } {
			return token;
		}
	}

	return new TokenManagerSpy();
};

const makeEncrypter = () => {
	class EncrypterSpy implements iEncrypter {
		public password = "";
		public hashedPassword = "";
		public isValid = true;

		async compare(password: string, hashedPassword: string){
      
			this.password = password;
			this.hashedPassword = hashedPassword;
      
			return this.isValid;
		}

		async crypt(password: string): Promise<string> {
			return "";
		}
	}

	return new EncrypterSpy();
};

const makeSut = () => {
	const loadUserByEmailRepositorySpy = makeLoadUserByRepository();
	const encrypterSpy = makeEncrypter();
	const tokenManagerSpy = makeTokenManagerSpy();

	const sut = new AuthService(loadUserByEmailRepositorySpy, encrypterSpy, tokenManagerSpy);

	return {
		tokenManagerSpy,
		loadUserByEmailRepositorySpy,
		encrypterSpy,
		sut
	};
};

describe("Auth Service", ()=>{
	test("should throw if an empty email was sent", async () => {
		const {sut} = makeSut();
    
		expect(sut.authenticate("","any_password")).rejects.toThrow(new MissingParamError("email"));
	});

	test("should throw if an empty password was sent", async () => {
		const {sut} = makeSut();
    
		expect(sut.authenticate("any_email@mail.com","")).rejects.toThrow(new MissingParamError("password"));
	});

	test("should call LoadUserByEmailRepository with correct email", async () => {
		const {sut, loadUserByEmailRepositorySpy} = makeSut();
		const email = "any_email";
    
		sut.authenticate(email, "any_password");

		expect(loadUserByEmailRepositorySpy.email).toEqual(email);
	});

	test("should return null if an invalid email is providade", async () => {
		const {sut, loadUserByEmailRepositorySpy} = makeSut();
		loadUserByEmailRepositorySpy.user = undefined;
		const acessToken = await sut.authenticate("invalid_email@mail.com", "any_password");
    
		expect(acessToken).toBeNull();
	});

	test("should call Encrypter with correct values", async () => {
		const {sut, encrypterSpy, loadUserByEmailRepositorySpy} = makeSut();
		const password = "any_password";

		await sut.authenticate("any_email", "any_password");

		expect(encrypterSpy.password).toEqual(password);
		expect(encrypterSpy.hashedPassword).toEqual(loadUserByEmailRepositorySpy.user?.password);
	});

	test("should return null if an invalid password is provided", async () => {
		const {sut, encrypterSpy} = makeSut();
		encrypterSpy.isValid = false;

		const acessToken = await sut.authenticate("any_email@mail.com", "any_password");
		expect(acessToken).toBeNull();
	});

	test("should call tokenManager to generate token with correct values", async () => {
		const {sut, tokenManagerSpy, loadUserByEmailRepositorySpy} = makeSut();
    
		await sut.authenticate("any_email@mail.com", "any_password");
    
		expect(tokenManagerSpy.userId).toEqual(loadUserByEmailRepositorySpy.user?.id);
	});

	test("should return the acessToken if correct credentials are provided", async () => {
		const {sut, tokenManagerSpy} = makeSut();

		const acessToken = await sut.authenticate("valid_email@mail.com", "valid_password");

		expect(acessToken).toEqual(tokenManagerSpy.token);
	});
  
});