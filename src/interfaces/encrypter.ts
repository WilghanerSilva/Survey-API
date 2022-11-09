interface iEncrypter {
  compare(password: string, hashedPassword: string): Boolean;
}

export default iEncrypter;