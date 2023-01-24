import AuthController from "./auth-controller";
import MissingParamError from "../utils/errors/MissingParam";
import iEmailValidator from "../utils/interfaces/email-validator";
import iAuthService from "../utils/interfaces/auth-service";

class EmailValidatorSpy implements iEmailValidator{
	public email = "";
	public response = true;

	validateEmail(email: string):boolean {
		this.email = email;
		return this.response;
	}
}

class AuthServiceSpy implements iAuthService{
	public token = "any_token";
	public email = "";
	public password = "";

	async authenticate(email: string, password: string){
		this.email = email;
		this.password = password;
		return this.token;
	}
}

const makeSut = () => {
	const emailValidatorSpy = new EmailValidatorSpy();
	const authServiceSpy = new AuthServiceSpy();
	const sut = new AuthController(emailValidatorSpy, authServiceSpy);

	return {sut, emailValidatorSpy, authServiceSpy};
};


describe("User Controller", () => {
	test("should return 400 if an empty email is sent", async () => {
		const {sut} = makeSut();
		const httpRequest = {
			body: {
				password: "any_password"
			},
			headers: {}
		};
		const result = await sut.route(httpRequest);

		expect(result.statusCode).toEqual(400);
		expect(result.body).toEqual(new MissingParamError("email"));
	});

	test("should return 400 if an empty password is sent", async () => {
		const {sut} = makeSut();
		const httpRequest = {
			body: {
				email: "any_email@mail.com"
			},
			headers: {}
		};
		const result = await sut.route(httpRequest);

		expect(result.statusCode).toEqual(400);
		expect(result.body).toEqual(new MissingParamError("password"));
	});

	test("should return 500 if an invalid EmailValidator is sent", async () => {
		const authServiceSpy = new AuthServiceSpy();
		const sut = new AuthController({} as iEmailValidator, authServiceSpy);
		const httpRequest = {
			body: {
				email: "any_email@mail.com",
				password: "any_password"
			},
			headers: {}
		};
		const result = await sut.route(httpRequest);

		expect(result.statusCode).toEqual(500);
	});

	test("should correct email is sent to EmailValidator", async () => {
		const {sut, emailValidatorSpy} = makeSut();
		const httpRequest = {
			body: {
				email: "any_email@mail.com",
				password: "any_password"
			},
			headers: {}
		};

		sut.route(httpRequest);

		expect(emailValidatorSpy.email).toEqual(httpRequest.body.email);
	});

	test("should return 401 if validate method of EmailValidator returns false", async () => {
		const {sut, emailValidatorSpy} = makeSut();
		const httpRequest = {
			body: {
				email: "invalid_email",
				password: "any_password"
			},
			headers: {}
		};

		emailValidatorSpy.response = false;
		const response = await sut.route(httpRequest);

		expect(response?.statusCode).toEqual(401);
	});

	test("should return 500 if an invalid AuthService is sent", async () => {
		const emailValidatorSpy = new EmailValidatorSpy();
		const sut = new AuthController(emailValidatorSpy, {} as iAuthService);
		const httpRequest = {
			body: {
				email: "any_email@mail.com",
				password: "any_password"
			},
			headers: {}
		};
		const httpResponse = await sut.route(httpRequest);
		expect(httpResponse?.statusCode).toEqual(500);
	});

	test("should send correct email and password to AuthService", async () => {
		const {sut, authServiceSpy} = makeSut();
		const httpRequest = {
			body: {
				email: "any_email@mail.com",
				password: "any_password",
			},
			headers: {}
		};
    
		await sut.route(httpRequest);
    
		expect(authServiceSpy.email).toEqual(httpRequest.body.email);
		expect(authServiceSpy.password).toEqual(httpRequest.body.password);
	});

	test("should return 401 if undefid token has sent by AuthService", async () => {
		const {sut, authServiceSpy} = makeSut();
		const httpRequest = {
			body: {
				email: "any_email@mail.com",
				password: "invalid_password"
			},
			headers: {}
		};

		authServiceSpy.token = "";

		const httpResponse = await sut.route(httpRequest);

		expect(httpResponse?.statusCode).toEqual(401);
	});

	test("shoul return 200 and token if an invalid AuthService is sent", async () => {
		const {sut, authServiceSpy} = makeSut();
		const httpRequest = {
			body: {
				email: "any_email@mail.com",
				password: "any_password"
			},
			headers: {}
		};

		const httpResponse = await sut.route(httpRequest);

		expect(httpResponse?.statusCode).toEqual(200);
		expect(httpResponse.body).toEqual({token: authServiceSpy.token});
	});

	test("should return 500 if any dependency throw an error", async () => {
		const emailValidatorSpy = new EmailValidatorSpy();
		const authServiceSpy = {
			authenticate: () =>{
				throw new Error();
			}
		} as iAuthService;
		const sut = new AuthController(emailValidatorSpy, authServiceSpy);

		const httpRequest = {
			body:{
				email: "any_email@mail.com",
				password: "any_password"
			},
			headers: {}
		};

		const httpResponse = await sut.route(httpRequest);
		expect(httpResponse.statusCode).toEqual(500); 
    
	});
  
});
