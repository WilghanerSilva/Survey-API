import { iCreateUserRepository } from "../utils/interfaces";
import User from '../utils/types/user-type';
import { prismaMock } from '../../singleton';
import prisma from "../../client";
import MissingParamError from '../utils/errors/MissingParam';

class CreateUserRepository implements iCreateUserRepository {
  async create(user: Omit<User, "id">): Promise<void> {
    
    if(!user.email || !user.name || !user.password)
      throw new MissingParamError("Invalid user has sent");
    
    await prisma.user.create({
            data: {
        ...user
      }
    })
  }
}


describe('CreateUserRepository', () => {
  test('should trhow if no user is providad', async () => {
    const sut = new CreateUserRepository();
    const user = {} as Omit<User, "id">;

    expect(sut.create(user)).rejects.toThrow(new MissingParamError("Invalid user has sent"));
  })
})