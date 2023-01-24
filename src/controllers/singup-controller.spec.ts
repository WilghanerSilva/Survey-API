import MissingParamError from "../utils/errors/MissingParam";
import SingupController from "./singup-controller";
import {iEmailValidator, iSingupService} from "../utils/interfaces";


class EmailValidatorSpy implements iEmailValidator{
	public isValid = true;
	public email = "";
  
	validateEmail(email : string) {
		this.email = email;
		return this.isValid;
	}
}

class SingupServiceSpy implements iSingupService{
	public name = "";
	public email = "";
	public password = "";
	public isCreated = true;
  
	async sing(name: string, email: string, password: string): Promise<boolean> {
		this.name = name;
		this.email = email;
		this.password = password;

		return this.isCreated;
	}
}

const makeEmailValidatorWithError = () => {
	class EmailValidatorWithError implements iEmailValidator{
		validateEmail(email: string): boolean {
			throw new Error();
		}
	}

	return new EmailValidatorWithError();
};

const makeSingupServiceWithError = () => {
	class SingupServiceWithError implements iSingupService {
		sing(name: string, email: string, password: string): Promise<boolean> {
			throw new Error();
		}
	}

	return new SingupServiceWithError();
};

const makeSut =  () => {
	const emailValidatorSpy = new EmailValidatorSpy();
	const singupServiceSpy = new SingupServiceSpy();
	const sut = new SingupController(emailValidatorSpy, singupServiceSpy);

	return {singupServiceSpy, emailValidatorSpy, sut};
};

describe("Singup Controller", () => {
	test("should return 400 if no email is provided", async () => {
		const {sut} = makeSut();
		const httpRequest = {
			body: {
				name: "any_name",
				email: "",
				password: "any_password"
			},
			headers: {}
		};
		const httpResponse = await sut.route(httpRequest);
		expect(httpResponse.statusCode).toEqual(400);
		expect(httpResponse.body).toEqual(new MissingParamError("email"));
	});

	test("should return 400 if no name is provided", async () => {
		const {sut} = makeSut();
		const httpRequest = {
			body: {
				name: "",
				email: "any_email@mail.com",
				password: "any_password"
			},
			headers: {}
		};
		const httpResponse = await sut.route(httpRequest);
		expect(httpResponse.statusCode).toEqual(400);
		expect(httpResponse.body).toEqual(new MissingParamError("name"));
	});

	test("should return 400 if no password is provided", async () => {
		const {sut} = makeSut();
		const httpRequest = {
			body: {
				name: "any_name",
				email: "any_email@mail.com",
				password: ""
			},
			headers: {}
		};
		const httpResponse = await sut.route(httpRequest);
		expect(httpResponse.statusCode).toEqual(400);
		expect(httpResponse.body).toEqual(new MissingParamError("password"));
	});

	test("should return 500 if an invalid EmailValidator is provided", async () => {
		const singupServiceSpy = new SingupServiceSpy();
		const sut = new SingupController({} as iEmailValidator, singupServiceSpy);
		const httpRequest = {
			body:{
				name: "any_name",
				email: "any_email@mail.com",
				password: "any_password"
			},
			headers: {}
		};

		const httpResponse = await sut.route(httpRequest);
		expect(httpResponse.statusCode).toEqual(500);
	});

	test("should return 401 if EmailValidator return false", async () => {
		const {sut, emailValidatorSpy} = makeSut();
		const httpRequest = {
			body: {
				name: "any_name",
				email: "invalid_email",
				password: "password"
			},
			headers: {}
		};
    
		emailValidatorSpy.isValid = false;
		const httpResponse = await sut.route(httpRequest);

		expect(httpResponse.statusCode).toEqual(401);
		expect(httpResponse.body).toEqual("Invalid email");
	});

	test("should return 500 if an invalid singupService is provided", async () => {
		const emailValidatorSpy = new EmailValidatorSpy();
		const sut = new SingupController(emailValidatorSpy, {} as iSingupService);

		const httpRequest = {
			body: {
				name: "any_name",
				email: "any_email@mail.com",
				password: "any_password",
			},
			headers: {}
		};

		const httpResponse = await sut.route(httpRequest);
		expect(httpResponse.statusCode).toEqual(500);
	});
  
	test("should return 401 if singupServie return false", async () => {
		const {sut, singupServiceSpy} = makeSut();
    
		const httpResquest = {
			body: {
				name: "any_name",
				email: "used_email@mail.com",
				password: "any_password",
			},
			headers: {}
		};

		singupServiceSpy.isCreated = false;

		const httpResponse = await sut.route(httpResquest);
		expect(httpResponse.statusCode).toEqual(401);
	});

	test("should call singupService with correct params", async () => {
		const {sut, singupServiceSpy} = makeSut();
		const httpRequest = {
			body: {
				name: "any_name",
				email: "any_email",
				password: "any_password"
			},
			headers: {}
		};

		await sut.route(httpRequest);

		expect(singupServiceSpy.email).toEqual(httpRequest.body.email);
		expect(singupServiceSpy.name).toEqual(httpRequest.body.name);
		expect(singupServiceSpy.password).toEqual(httpRequest.body.password);
	});

	test("should return 200 if correct params are provided", async () => {
		const {sut} = makeSut();

		const httpRequest = {
			body: {
				name : "any_name",
				email : "valid_email@email.com",
				password : "any_password"
			},
			headers: {}
		};

		const httpResponse = await sut.route(httpRequest);
		expect(httpResponse.statusCode).toEqual(200);
	});

	test("should return 500 if any dependency trhow error", async () => {
		const singupServiceSpy = new SingupServiceSpy();
		const emailValidatorSpy = new EmailValidatorSpy();
    
		const suts: SingupController[] = [
			new SingupController(emailValidatorSpy, makeSingupServiceWithError()),
			new SingupController(makeEmailValidatorWithError(),singupServiceSpy),
		];

		const httpRequest = {
			body: {
				name: "any_name",
				email: "any_email",
				password: "any_password",
			},
			headers: {}
		};

		for(const sut of suts){
			const httpResponse = await sut.route(httpRequest);

			expect(httpResponse.statusCode).toEqual(500);
		}
    
	});
});