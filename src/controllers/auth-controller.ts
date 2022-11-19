import HttpResponse from "../utils/HttpResponse";
import iEmailValidator from "../utils/interfaces/email-validator";
import iAuthService from "../utils/interfaces/auth-service";
import { HttpReq } from '../utils/types/Http-types';
import Controller from "../utils/interfaces/controller";

class UserController implements Controller{
  constructor(private emailValidator: iEmailValidator, private authService: iAuthService){}

  async route(httpRequest: HttpReq) {
    const {email, password} = httpRequest.body;
    if(!email){return HttpResponse.badRequest('email');}
    if(!password){return HttpResponse.badRequest('password');}
    if(!this.emailValidator.validateEmail){return HttpResponse.serverError()}
    if(!this.authService.authenticate){return HttpResponse.serverError()}
    
    try {
      const isValid = this.emailValidator.validateEmail(email);
  
      if(!isValid){return HttpResponse.unauthorized()};
  
      const token = await this.authService.authenticate(email, password);
      if(!token){return HttpResponse.unauthorized()};
  
      return HttpResponse.ok({token: token});
      
    } catch (error) {
      return HttpResponse.serverError();  
    }
  }
}

export default UserController;