import iEmailValidator from '../../interfaces/email-validator';
import validator from 'validator';

jest.mock('validator');

class EmailValidator implements iEmailValidator{
  
  validateEmail(email: string): boolean {
    return validator.isEmail("any_email@mail.com");
  }
}

const makeSut = () => {
  const sut = new EmailValidator();
  return {sut};
}

describe('Email Validator', () => {
  const mockedValidator = validator as jest.Mocked<typeof validator>;
  
  
  test('should return true if validator return true', async () => {
    const {sut} = makeSut()
    mockedValidator.isEmail.mockReturnValue(true);
    const isValid = sut.validateEmail('valid_email@mail.com');

    expect(isValid).toEqual(true);
  })

  test('should return false if validator return false', async () => {
    const {sut} = makeSut()
    mockedValidator.isEmail.mockReturnValue(false);
    const isValid = sut.validateEmail('invalid_email@mail.com');
    
    expect(isValid).toBe(false);
  })

  test('should call validator with correct email', async () => {
    const {sut} = makeSut()
    let calledEmail
    
    mockedValidator.isEmail.mockImplementation((email: string)=>{
      calledEmail = email;
      return true;
    })
    const email = 'any_email@mail.com'
    sut.validateEmail(email);

    expect(calledEmail).toBe(email);
  })

});