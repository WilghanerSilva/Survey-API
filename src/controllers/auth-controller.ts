import HttpResponse from "../utils/HttpResponse";
import { HttpReq } from '../utils/types/Http-types';
import {iEmailValidator, iAuthService, iController} from "../utils/interfaces";

class AuthController implements iController{
  constructor(private emailValidator: iEmailValidator, private authService: iAuthService){}

  async route(httpRequest: HttpReq) {
    const {email, password} = httpRequest.body;
    if(!email){return HttpResponse.badRequest('email');}
    if(!password){return HttpResponse.badRequest('password');}
    if(!this.emailValidator.validateEmail){return HttpResponse.serverError()}
    if(!this.authService.authenticate){return HttpResponse.serverError()}
    
    try {
      const isValid = this.emailValidator.validateEmail(email);
  
      if(!isValid){return HttpResponse.unauthorized('Email or password incorrect')};
  
      const token = await this.authService.authenticate(email, password);
      if(!token){return HttpResponse.unauthorized('Email or password incorrect')};
  
      return HttpResponse.ok({token: token});
      
    } catch (error) {
      return HttpResponse.serverError();  
    }
  }
}

export default AuthController;