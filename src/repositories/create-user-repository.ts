import { iCreateUserRepository } from "../utils/interfaces";
import prisma from "../../client";
import User from "../utils/types/user-type";
import MissingParamError from "../utils/errors/MissingParam";

class CreateUserRepository implements iCreateUserRepository {
	async create(user: Omit<User, "id">): Promise<void> {
    
		if(!user.email || !user.name || !user.password)
			throw new MissingParamError("Invalid user has sent");
    
		await prisma.user.create({
			data: {
				...user
			}
		});
	}
}

export default CreateUserRepository;