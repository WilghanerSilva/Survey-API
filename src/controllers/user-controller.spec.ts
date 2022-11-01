import HttpResponse from '../utils/HttpResponse';
import MissingParamError from '../utils/errors/MissingParam';

type HttpRequest = {
  body: any
}

class UserController {

  async auth(httpRequest: HttpRequest) {
    const {email, password} = httpRequest.body;
    if(!email){return HttpResponse.badRequest('email');}
    if(!password){return HttpResponse.badRequest('password');}
      
  }
}


describe('User Controller', () => {
  test('should return 400 if an empty email is sent', async () => {
    const sut = new UserController();
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
    const sut = new UserController();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const result = await sut.auth(httpRequest);

    expect(result?.statusCode).toBe(400);
    expect(result?.body).toEqual(new MissingParamError('password'));
  });
});
