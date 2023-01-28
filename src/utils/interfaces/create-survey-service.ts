import { Survey } from "@prisma/client";
import { AdaptedClosedQuestion, AdaptedOpenQuestion } from "../types/questions-types";

interface iCreateSurveyService {
  create(
    OpenQuestion: AdaptedOpenQuestion[], 
    ClosedQuestions: AdaptedClosedQuestion[], 
    userId: string
  ) : Promise<any>;
}

export default iCreateSurveyService;