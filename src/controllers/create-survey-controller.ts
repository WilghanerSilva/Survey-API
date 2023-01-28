import iController from "../utils/interfaces/controller";
import { HttpReq, HttpRes } from "../utils/types/Http-types";
import HttpResponse from "../utils/HttpResponse";
import InvalidDependencyError from "../utils/errors/InvalidDependency";
import iCreateSurveyService from "../utils/interfaces/create-survey-service";
import { AdaptedClosedQuestion, AdaptedSubjetiveQuestion } from "../utils/types/questions-types";

type SurveyRequestBody  = {
  closedQuestions: AdaptedClosedQuestion[],
  subjetiveQuestions: AdaptedSubjetiveQuestion[],
  userId: string
}


class CreateSurveyController implements iController{
	constructor(private readonly createSurveyService: iCreateSurveyService){}

	async route(httpRequest: HttpReq): Promise<HttpRes> {
		const {ClosedQuestions, subjetiveQuestions, userId}: SurveyRequestBody = httpRequest.body;

		if(ClosedQuestions.length === 0 && subjetiveQuestions.length === 0)
			return HttpResponse.badRequest("Questions");

		if(!userId)
			return HttpResponse.serverError();

		if(!this.createSurveyService || !this.createSurveyService.create){
			console.error(new InvalidDependencyError("CreateSurveyService"));
      
			return HttpResponse.serverError();
		}
    
		try {
			const survey  = await this.createSurveyService.create(
				subjetiveQuestions, 
				ClosedQuestions, 
				userId
			);

			return HttpResponse.ok(survey);
		
		} catch (error) {

			console.error(error);
			return HttpResponse.serverError();
		}
	}
}

export default CreateSurveyController;