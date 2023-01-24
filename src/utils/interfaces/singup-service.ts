import User from "../types/user-type";

interface iSingupService {
  sing(name: string, email: string, password: string): Promise<boolean>
}

export default iSingupService;