import MissingParamError from '../utils/errors/MissingParam';
import iSingupService from '../utils/interfaces/singup-service';

class SingupService implements iSingupService {
  async sing(name: string, email: string, password: string): Promise<boolean> {
    if(!name){throw new MissingParamError('name')};
    if(!email){throw new MissingParamError('email')};
    if(!password){throw new MissingParamError('password')};
    
    return true;
  }
}

describe('Signup Service', () => {
  test('should trhow if no name was sent', async () => {
    const sut = new SingupService();
    expect(sut.sing('', 'any_email@mail.com', 'any_password')).rejects.toThrow(new MissingParamError('name'));
  })

  test('should trhow if no email was sent', async () => {
    const sut = new SingupService();
    expect(sut.sing('any_name', '', 'any_password')).rejects.toThrow(new MissingParamError('email'));
  })

  test('should trhow if no password was sent', async () => {
    const sut = new SingupService();
    expect(sut.sing('any_name', 'any_email@mail.com', '')).rejects.toThrow(new MissingParamError('password'));
  })

  test('should throw if')
})