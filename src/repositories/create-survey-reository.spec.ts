import {iCreateSurveyRepository }from "../utils/interfaces";
import { prismaMock } from "../../singleton";
import prisma from "../../client";
import { Survey } from "@prisma/client";

class CreateSurveyRepository implements iCreateSurveyRepository {
	async create(userId: string): Promise<string> {
		const user = await prisma.user.findUnique({
			where: {
				id: userId
			}
		});

		if(!user)
			throw new Error("Invalid user id");
    
		const survey = await prisma.survey.create({
			data: {
				author: {
					connect: {
						id: userId
					}
				}
			},
      
      
		});

		return survey.id;
	}
}

describe("CreateSurveyRepository", () => {
	test("Should trhow if invalid user id is provided", async () => {
		const sut = new CreateSurveyRepository();

		prismaMock.user.findUnique.mockResolvedValue(null);

		expect(sut.create("any_id"))
			.rejects.toThrow(new Error("Invalid user id"));
	});

	test("Shold return surveyId if everything is ok", async () => {
		const sut = new CreateSurveyRepository();

		const mockedSurvey : Survey = {
			authorId: "any_id",
			id: "any_id"
		};

		prismaMock.survey.create.mockResolvedValue(mockedSurvey);
		prismaMock.user.findUnique.mockResolvedValue({
			email: "any_email@mail.com",
			name: "any_name",
			id: "any_id",
			password: "hashed_password"
		});

		const surveyId = await sut.create("any_id");

		expect(surveyId).toEqual(mockedSurvey.id);
	});
});