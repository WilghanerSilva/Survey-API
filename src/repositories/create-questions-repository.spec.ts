import { prismaMock } from "../../singleton";
import { Survey } from "@prisma/client";
import CreateQuestionsRepository from "./create-questions-repository";
import { 
	AdaptedOpenQuestion, 
	AdaptedClosedQuestion 
} from "../utils/types/questions-types";


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