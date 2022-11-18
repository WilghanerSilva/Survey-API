interface iEncrypter {
  compare(password: string, hashedPassword: string): Promise<Boolean>;
}

export default iEncrypter;