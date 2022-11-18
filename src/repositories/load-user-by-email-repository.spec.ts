import iLoadUserByEmailRepository from '../utils/interfaces/load-user-by-email-repository';
import User from '../utils/types/user-type';
import MissingParamError from '../utils/errors/MissingParam';
import { prismaMock } from '../../singleton';
import prisma from '../../client';

class LoadUserByEmailRepository implements iLoadUserByEmailRepository {
  async load(email: string): Promise<User | undefined | null>{
    if(!email){throw new MissingParamError('email')}
    
    const user = await prisma.user.findUnique({where:{email:email}});

    return user;
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

  test('should return null if no user is found', async () => {
    const sut = makeSut();
    
    prismaMock.user.findUnique.mockResolvedValue(null);

    const user = await sut.load('invalid_email@mail.com');
    expect(user).toBeNull();
  })

  test('should return an user if user if found', async () => {
    const sut = makeSut();
    const dbUser = {
      id:'any_id',
      name: 'any_name',
      email: 'valid_email@mail.com',
      password: 'any_password'
    }

    prismaMock.user.findUnique.mockResolvedValue(dbUser);

    const user = await sut.load('valid_email@mail.com');
    expect(user).toBe(dbUser);
  })
})