import { ObjetiveQuestion, SubjetiveQuestion} from "@prisma/client";

export type AdaptedClosedQuestion = Omit<
    ObjetiveQuestion, 
    "id" | "survey" | "surveyId"
>

export type AdaptedOpenQuestion = Omit<
    SubjetiveQuestion, 
    "id" | "survey" | "surveyId"
>