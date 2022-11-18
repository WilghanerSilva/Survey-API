import User from "../types/user-type";

interface iLoadUserByEmailRepository {
  load(email: string) : Promise<User | undefined | null>; 
}

export default iLoadUserByEmailRepository;