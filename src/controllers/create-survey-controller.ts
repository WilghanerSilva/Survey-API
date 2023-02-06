import iController from "../utils/interfaces/controller";
import { HttpReq, HttpRes } from "../utils/types/Http-types";
import HttpResponse from "../utils/HttpResponse";
import InvalidDependencyError from "../utils/errors/InvalidDependency";
import iCreateSurveyService from "../utils/interfaces/create-survey-service";
import { AdaptedClosedQuestion, AdaptedOpenQuestion } from "../utils/types/questions-types";

type SurveyRequestBody  = {
  closedQuestions: AdaptedClosedQuestion[],
  openQuestions: AdaptedOpenQuestion[],
  userId: string
}


class CreateSurveyController implements iController{
	constructor(private readonly createSurveyService: iCreateSurveyService){}

	async route(httpRequest: HttpReq): Promise<HttpRes> {
		const {closedQuestions, openQuestions, userId}: SurveyRequestBody = httpRequest.body;

		if(!closedQuestions && !openQuestions)
			return HttpResponse.badRequest("Questions");

		if(closedQuestions.length === 0 && openQuestions.length === 0)
			return HttpResponse.badRequest("Questions");

		if(!userId)
			return HttpResponse.serverError();

		if(!this.createSurveyService || !this.createSurveyService.create){
			console.error(new InvalidDependencyError("CreateSurveyService"));
      
			return HttpResponse.serverError();
		}
    
		try {
			const survey  = await this.createSurveyService.create(
				openQuestions, 
				closedQuestions, 
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