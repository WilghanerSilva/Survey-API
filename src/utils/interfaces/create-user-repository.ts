import User from "../types/user-type";

interface iCreateUserRepository {
  create(user: User): Promise<void>;
}

export default iCreateUserRepository;