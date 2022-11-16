import iEmailValidator from '../../interfaces/email-validator';
import validator from 'validator';

jest.mock('validator', () => ({
  isEmailValid: true,
  email: '',

  isEmail(email: string) {
    this.email = email
    return this.isEmailValid
  }
}));


class EmailValidator implements iEmailValidator{
  
  validateEmail(email: string): boolean {
    return validator.isEmail("any_email@mail.com");
  }
}

describe('Email Validator', () => {
  test('should return true if validator return true', async () => {
    const sut = new EmailValidator();
    const isValid = sut.validateEmail('valid_email@mail.com');

    expect(isValid).toEqual(true);
  })
});