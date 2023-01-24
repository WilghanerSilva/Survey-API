interface iEncrypter {
  compare(password: string, hashedPassword: string): Promise<boolean>;
  crypt(password: string): Promise<string>;
}

export default iEncrypter;