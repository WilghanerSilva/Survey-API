import prisma from '../../client';
import User from '../utils/types/user-type';
import {iLoadUserByEmailRepository} from "../utils/interfaces";
import MissingParamError from '../utils/errors/MissingParam';

export class LoadUserByEmailRepository implements iLoadUserByEmailRepository {
  async load(email: string): Promise<User | undefined | null>{
    if(!email){throw new MissingParamError('email')}
    
    const user = await prisma.user.findUnique({where:{email:email}});

    return user;
  }
}