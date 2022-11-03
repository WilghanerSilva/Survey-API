interface iAuthService{
  authenticate(email: string, password: string): Promise<String | undefined>;
}

export default iAuthService;