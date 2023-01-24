interface iAuthService{
  authenticate(email: string, password: string): Promise<string | null>;
}

export default iAuthService;