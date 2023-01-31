import { Survey } from "@prisma/client";

interface iLoadSurveyByIdRepository  {
  load(surveyId: string): Promise<Survey | null>;
}

export default iLoadSurveyByIdRepository;