interface iTokenManager {
  generate(userId: string): string,
  verify(token: string): string | {userId: string}
}

export default iTokenManager;