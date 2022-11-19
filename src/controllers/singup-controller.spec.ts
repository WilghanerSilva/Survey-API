import MissingParamError from '../utils/errors/MissingParam';
import HttpResponse from '../utils/HttpResponse';
import Controller from '../utils/interfaces/controller';
import { HttpReq, HttpRes } from '../utils/types/Http-types';


class SingupController implements Controller{
  async route(httpRequest: HttpReq): Promise<HttpRes> {
    const {name, email, password} = httpRequest.body;

    if(!email){return HttpResponse.badRequest('email');}
    if(!name){return HttpResponse.badRequest('name');}
    if(!password){return HttpResponse.badRequest('password');}
    
    return HttpResponse.badRequest('email');
  }
}

describe('Singup Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const sut = new SingupController();
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
    const sut = new SingupController();
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
    const sut = new SingupController();
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
})