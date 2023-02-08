import { Survey } from "@prisma/client";
import InvalidDependencyError from "../utils/errors/InvalidDependency";
import CreateSuveryService from "./create-survey-service";
import { 
	iCreateSurveyRepository,
	iCreateQuestionsRepository,
} from "../utils/interfaces/index";
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

const makeCreateSurveyRepositorySpy = () => {
	class CreateSurveyRepositorySpy implements iCreateSurveyRepository {
		public surveyId = "any_survey_id";
		public userId = "";

		async create(userId: string) : Promise<string> {
			this.userId = userId;
			return this.surveyId;
		}
	}

	return new CreateSurveyRepositorySpy();
};

const makeCreateQuestionsRepository = () => {
	class CreateQuestionsRepository implements iCreateQuestionsRepository {
		public openQuestions :AdaptedOpenQuestion[] = [];
		public closedQuestions :AdaptedClosedQuestion[] = [];
		public survey: Survey = { id: "any_id", authorId: "any_id"};
		public surveyId = "";
    
		async create(
			opQuestions: AdaptedOpenQuestion[], 
			clQuestions: AdaptedClosedQuestion[], 
			surveyId: string
		): Promise<Survey> {
			this.openQuestions = opQuestions;
			this.closedQuestions = clQuestions;
			this.surveyId = surveyId;
			return this.survey;
		}
	}

	return new CreateQuestionsRepository();
};

const makeSut = () => {
	const createSurveyRepository = makeCreateSurveyRepositorySpy();
	const createQuestionsRepository  = makeCreateQuestionsRepository();

	const sut = new CreateSuveryService(
		createSurveyRepository,
		createQuestionsRepository,
	);

	return {
		sut,
		createSurveyRepository,
		createQuestionsRepository,
	};
};

describe("Create Survey Service", () => {
	test("Should throw an error if an invalid CreateSurveyRepository is provided", async () => {
		const invalidCreateSurveyRepository = {} as iCreateSurveyRepository;
		const createQuestionsRepo = makeCreateQuestionsRepository();
		const sut = new CreateSuveryService(
			invalidCreateSurveyRepository,
			createQuestionsRepo,
		);

		const openQuestions = openQuestionFactory(5);
		const closedQuestions = closedQuestionFactory(5);

		expect(sut.create(openQuestions, closedQuestions, "any_id"))
			.rejects.toThrow(new InvalidDependencyError("CreateSurveyRepository"));
	});

	test("Should throw an error if an invalid CreateQuestionsRepository is provided", async () => {
		const createOpenQuestionRepository = {} as iCreateQuestionsRepository;
		const createSurveyRepository = makeCreateSurveyRepositorySpy();
		const sut = new CreateSuveryService(
			createSurveyRepository, 
			createOpenQuestionRepository,
		);

		const openQuestions = openQuestionFactory(5);
		const closedQuestions = closedQuestionFactory(5);

		expect(sut.create(openQuestions, closedQuestions, "any_id"))
			.rejects.toThrow(new InvalidDependencyError("CreateQuestionsRepository"));
	});

	test("Should provide correct values for CreateSurveyReposiroty", async () => {
		const { createSurveyRepository, sut } = makeSut();

		const openQuestions = openQuestionFactory(1);
		const closedQuestions = closedQuestionFactory(1);

		await sut.create(openQuestions, closedQuestions, "any_id");

		expect(createSurveyRepository.userId).toEqual("any_id");
	});

	test("Should call CreateSurveyRepsiory with correct values", async () => {
		const { sut, createSurveyRepository} = makeSut();

		const openQuestions = openQuestionFactory(8);
		const closedQuestions = closedQuestionFactory(8);

		await sut.create(openQuestions, closedQuestions, "any_id");

		expect(createSurveyRepository.userId).toEqual("any_id");
	});

	test("Should call CreateQuestions with correct values", async () => {
		const {  sut, createQuestionsRepository} = makeSut();

		const openQuestions = openQuestionFactory(5);
		const closedQuestions = closedQuestionFactory(5);

		await sut.create(openQuestions, closedQuestions, "any_id");

		expect(createQuestionsRepository.closedQuestions).toEqual(closedQuestions);
		expect(createQuestionsRepository.openQuestions).toEqual(openQuestions);
	});

});