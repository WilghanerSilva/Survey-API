import iController from "../utils/interfaces/controller";
import { HttpReq, HttpRes } from "../utils/types/Http-types";
import HttpResponse from "../utils/HttpResponse";
import MissingParamError from "../utils/errors/MissingParam";

type surveyRequestBody  = {
  objetiveQuestions: [],
  subjetiveQuestions: []
}

class CreateSurveyController implements iController{
	async route(httpRequest: HttpReq): Promise<HttpRes> {
		const {objetiveQuestions, subjetiveQuestions}: surveyRequestBody = httpRequest.body;

		if(objetiveQuestions.length === 0 && subjetiveQuestions.length === 0)
			return HttpResponse.badRequest("Questions");

		return HttpResponse.ok({});
	}
}

const makeSut = () => {
	const sut = new CreateSurveyController();
  
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
});