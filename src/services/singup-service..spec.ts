import MissingParamError from '../utils/errors/MissingParam';
import iSingupService from '../utils/interfaces/singup-service';
import iLoadUserByEmailRepository from '../utils/interfaces/load-user-by-email-repository';
import User from '../utils/types/user-type';

class SingupService implements iSingupService {
  constructor(private readonly loadUserByEmailRepository: iLoadUserByEmailRepository){}

  async sing(name: string, email: string, password: string): Promise<boolean> {
    if(!name){throw new MissingParamError('name')};
    if(!email){throw new MissingParamError('email')};
    if(!password){throw new MissingParamError('password')};
    
    if(!this.loadUserByEmailRepository || !this.loadUserByEmailRepository.load)
      throw new Error("Invalid LoadUserByEmailRepository");

    if(!!this.loadUserByEmailRepository.load(email))
      return false
    
    return true;
  }
}

class LoadUserByEmailRepositorySpy implements iLoadUserByEmailRepository{
  public user: User | null | undefined = null;

  async load(email: string): Promise<User | null | undefined> {
    return this.user;
  }
}


const makeSut = () =>{
  const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy();
  const sut = new SingupService(
    loadUserByEmailRepository
  );
  return {sut, loadUserByEmailRepository};
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
    const sut = new SingupService(loadUserByEmailRepository);
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