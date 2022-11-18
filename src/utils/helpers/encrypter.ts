import iEncrypter from "../interfaces/encrypter";
import MissingParamError from "../errors/MissingParam";
import bcrypt from 'bcrypt';

export default class Encrypter implements iEncrypter{
  async compare(password: string, hashedPassword: string): Promise<Boolean> {
    if(!password){throw new MissingParamError('password')};
    if(!hashedPassword){throw new MissingParamError('hashedPassword')};
    return await bcrypt.compare(password, hashedPassword);
  }
}
