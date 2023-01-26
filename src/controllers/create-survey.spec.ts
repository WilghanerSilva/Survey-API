import iController from "../utils/interfaces/controller";
import { HttpReq, HttpRes } from "../utils/types/Http-types";
import HttpResponse from "../utils/HttpResponse";
import MissingParamError from "../utils/errors/MissingParam";
import { ObjetiveQuestion, SubjetiveQuestion, Survey } from "@prisma/client";
import iCreateSurveyService from "../utils/interfaces/create-survey-service";
import { iCreateUserRepository }from "../utils/interfaces";
import InvalidDependencyError from "../utils/errors/InvalidDependency";

type AdaptedObjetiveQuestion = Omit<
    ObjetiveQuestion, 
    "id" | "survey" | "surveyId"
>

type AdaptedSubjetiveQuestion = Omit<
    SubjetiveQuestion, 
    "id" | "survey" | "surveyId"
>

type SurveyRequestBody  = {
  objetiveQuestions: AdaptedObjetiveQuestion[],
  subjetiveQuestions: AdaptedSubjetiveQuestion[],
  userId: string
}

class CreateSurveyController implements iController{
	constructor(private readonly createSurveyService: iCreateSurveyService){}

	async route(httpRequest: HttpReq): Promise<HttpRes> {
		const {objetiveQuestions, subjetiveQuestions, userId}: SurveyRequestBody = httpRequest.body;

		if(objetiveQuestions.length === 0 && subjetiveQuestions.length === 0)
			return HttpResponse.badRequest("Questions");

		if(!userId)
			return HttpResponse.serverError();

		if(!this.createSurveyService || !this.createSurveyService.create)
			return HttpResponse.serverError();
    

		return HttpResponse.ok({});
	}
}

const objetiveQuestionFactory = (repeat: number): AdaptedObjetiveQuestion[] => {
	const questions: AdaptedObjetiveQuestion[] = [];

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

const subjetiveQuestionFactory = (repeat: number): AdaptedSubjetiveQuestion[] => {
	const questions: AdaptedSubjetiveQuestion[] = [];

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
		public subjetiveQuestions: AdaptedSubjetiveQuestion[] = [];
		public objetiveQuestions: AdaptedObjetiveQuestion[] = [];
		public survey: Survey = {} as Survey;
    
		async create(
			subjetiveQuestions: AdaptedSubjetiveQuestion[],
			objetiveQuestions: AdaptedObjetiveQuestion[],
			userId: string
		): Promise<Survey> {
			this.subjetiveQuestions = subjetiveQuestions;
			this.objetiveQuestions = objetiveQuestions;

			return this.survey;
		}
	}

	return new CreateSurveyServiceSpy();
};

const makeSut = () => {
	const createSurveyService = makeCreateSurveyService(); 
	const sut = new CreateSurveyController(createSurveyService);
  
	return { sut };
};

describe("CreateSurveyController", () => {
	test("should return 400 if a has no questions", async () => {
		const {sut} = makeSut();

		const httpRequest = {
			body: {
				objetiveQuestions: [],
				subjetiveQuestions: [],
				userId: "any_id"
			},
			headers: {
			}
		};

		const httpResponse = await sut.route(httpRequest);
  
		expect(httpResponse.statusCode).toEqual(400);
		expect(httpResponse.body).toEqual(new MissingParamError("Questions"));
	});

	test("should return 500 if no userId is provided", async () => {
		const { sut } = makeSut();
    
		const httpRequest = {
			body: {
				objetiveQuestions: objetiveQuestionFactory(5),
				subjetiveQuestions: subjetiveQuestionFactory(5),
				userId: ""
			},
			headers: {
			}
		};

		const httpResponse = await sut.route(httpRequest);

		expect(httpResponse.statusCode).toEqual(500);
		expect(httpResponse.body).toEqual("An internal error has ocurred");
	});

	test("should return 500 if invalid CreateSurveyService is provided", async () => {
		const invalidCreateSurveyService = {} as iCreateSurveyService;

		const sut = new CreateSurveyController(invalidCreateSurveyService);

		const httpRequest = {
			body: {
				objetiveQuestions: objetiveQuestionFactory(5),
				subjetiveQuestions: subjetiveQuestionFactory(5),
				userId: "any_id"
			},
			headers: {
			}
		};

		const httpResponse = await sut.route(httpRequest);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toBe("An internal error has ocurred");
	});
});