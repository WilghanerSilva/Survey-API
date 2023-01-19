import MissingParamError from '../utils/errors/MissingParam';
import SingupService from "./singup-service";
import { iLoadUserByEmailRepository, iCreateUserRepository } from "../utils/interfaces";
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


const makeSut = () =>{
  const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy();
  const createUserRepository = new CreateUserRepositorySpy();
  const sut = new SingupService(
    loadUserByEmailRepository,
    createUserRepository,
  );
  return {sut, loadUserByEmailRepository, createUserRepository};
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
    const {createUserRepository} = makeSut();
    
    const sut = new SingupService(loadUserByEmailRepository, createUserRepository);
    expect(sut.sing('any_name', 'any_email@mail.com', 'any_password')).rejects.toThrow();
  })

  test('should throw if invalid createUserRepository was sent', async () => {
    const {loadUserByEmailRepository} = makeSut();
    const createUserRepository = {} as iCreateUserRepository;
    
    const sut = new SingupService(loadUserByEmailRepository, createUserRepository);
    expect(sut.sing('any_name', 'any_email@mail.com', 'any_password')).rejects.toThrow();
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