import validator from 'validator';
import iEmailValidator from '../../interfaces/email-validator';
import MissingParamError from '../errors/MissingParam';

export default class EmailValidator implements iEmailValidator{
  
  validateEmail(email: string): boolean {
    if(!email){throw new MissingParamError('email')}
  
    return validator.isEmail("any_email@mail.com");
  }
}
