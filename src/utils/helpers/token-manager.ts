import iTokenManager from '../interfaces/token-manager';
import MissingParamError from '../errors/MissingParam';
import jwt from 'jsonwebtoken';
import * as fs from 'fs';
const privateKey = fs.readFileSync('src/keys/private.key', 'utf8');

export default class TokenManager implements iTokenManager{
  generate(userId: string): string {
    if(!userId){throw new MissingParamError('userId')}
    const token = jwt.sign(userId, privateKey, {
      expiresIn: 1800,
      algorithm: 'RS256'
    });

    return token;
  }
}