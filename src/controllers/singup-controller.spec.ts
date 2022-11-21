import MissingParamError from '../utils/errors/MissingParam';
import HttpResponse from '../utils/HttpResponse';
import Controller from '../utils/interfaces/controller';
import { HttpReq, HttpRes } from '../utils/types/Http-types';
import iEmailValidator from '../utils/interfaces/email-validator';


class SingupController implements Controller{
  constructor(private EmailValidator: iEmailValidator){}

  async route(httpRequest: HttpReq): Promise<HttpRes> {
    const {name, email, password} = httpRequest.body;

    if(!email){return HttpResponse.badRequest('email');}
    if(!name){return HttpResponse.badRequest('name');}
    if(!password){return HttpResponse.badRequest('password');}
    if(!this.EmailValidator || !this.EmailValidator.validateEmail){return HttpResponse.serverError();}
    if(!this.EmailValidator.validateEmail(email)){return HttpResponse.unauthorized('Invalid email');}
    
    return HttpResponse.badRequest('email');
  }
}

class EmailValidatorSpy implements iEmailValidator{
  public isValid = true;
  public email = ''
  
  validateEmail(email : string) {
    this.email = email;
    return this.isValid;
  }
}

const makeSut =  () => {
  const emailValidatorSpy = new EmailValidatorSpy();
  const sut = new SingupController(emailValidatorSpy);

  return {emailValidatorSpy, sut};
}

describe('Singup Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const {sut} = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: '',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toEqual(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  })

  test('should return 400 if no name is provided', async () => {
    const {sut} = makeSut();
    const httpRequest = {
      body: {
        name: '',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toEqual(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  })

  test('should return 400 if no password is provided', async () => {
    const {sut} = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: ''
      }
    }
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toEqual(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  })

  test('should return 500 if an invalid EmailValidator is provided', async () => {
    const sut = new SingupController({} as iEmailValidator);
    const httpRequest = {
      body:{
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toEqual(500);
  })

  test('should return 401 if EmailValidator retrun false', async () => {
    const {sut, emailValidatorSpy} = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'password'
      }
    }
    
    emailValidatorSpy.isValid = false;
    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toEqual(401);
    expect(httpResponse.body).toEqual('Invalid email');
  })
})