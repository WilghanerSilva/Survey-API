interface iAuthService{
  authenticate(email: string, password: string): Promise<String | null>;
}

export default iAuthService;