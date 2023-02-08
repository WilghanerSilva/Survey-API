import { prismaMock } from "../../singleton";
import { Survey } from "@prisma/client";
import CreateSurveyRepository from "./create-survey-repository";

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