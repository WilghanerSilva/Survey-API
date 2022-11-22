import Controller from "../utils/interfaces/controller";
import iEmailValidator from "../utils/interfaces/email-validator";
import iSingupService from "../utils/interfaces/singup-service";
import { HttpReq, HttpRes } from "../utils/types/Http-types";
import HttpResponse from "../utils/HttpResponse";

export default class SingupController implements Controller{
  constructor(private emailValidator: iEmailValidator, private singupService: iSingupService){}

  async route(httpRequest: HttpReq): Promise<HttpRes> {
    const {name, email, password} = httpRequest.body;

    if(!email){return HttpResponse.badRequest('email')};
    if(!name){return HttpResponse.badRequest('name')};
    if(!password){return HttpResponse.badRequest('password')};
    if(!this.emailValidator || !this.emailValidator.validateEmail){return HttpResponse.serverError()};
    if(!this.singupService || !this.singupService.sing){return HttpResponse.serverError()};

    try {
      if(!this.emailValidator.validateEmail(email)){return HttpResponse.unauthorized('Invalid email')};
      if(!await this.singupService.sing(name, email, password)){return HttpResponse.unauthorized('Email in use')};    
      return HttpResponse.ok({message: 'account created sucessfully'});

    } catch (error) {
      return HttpResponse.serverError();
    }
  }
}