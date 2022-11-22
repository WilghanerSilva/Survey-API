import MissingParamError from '../utils/errors/MissingParam';
import HttpResponse from '../utils/HttpResponse';
import Controller from '../utils/interfaces/controller';
import { HttpReq, HttpRes } from '../utils/types/Http-types';
import iEmailValidator from '../utils/interfaces/email-validator';
import iSingupService from '../utils/interfaces/singup-service';


class SingupController implements Controller{
  constructor(private emailValidator: iEmailValidator, private singupService: iSingupService){}

  async route(httpRequest: HttpReq): Promise<HttpRes> {
    const {name, email, password} = httpRequest.body;

    if(!email){return HttpResponse.badRequest('email')};
    if(!name){return HttpResponse.badRequest('name')};
    if(!password){return HttpResponse.badRequest('password')};
    if(!this.emailValidator || !this.emailValidator.validateEmail){return HttpResponse.serverError()};
    if(!this.singupService || !this.singupService.sing){return HttpResponse.serverError()};

    if(!this.emailValidator.validateEmail(email)){return HttpResponse.unauthorized('Invalid email')};
    if(!await this.singupService.sing(name, email, password)){return HttpResponse.unauthorized('Email in use')};    
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

class SingupServiceSpy implements iSingupService{
  public name = '';
  public email = '';
  public password = '';
  public isCreated = true;
  
  async sing(name: string, email: string, password: string): Promise<boolean> {
    this.name = name;
    this.email = email;
    this.password = password;

    return this.isCreated;
  }
}

const makeSut =  () => {
  const emailValidatorSpy = new EmailValidatorSpy();
  const singupServiceSpy = new SingupServiceSpy();
  const sut = new SingupController(emailValidatorSpy, singupServiceSpy);

  return {singupServiceSpy, emailValidatorSpy, sut};
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
    const singupServiceSpy = new SingupServiceSpy();
    const sut = new SingupController({} as iEmailValidator, singupServiceSpy);
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

  test('should return 401 if EmailValidator return false', async () => {
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

  test('should return 500 if an invalid singupService is provided', async () => {
    const emailValidatorSpy = new EmailValidatorSpy();
    const sut = new SingupController(emailValidatorSpy, {} as iSingupService);

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      }
    }

    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toEqual(500);
  })
  
  test('should return 401 if singupServie return false', async () => {
    const {sut, singupServiceSpy} = makeSut();
    
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'used_email@mail.com',
        password: 'any_password',
      }
    }

    singupServiceSpy.isCreated = false;

    const httpResponse = await sut.route(httpResquest);
    expect(httpResponse.statusCode).toEqual(401);
  })

  test('should call singupService with correct params', async () => {
    const {sut, singupServiceSpy} = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }

    await sut.route(httpRequest);

    expect(singupServiceSpy.email).toEqual(httpRequest.body.email);
    expect(singupServiceSpy.name).toEqual(httpRequest.body.name);
    expect(singupServiceSpy.password).toEqual(httpRequest.body.password);
  })

})