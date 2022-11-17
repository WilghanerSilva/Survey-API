import MissingParamError from '../errors/MissingParam';
import iEncrypter from '../../interfaces/encrypter';
import bcrypt, { hash } from 'bcrypt';

jest.mock('bcrypt');

class Encrypter implements iEncrypter{
  async compare(password: string, hashedPassword: string): Promise<Boolean> {
    if(!password){throw new MissingParamError('password')};
    if(!hashedPassword){throw new MissingParamError('hashedPassword')};
    return await bcrypt.compare(password, hashedPassword);
  }
}

const makeSut = () => {
  return new Encrypter();
}

describe('Encrypter', () => {
  const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  test('should throw if no password are provided', () => {
    const sut = makeSut();
    expect(sut.compare('', 'hashed_password')).rejects.toThrow(new MissingParamError('password'));
  })

  test('should throw if no hashedpassword are provided', () => {
    const sut = makeSut();
    expect(sut.compare('password', '')).rejects.toThrow(new MissingParamError('hashedPassword'));
  })

  test('should call bcrypt with correct values', async () => {
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

  test('should return return false if bcrypt returns false', async () => {
    const sut = makeSut();
    mockedBcrypt.compare.mockImplementation(()=>{return false});

    const result = await sut.compare('invalid_password', 'hashed_password');
    expect(result).toEqual(false);
  })

  test('should return true if bcrypt returns true', async () => {
    const sut = makeSut();
    mockedBcrypt.compare.mockImplementation(()=>{return true});

    const result = await sut.compare('valid_password', 'hashed_password');
    expect(result).toBe(true);
  })
})