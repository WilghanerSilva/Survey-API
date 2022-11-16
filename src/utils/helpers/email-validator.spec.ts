import iEmailValidator from '../../interfaces/email-validator';
import validator from 'validator';

jest.mock('validator');

class EmailValidator implements iEmailValidator{
  
  validateEmail(email: string): boolean {
    return validator.isEmail("any_email@mail.com");
  }
}

describe('Email Validator', () => {
  const mockedValidator = validator as jest.Mocked<typeof validator>;
  
  
  test('should return true if validator return true', async () => {
    const sut = new EmailValidator();
    mockedValidator.isEmail.mockImplementation(()=>{return true});
    const isValid = sut.validateEmail('valid_email@mail.com');

    expect(isValid).toEqual(true);
  })

  test('should return false if validator return false', async () => {
    const sut = new EmailValidator();
    mockedValidator.isEmail.mockImplementation(()=>{return false});
    const isValid = sut.validateEmail('invalid_email@mail.com');
    
    expect(isValid).toBe(false);
  })
});