import InvalidDependencyError from "../utils/errors/InvalidDependency";
import { Survey } from "@prisma/client";
import { 
	iCreateQuestionsRepository,
	iCreateSurveyRepository,
	iCreateSurveyService,
} from "../utils/interfaces";
import { 
	AdaptedClosedQuestion, 
	AdaptedOpenQuestion 
} from "../utils/types/questions-types";


class CreateSuveryService implements iCreateSurveyService {
	constructor(
    private readonly createSurveyRepo: iCreateSurveyRepository,
    private readonly createQuestionsRepo: iCreateQuestionsRepository,
	){}

	async create(
		openQuestions: AdaptedOpenQuestion[], 
		closedQuestions: AdaptedClosedQuestion[], 
		userId: string
	): Promise<Survey> {
    
		if(!this.createSurveyRepo || !this.createSurveyRepo.create)
			throw new InvalidDependencyError("CreateSurveyRepository");

		if(!this.createQuestionsRepo || !this.createQuestionsRepo.create)
			throw new InvalidDependencyError("CreateQuestionsRepository");

		const surveyId = await this.createSurveyRepo.create(userId);

		const survey = await this.createQuestionsRepo.create(openQuestions, closedQuestions, surveyId);

		if(!survey)
			throw new Error("The survey has not created");

		return survey;
	}
}

export default CreateSuveryService;