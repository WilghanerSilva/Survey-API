import User from "../types/user-type";

interface iCreateUserRepository {
  create(user: Omit<User, "id">): Promise<void>;
}

export default iCreateUserRepository;