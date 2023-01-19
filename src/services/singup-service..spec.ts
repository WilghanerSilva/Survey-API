import MissingParamError from '../utils/errors/MissingParam';
import { iLoadUserByEmailRepository, iSingupService, iCreateUserRepository } from "../utils/interfaces";
import User from '../utils/types/user-type';

class SingupService implements iSingupService {
  constructor(
    private readonly loadUserByEmailRepository: iLoadUserByEmailRepository,
    private readonly createUserRepository: iCreateUserRepository,
    ){}

  async sing(name: string, email: string, password: string): Promise<boolean> {
    if(!name){throw new MissingParamError('name')};
    if(!email){throw new MissingParamError('email')};
    if(!password){throw new MissingParamError('password')};
    
    if(!this.loadUserByEmailRepository || !this.loadUserByEmailRepository.load)
      throw new Error("Invalid LoadUserByEmailRepository");
    
    if(!this.createUserRepository || !this.createUserRepository.create)
      throw new Error("Invalid CreateUserRepository");

    if(!!this.loadUserByEmailRepository.load(email))
      return false;
    
    
    
    return true;
  }
}

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

})