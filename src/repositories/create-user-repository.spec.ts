import User from "../utils/types/user-type";
import { prismaMock } from "../../singleton";
import MissingParamError from "../utils/errors/MissingParam";
import CreateUserRepository from "./create-user-repository";



describe("CreateUserRepository", () => {
	test("should trhow if no user is providad", async () => {
		const sut = new CreateUserRepository();
		const user = {} as Omit<User, "id">;

		expect(sut.create(user)).rejects.toThrow(new MissingParamError("Invalid user has sent"));
	});
});