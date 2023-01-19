interface iEncrypter {
  compare(password: string, hashedPassword: string): Promise<Boolean>;
  crypt(password: string): Promise<string>;
}

export default iEncrypter;