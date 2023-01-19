import MissingParamError from '../errors/MissingParam';
import bcrypt from 'bcrypt';
import Encrypter from './encrypter';

jest.mock('bcrypt');


const makeSut = () => {
  return new Encrypter();
}

describe('Encrypter', () => {
  const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  test('should throw if compare method has called with no password param', () => {
    const sut = makeSut();
    expect(sut.compare('', 'hashed_password')).rejects.toThrow(new MissingParamError('password'));
  })

  test('should throw if compare method has called with no hashedpassword param', () => {
    const sut = makeSut();
    expect(sut.compare('password', '')).rejects.toThrow(new MissingParamError('hashedPassword'));
  })

  test('should compare method call bcrypt with correct values', async () => {
    const sut = makeSut();
    const password = 'any_password';
    const hashedPassword = 'hashed_password';
    
    let calledPassword, calledHashedPassword;

    mockedBcrypt.compare.mockImplementation((password, hashedPassword)=>{
      calledPassword = password;
      calledHashedPassword = hashedPassword;
      return true;
    })
    await sut.compare(password, hashedPassword);

    expect(calledPassword).toBe(password);
    expect(calledHashedPassword).toBe(hashedPassword)
  })

  test('should compare method return false if bcrypt returns false', async () => {
    const sut = makeSut();
    mockedBcrypt.compare.mockImplementation(()=>{return false});

    const result = await sut.compare('invalid_password', 'hashed_password');
    expect(result).toEqual(false);
  })

  test('should compare method return true if bcrypt returns true', async () => {
    const sut = makeSut();
    mockedBcrypt.compare.mockImplementation(()=>{return true});

    const result = await sut.compare('valid_password', 'hashed_password');
    expect(result).toBe(true);
  })

  test('should throw error if crypt method has called with invalid password', async () => {
    const sut = makeSut();

    expect(sut.crypt("")).rejects.toThrow(new MissingParamError("password"));
  })

  test('the crypt method must return the same value that bcrypt returns', async () => {
    const sut = makeSut();
    const hashedPassword = "hashed_string";
    
    mockedBcrypt.hash.mockImplementation(()=>{return hashedPassword});

    const cryptResult = await sut.crypt("any_string");

    expect(cryptResult).toEqual(hashedPassword);
  })
})