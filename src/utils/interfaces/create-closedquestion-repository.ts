import { AdaptedClosedQuestion } from "../types/questions-types"; 

interface iCreateClosedQuestionRepository {
  createOne( question: AdaptedClosedQuestion, surveyId: string): Promise<void>;
  createMany( questions: AdaptedClosedQuestion[], surveyId: string): Promise<void>;
}

export default iCreateClosedQuestionRepository;