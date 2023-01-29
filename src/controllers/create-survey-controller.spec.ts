import { Survey } from "@prisma/client";
import iCreateSurveyService from "../utils/interfaces/create-survey-service";
import CreateSurveyController from "./create-survey-controller";
import { AdaptedOpenQuestion, AdaptedClosedQuestion } from "../utils/types/questions-types";

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

const makeCreateSurveyService = () => {
	class CreateSurveyServiceSpy implements iCreateSurveyService{
		public openQuestions: AdaptedOpenQuestion[] = [];
		public closedQuestions: AdaptedClosedQuestion[] = [];
		public userId = "";
		public survey: Survey = {} as Survey;
    
		async create(
			openQuestions: AdaptedOpenQuestion[],
			closedQuestions: AdaptedClosedQuestion[],
			userId: string
		): Promise<Survey> {
			this.openQuestions = openQuestions;
			this.closedQuestions = closedQuestions;
			this.userId = userId;

			return this.survey;
		}
	}

	return new CreateSurveyServiceSpy();
};

const makeSut = () => {
	const createSurveyService = makeCreateSurveyService(); 
	const sut = new CreateSurveyController(createSurveyService);
  
	return { sut, createSurveyService };
};

describe("CreateSurveyController", () => {
	test("should return 400 if a has no questions", async () => {
		const {sut} = makeSut();

		const httpRequest = {
			body: {
				closedQuestions: [],
				openQuestions: [],
				userId: "any_id"
			},
			headers: {
			}
		};

		const httpResponse = await sut.route(httpRequest);
  
		expect(httpResponse.statusCode).toEqual(400);
		expect(httpResponse.body.message).toEqual("Missing param: Questions");
	});

	test("should return 500 if no userId is provided", async () => {
		const { sut } = makeSut();
    
		const httpRequest = {
			body: {
				closedQuestions: closedQuestionFactory(5),
				openQuestions: openQuestionFactory(5),
				userId: ""
			},
			headers: {
			}
		};

		const httpResponse = await sut.route(httpRequest);

		expect(httpResponse.statusCode).toEqual(500);
		expect(httpResponse.body.message).toEqual("An internal error has ocurred");
	});
  
	test("should return 500 if invalid CreateSurveyService is provided", async () => {
		const invalidCreateSurveyService = {} as iCreateSurveyService;
    
		const sut = new CreateSurveyController(invalidCreateSurveyService);
    
		const httpRequest = {
			body: {
				closedQuestions: closedQuestionFactory(5),
				openQuestions: openQuestionFactory(5),
				userId: "any_id"
			},
			headers: {
			}
		};

		const httpResponse = await sut.route(httpRequest);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body.message).toBe("An internal error has ocurred");
	});

	test("should correct questions is send to CreateSurveyService", async () => {
		const { sut, createSurveyService} = makeSut();

		const closedQuestions = closedQuestionFactory(2);
		const openQuestions = openQuestionFactory(2);

		const httpRequest = {
			body: {
				closedQuestions,
				openQuestions,
				userId: "any_id"
			},
			headers: {
			}
		};

		await sut.route(httpRequest);

		expect(createSurveyService.closedQuestions).toEqual(closedQuestions);
		expect(createSurveyService.openQuestions).toEqual(openQuestions);
		expect(createSurveyService.userId).toEqual("any_id");
	});
  
	test("should return server error if any dependency throw error", async () => {
		const createSurveyService = {
			create: () => {
				throw new Error();
			}
		} as iCreateSurveyService;

		const sut = new CreateSurveyController(createSurveyService);
    
		const httpRequest = {
			body: {
				closedQuestions: closedQuestionFactory(5),
				openQuestions: openQuestionFactory(5),
				userId: "any_id"
			},
			headers: {
			}
		};

		const httpResponse = await sut.route(httpRequest);

		expect(httpResponse.statusCode).toEqual(500);
    
	});

	test("should return 200 and the survey object on body if everything is ok", async () => {
		const { sut, createSurveyService } = makeSut();

		const survey: Survey = {
			id: "survey_id",
			authorId: "user_id"
		};

		createSurveyService.survey = survey;

		const httpRequest = {
			body: {
				closedQuestions: closedQuestionFactory(5),
				openQuestions: openQuestionFactory(5),
				userId: "any_id"
			},
			headers: {
			}
		};

		const httpResponse = await sut.route(httpRequest);
		
		expect(httpResponse.statusCode).toEqual(200);
		expect(httpResponse.body.data).toEqual(survey);
	});
});