import InvalidDependencyError from "../utils/errors/InvalidDependency";
import { Survey } from "@prisma/client";
import { 
	iCreateQuestionsRepository,
	iCreateSurveyRepository,
	iCreateSurveyService,
	iLoadSurveyByIdRepository 

} from "../utils/interfaces";
import { 
	AdaptedClosedQuestion, 
	AdaptedOpenQuestion 
} from "../utils/types/questions-types";


class CreateSuveryService implements iCreateSurveyService {
	constructor(
    private readonly createSurveyRepo: iCreateSurveyRepository,
    private readonly createQuestionsRepo: iCreateQuestionsRepository,
    private readonly loadSurveyById: iLoadSurveyByIdRepository
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
    
		if(!this.loadSurveyById || !this.loadSurveyById.load)
			throw new InvalidDependencyError("LoadSurveyByIdRepository");

		const surveyId = await this.createSurveyRepo.create(userId);

		await this.createQuestionsRepo.create(openQuestions, closedQuestions, surveyId);

		const survey = await this.loadSurveyById.load(surveyId);

		if(!survey)
			throw new Error("The survey has not created");

		return survey;
	}
}

export default CreateSuveryService;