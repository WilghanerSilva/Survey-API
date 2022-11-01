import MissingParamError from './errors/MissingParam';

export default class HttpResponse{
  static badRequest(paramName: string){
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
}