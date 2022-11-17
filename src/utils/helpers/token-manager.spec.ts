import MissingParamError from '../errors/MissingParam';
import iTokenManager from '../../interfaces/token-manager';


class TokenManager implements iTokenManager{
  generate(userId: string): string {
    if(!userId){throw new MissingParamError('userId')}
    return 'token';
  }
}

describe('Token Manager', () => {
  test('shold throw error if empty userId is send to generate method', () => {
      const sut = new TokenManager();
      expect(()=>{sut.generate('')}).toThrow(new MissingParamError('userId'));
  })
})