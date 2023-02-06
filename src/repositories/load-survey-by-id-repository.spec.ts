import { Survey } from "@prisma/client";
import { prismaMock } from "../../singleton";
import prisma from "../../client";
import {iLoadSurveyByIdRepository} from "../utils/interfaces";

class LoadSurveyByIdRepository implements iLoadSurveyByIdRepository{
	async load(surveyId: string): Promise<Survey | null> {
		const survey = await prisma.survey.findUnique({
			where: {id: surveyId}
		});

		return survey;
	}
}

describe("LoadSurveyById", () => {
	test("should return null if survey is not found", async () => {
		const sut = new LoadSurveyByIdRepository();

		prismaMock.survey.findUnique.mockResolvedValue(null);

		const survey = await sut.load("any_id");

		expect(survey).toBeNull();
	});

	test("sould return survey if survey is found", async () => {
		const sut = new LoadSurveyByIdRepository();

		const surveyMock: Survey = {
			authorId: "any_id",
			id: "any_id"
		};

		prismaMock.survey.findUnique.mockResolvedValue(surveyMock);

		const survey = await sut.load("any_id");

		expect(survey).toEqual(surveyMock);
	});
});