import MissingParamError from '../utils/errors/MissingParam';
import AuthService from './auth-service';
import iEncrypter from '../interfaces/encrypter';
import iLoadUserByEmailRepository from '../interfaces/load-user-by-email-repository';
import User from '../types/user-type';

const makeLoadUserByRepository = () => {
  class LoadUserByRepositorySpy implements iLoadUserByEmailRepository{
    public user: User | undefined = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    }
  
    public email = "";
  
    async load(email: string){
      this.email = email;
      return this.user;
    }
  }

  return new LoadUserByRepositorySpy();
}

const makeEncrypter = () => {
  class EncrypterSpy implements iEncrypter {
    public password = "";
    public hashedPassword = "";
    public isValid = true;

    compare(password: string, hashedPassword: string){
      
      this.password = password;
      this.hashedPassword = hashedPassword;
      
      return this.isValid;
    }
  }

  return new EncrypterSpy();
}

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserByRepository();
  const encrypterSpy = makeEncrypter();
  const sut = new AuthService(loadUserByEmailRepositorySpy, encrypterSpy);

  return {
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    sut
  }
}

describe('Auth Service', ()=>{
  test('should throw if an empty email was sent', async () => {
    const {sut} = makeSut();
    
    expect(sut.authenticate('','any_password')).rejects.toThrow(new MissingParamError('email'));
  })

  test('should throw if an empty password was sent', async () => {
    const {sut} = makeSut();
    
    expect(sut.authenticate('any_email@mail.com','')).rejects.toThrow(new MissingParamError('password'));
  })

  test('should call LoadUserByEmailRepository with correct email', async () => {
    const {sut, loadUserByEmailRepositorySpy} = makeSut();
    const email = 'any_email';
    
    sut.authenticate(email, 'any_password');

    expect(loadUserByEmailRepositorySpy.email).toEqual(email);
  })

  test('should return null if an invalid email is providade', async () => {
    const {sut, loadUserByEmailRepositorySpy} = makeSut();
    loadUserByEmailRepositorySpy.user = undefined;
    const acessToken = await sut.authenticate('invalid_email@mail.com', 'any_password');
    
    expect(acessToken).toBeNull();
  })

  test('should call Encrypter with correct values', async () => {
    const {sut, encrypterSpy, loadUserByEmailRepositorySpy} = makeSut();
    const password = 'any_password';

    await sut.authenticate('any_email', 'any_password');

    expect(encrypterSpy.password).toEqual(password);
    expect(encrypterSpy.hashedPassword).toEqual(loadUserByEmailRepositorySpy.user?.password);
  })

  test('should return null if an invalid password is provided', async () => {
    const {sut, encrypterSpy} = makeSut();
    encrypterSpy.isValid = false;

    const acessToken = await sut.authenticate("any_email@mail.com", "any_password");
    expect(acessToken).toBeNull();
  })
  
})