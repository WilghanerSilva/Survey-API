import { AdaptedOpenQuestion, AdaptedClosedQuestion } from "../types/questions-types";
import { Survey } from "@prisma/client";
interface iCreateQuestionsRepository {
  create(
    opQuesions: AdaptedOpenQuestion[], 
    clQuestions: AdaptedClosedQuestion[], 
    surveyId: string
  ): Promise<Survey>
}

export default iCreateQuestionsRepository;