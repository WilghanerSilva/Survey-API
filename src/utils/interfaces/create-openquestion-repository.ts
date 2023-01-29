import { AdaptedOpenQuestion } from "../types/questions-types";
interface iCreateOpenQuestionRepository {
  create(question :AdaptedOpenQuestion, surveyId: string): Promise<void>;
}

export default iCreateOpenQuestionRepository;
