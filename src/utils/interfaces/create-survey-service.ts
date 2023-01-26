import { SubjetiveQuestion, ObjetiveQuestion, Survey } from "@prisma/client";

type AdaptedObjetiveQuestion = Omit<
    ObjetiveQuestion, 
    "id" | "survey" | "surveyId"
>

type AdaptedSubjetiveQuestion = Omit<
    SubjetiveQuestion, 
    "id" | "survey" | "surveyId"
>

interface iCreateSurveyService {
  create(
    SubjetiveQuestion: AdaptedSubjetiveQuestion[], 
    ObjetiveQuestions: AdaptedObjetiveQuestion[], 
    userId: string
  ) : Promise<Survey>;
}

export default iCreateSurveyService;