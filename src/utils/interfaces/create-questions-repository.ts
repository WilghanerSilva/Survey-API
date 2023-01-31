import { AdaptedOpenQuestion, AdaptedClosedQuestion } from "../types/questions-types";
interface iCreateQuestionsRepository {
  create(
    opQuesions: AdaptedOpenQuestion[], 
    clQuestions: AdaptedClosedQuestion[], 
    surveyId: string
  ): Promise<void>
}

export default iCreateQuestionsRepository;