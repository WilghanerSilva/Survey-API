import { Survey } from "@prisma/client";
import { 
	iCreateSurveyService, 
	iCreateSurveyRepository,
	iCreateOpenQuestionRepository,
	iCreateClosedQuestionRepository
} from "../utils/interfaces/index";
import { AdaptedOpenQuestion, AdaptedClosedQuestion } from "../utils/types/questions-types";
import InvalidDependencyError from "../utils/errors/InvalidDependency";

class CreateSuveryService implements iCreateSurveyService {
	constructor(
    private readonly createSurveyRepo: iCreateSurveyRepository,
    private readonly createOpenQuestionRepo: iCreateOpenQuestionRepository,
	){}

	async create(
		openQuestion: AdaptedOpenQuestion[], 
		closedQuestions: AdaptedClosedQuestion[], 
		userId: string
	): Promise<any> {
    
		if(!this.createSurveyRepo || !this.createSurveyRepo.create)
			throw new InvalidDependencyError("CreateSurveyRepository");

		if(!this.createOpenQuestionRepo || !this.createOpenQuestionRepo.create)
			throw new InvalidDependencyError("CreateOpenQuestRepository");
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

const makeCreateOpQuestRepoSpy = () => {
	class CreateOpenQuestionRepository  implements iCreateOpenQuestionRepository{
		public question = {} as AdaptedOpenQuestion;
		public surveyId = "";

		async create(question: AdaptedOpenQuestion, surveyId: string): Promise<void> {
			this.question = question;
			this.surveyId = surveyId;
		}
	}

	return new CreateOpenQuestionRepository();
};

const makeCreateCloseQuestRepoSpy = () => {
	class CreateCQRepository implements iCreateClosedQuestionRepository {
		public question = {} as AdaptedClosedQuestion;
		public surveyId = "";

		async create(question: AdaptedClosedQuestion, surveyId: string): Promise<void> {
			this.question = question;
			this.surveyId = surveyId;
		}
	}
};

const makeSut = () => {
	const createSurveyRepository = makeCreateSurveyRepositorySpy();
	const createOQRepository = makeCreateOpQuestRepoSpy();
	const sut = new CreateSuveryService(
		createSurveyRepository,
		createOQRepository
	);

	return {
		sut,
		createSurveyRepository,
		createOQRepository
	};
};

describe("Create Survey Service", () => {
	test("Should throw an error if an invalid Create Survey Repository is provided", async () => {
		const invalidCreateSurveyRepository = {} as iCreateSurveyRepository;
		const createOQRepository = makeCreateOpQuestRepoSpy();
		const sut = new CreateSuveryService(
			invalidCreateSurveyRepository,
			createOQRepository
		);
		const openQuestions = openQuestionFactory(5);
		const closedQuestions = closedQuestionFactory(5);

		expect(sut.create(openQuestions, closedQuestions, "any_id"))
			.rejects.toThrow(new InvalidDependencyError("CreateSurveyRepository"));
	});

	test("Should throw an error if an invalid CreateSubQuestionRepository is provided", async () => {
		const createOpenQuestionRepository = {} as iCreateOpenQuestionRepository;
		const createSurveyRepository = makeCreateSurveyRepositorySpy();
		const sut = new CreateSuveryService(createSurveyRepository, createOpenQuestionRepository);

		const openQuestions = openQuestionFactory(5);
		const closedQuestions = closedQuestionFactory(5);

		expect(sut.create(openQuestions, closedQuestions, "any_id"))
			.rejects.toThrow(new InvalidDependencyError("CreateQuestionRepository"));
	});
});