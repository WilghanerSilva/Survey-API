import { OpenQuestion, ClosedQuestion} from "@prisma/client";

export type AdaptedClosedQuestion = Omit<
    ClosedQuestion, 
    "id" | "survey" | "surveyId"
>

export type AdaptedOpenQuestion = Omit<
    OpenQuestion, 
    "id" | "survey" | "surveyId"
>