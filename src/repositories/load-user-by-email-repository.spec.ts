import iLoadUserByEmailRepository from '../utils/interfaces/load-user-by-email-repository';
import User from '../utils/types/user-type';
import MissingParamError from '../utils/errors/MissingParam';

class LoadUserByEmailRepository implements iLoadUserByEmailRepository {
  async load(email: String): Promise<User | undefined>{
    if(!email){throw new MissingParamError('email')}
    return undefined
  }
}

const makeSut = () => {
  const sut = new LoadUserByEmailRepository();
  return sut;
}

describe('LoadUserByEmailRepository', () => {
  test('should trhow if no email is provided', async () => {
    const sut = makeSut();
    expect(sut.load('')).rejects.toThrow(new MissingParamError('email'));
  })
})