import MissingParamError from './errors/MissingParam';
import { HttpRes } from './types/Http-types';

export default class HttpResponse{
  static badRequest(paramName: string): HttpRes{
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static serverError(){
    return {
      statusCode: 500,
      body: ''
    }
  }

  static unauthorized(){
    return {
      statusCode: 401,
      body: 'Email or password incorrect'
    }
  }

  static ok(body: object){
    return {
      statusCode: 200,
      body: body
    }
  }
}