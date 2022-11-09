import MissingParamError from '../utils/errors/MissingParam';
import iAuthService from '../interfaces/auth-service';
import e from 'express';

type User = {
  name: string,
  email: string,
  password: string,
}

interface iLoadUserByRepository {
  load(email: string) : Promise<User | undefined>; 
}

interface iEncrypter {
  compare(password: string, hashedPassword: string): Boolean;
}

class AuthService implements iAuthService {
  constructor(
    private loadUserByRepository: iLoadUserByRepository,
    private encrypter: iEncrypter,
  ){}

  async authenticate(email: string, password: string): Promise<String | null> {
    if(!email)
      throw new MissingParamError('email');
    
    if(!password)
      throw new MissingParamError('password')

    const user = await this.loadUserByRepository.load(email);

    if(!user){return null}

    this.encrypter.compare(password, user.password);
    
    return 'any_token';
  }
}

const makeLoadUserByRepository = () => {
  class LoadUserByRepositorySpy implements iLoadUserByRepository{
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

describe("Auth Service", ()=>{
  test('should throw if an empty email was sent', async () => {
    const {sut} = makeSut();
    
    expect(sut.authenticate('','any_password')).rejects.toThrow(new MissingParamError("email"));
  })

  test('should throw if an empty password was sent', async () => {
    const {sut} = makeSut();
    
    expect(sut.authenticate('any_email@mail.com','')).rejects.toThrow(new MissingParamError("password"));
  })

  test('should call LoadUserByEmailRepository with correct email', async () => {
    const {sut, loadUserByEmailRepositorySpy} = makeSut();
    const email = 'any_email';
    
    sut.authenticate(email, 'any_password');

    expect(loadUserByEmailRepositorySpy.email).toBe(email);
  })

  test('should return null if an invalid email is providade', async () => {
    const {sut, loadUserByEmailRepositorySpy} = makeSut();
    loadUserByEmailRepositorySpy.user = undefined;
    const acessToken = await sut.authenticate('invalid_email@mail.com', 'any_password');
    
    expect(acessToken).toBeNull();
  })

  test('shoul call Encrypter with correct values', async () => {
    const {sut, encrypterSpy, loadUserByEmailRepositorySpy} = makeSut();
    const password = 'any_password';

    await sut.authenticate('any_email', 'any_password');

    expect(encrypterSpy.password).toEqual(password);
    expect(encrypterSpy.hashedPassword).toEqual(loadUserByEmailRepositorySpy.user?.password);
  })
  
})