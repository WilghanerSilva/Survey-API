interface iAuthService{
  authenticate(email: string, password: string): Promise<object|undefined>;
}

export default iAuthService;