import MissingParamError from './errors/MissingParam';
import { HttpRes } from './types/Http-types';

export default class HttpResponse{
  static badRequest(paramName: string): HttpRes{
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static serverError(): HttpRes{
    return {
      statusCode: 500,
      body: ''
    }
  }

  static unauthorized(): HttpRes{
    return {
      statusCode: 401,
      body: 'Email or password incorrect'
    }
  }

  static ok(body: object): HttpRes{
    return {
      statusCode: 200,
      body: body
    }
  }
}