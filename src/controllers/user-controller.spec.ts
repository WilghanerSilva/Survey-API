import HttpResponse from '../utils/HttpResponse';
import MissingParamError from '../utils/errors/MissingParam';

type HttpRequest = {
  body: any
}

interface iEmailValidator{
  validateEmail(email: string): boolean
}

class UserController {
  constructor(private EmailValidator: iEmailValidator){}

  async auth(httpRequest: HttpRequest) {
    const {email, password} = httpRequest.body;

    if(!email){return HttpResponse.badRequest('email');}
    if(!password){return HttpResponse.badRequest('password');}
      
    if(!this.EmailValidator.validateEmail){return HttpResponse.serverError()}
  }
}

class EmailValidatorSpy implements iEmailValidator{
  public email = "";
  public response = true;

  validateEmail(email: string):boolean {
    this.email = email;
    return this.response;
  }
}

const makeSut = () => {
  const emailValidatorSpy = new EmailValidatorSpy();
  const sut = new UserController(emailValidatorSpy);

  return {sut, emailValidatorSpy};
}


describe('User Controller', () => {
  test('should return 400 if an empty email is sent', async () => {
    const {sut} = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const result = await sut.auth(httpRequest);

    expect(result?.statusCode).toBe(400);
    expect(result?.body).toEqual(new MissingParamError('email'));
  });

  test('should return 400 if an empty password is sent', async () => {
    const {sut} = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const result = await sut.auth(httpRequest);

    expect(result?.statusCode).toBe(400);
    expect(result?.body).toEqual(new MissingParamError('password'));
  });

  test('should return 500 if an invalid EmailValidator is sent', async () => {
    const sut = new UserController({} as iEmailValidator);
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const result = await sut.auth(httpRequest);

    expect(result?.statusCode).toBe(500);
  });
  
});
