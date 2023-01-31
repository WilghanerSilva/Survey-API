import { AdaptedOpenQuestion } from "../types/questions-types";
interface iCreateOpenQuestionRepository {
  createOne( question :AdaptedOpenQuestion, surveyId: string): Promise<void>;
  createMany( question: AdaptedOpenQuestion[], surveyId: string): Promise<void>;
}

export default iCreateOpenQuestionRepository;
