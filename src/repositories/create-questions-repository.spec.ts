import { iCreateQuestionsRepository } from "../utils/interfaces";
import { prismaMock } from "../../singleton";
import prisma from "../../client";
import { Survey, OpenQuestion } from "@prisma/client";
import { 
	AdaptedOpenQuestion, 
	AdaptedClosedQuestion 
} from "../utils/types/questions-types";

class CreateQuestionsRepository implements iCreateQuestionsRepository {
	async create(
		opQuesions: AdaptedOpenQuestion[], 
		clQuestions: AdaptedClosedQuestion[], 
		surveyId: string
	): Promise<Survey> {
		
		const survey = await prisma.survey.update({
			where: {id: surveyId},
			data: {
				objetiveQuestions: {
					createMany: {
						data: {
							...clQuestions
						}
					}
				},
				subjetiveQuestions: {
					createMany: {
						data: {
							...opQuesions
						}
					}
				}
			}
		});

		return survey;
	}
}

const closedQuestionFactory = (repeat: number): AdaptedClosedQuestion[] => {
	const questions: AdaptedClosedQuestion[] = [];

	for (let index = 0; index < repeat; index++) {
		questions.push({
			questionNumber: index,
			question: "Any_question",
			item_A: "any_item",
			item_B: "any_item",
			item_C: "any_item",
			item_D: "any_item",
			item_E: "any_item",
		});
	}

	return questions;
};

const openQuestionFactory = (repeat: number): AdaptedOpenQuestion[] => {
	const questions: AdaptedOpenQuestion[] = [];

	for ( let index = 0; index < repeat; index++) {
		questions.push({
			questionNumber: index,
			question: "Any_question",
		});
	}

	return questions;
};

describe("CreateQuestionsRepository", () => {
	test("expect returns survey if everything ok", async () => {
		const sut = new CreateQuestionsRepository();

		const openQuestions = openQuestionFactory(5);
		const closedQuestions = closedQuestionFactory(5);
    
		const mockedSurvey: Survey = {
			authorId: "any_id",
			id: "any_id"
		};

		prismaMock.survey.update.mockResolvedValue(mockedSurvey);

		const survey = await sut.create( openQuestions, closedQuestions, "any_id");

		expect(survey).toEqual(mockedSurvey);
	});
});