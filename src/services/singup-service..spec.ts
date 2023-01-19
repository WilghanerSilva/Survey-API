import MissingParamError from '../utils/errors/MissingParam';
import SingupService from "./singup-service";
import { iLoadUserByEmailRepository, iCreateUserRepository, iEncrypter } from "../utils/interfaces";
import User from '../utils/types/user-type';

class LoadUserByEmailRepositorySpy implements iLoadUserByEmailRepository{
  public user: User | null | undefined = null;

  async load(email: string): Promise<User | null | undefined> {
    return this.user;
  }
}

class CreateUserRepositorySpy implements iCreateUserRepository {
  async create(user: User) {
  }
}

class EncrypterSpy implements iEncrypter {
  private cryptReturn = "hashed_password"
  
  async compare(password: string, hashedPassword: string): Promise<Boolean> {
    return true;
  }

  async crypt(password: string): Promise<string> {
    return this.cryptReturn;
  }
}


const makeSut = () =>{
  const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy();
  const createUserRepository = new CreateUserRepositorySpy();
  const encrypter = new EncrypterSpy();

  const sut = new SingupService(
    loadUserByEmailRepository,
    createUserRepository,
    encrypter
  );
  return {sut, loadUserByEmailRepository, createUserRepository, encrypter};
}

describe('Signup Service', () => {
  test('should trhow if no name was sent', async () => {
    const {sut} = makeSut();
    expect(sut.sing('', 'any_email@mail.com', 'any_password')).rejects.toThrow(new MissingParamError('name'));
  })

  test('should trhow if no email was sent', async () => {
    const {sut} = makeSut();
    expect(sut.sing('any_name', '', 'any_password')).rejects.toThrow(new MissingParamError('email'));
  })

  test('should trhow if no password was sent', async () => {
    const {sut} = makeSut();
    expect(sut.sing('any_name', 'any_email@mail.com', '')).rejects.toThrow(new MissingParamError('password'));
  })

  test('should throw if invalid checkEmailRepository was sent', async () => {
    const loadUserByEmailRepository = {} as iLoadUserByEmailRepository;
    const {createUserRepository, encrypter} = makeSut();
    
    const sut = new SingupService(
      loadUserByEmailRepository, 
      createUserRepository,
      encrypter
    );
    expect(sut.sing('any_name', 'any_email@mail.com', 'any_password'))
    .rejects.toThrow(new Error("Invalid LoadUserByEmailRepository"));
  })

  test('should throw if invalid createUserRepository was sent', async () => {
    const {loadUserByEmailRepository, encrypter} = makeSut();
    const createUserRepository = {} as iCreateUserRepository;
    
    const sut = new SingupService(
      loadUserByEmailRepository, 
      createUserRepository,
      encrypter
    );
    expect(sut.sing('any_name', 'any_email@mail.com', 'any_password'))
    .rejects.toThrow(new Error("Invalid CreateUserRepository"));
  })

  test('should throw if invalid createUserRepository was sent', async () => {
    const {loadUserByEmailRepository, createUserRepository} = makeSut();
    const  encrypter = {} as iEncrypter;
    
    const sut = new SingupService(
      loadUserByEmailRepository, 
      createUserRepository, 
      encrypter
    );

    expect(sut.sing('any_name', 'any_email@mail.com', 'any_password'))
    .rejects.toThrow(new Error("Invalid Encrypter"));
  })

  test('should return false if email has in use', async () => {
    const {sut, loadUserByEmailRepository} = makeSut();

    loadUserByEmailRepository.user = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    };

    const singResponse = await sut.sing('any_name', 'any_email@mail', 'any_password');

    expect(singResponse).toBe(false);
  })

  test('should return true if everything is ok', async () => {
    const {sut} = makeSut();
    const singResponse = sut.sing('any_name', 'any_email@mail', 'any_password');
    expect(singResponse).toBeTruthy();
  })

})