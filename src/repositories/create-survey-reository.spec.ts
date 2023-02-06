import {iCreateSurveyRepository }from "../utils/interfaces";
import { prismaMock } from "../../singleton";
import prisma from "../../client";

class CreateSurveyRepository implements iCreateSurveyRepository {
	async create(userId: string): Promise<string> {
		const user = await prisma.user.findUnique({
			where: {
				id: userId
			}
		});

		if(!user)
			throw new Error("Invalid user id");
	
		return "any_survey_id";
	}
}

describe("CreateSurveyRepository", () => {
	test("Should trhow if invalid user id is provided", async () => {
		const sut = new CreateSurveyRepository();

		prismaMock.user.findUnique.mockResolvedValue(null);

		expect(sut.create("any_id"))
			.rejects.toThrow(new Error("Invalid user id"));
	});
});