import MissingParamError from '../errors/MissingParam';
import iEncrypter from '../../interfaces/encrypter';

class Encrypter implements iEncrypter{
  compare(password: string, hashedPassword: string): Boolean {
    if(!password){throw new MissingParamError('password')};
    if(!hashedPassword){throw new MissingParamError('hashedPassword')};
    return true;
  }
}


describe('Encrypter', () => {
  test('should throw if no password are provided', () => {
    const sut = new Encrypter();
    expect(()=>{sut.compare('', 'hashed_password')}).toThrow(new MissingParamError('password'));
  })

  test('should throw if no hashedpassword are provided', () => {
    const sut = new Encrypter();
    expect(()=>{sut.compare('any_password','')}).toThrow(new MissingParamError('hashedPassword'));
  })
})