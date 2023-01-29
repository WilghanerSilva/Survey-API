import { AdaptedClosedQuestion } from "../types/questions-types"; 

interface iCreateClosedQuestionRepository {
  create( question: AdaptedClosedQuestion, surveyId: string): Promise<void>;
}

export default iCreateClosedQuestionRepository;