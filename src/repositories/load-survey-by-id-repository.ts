import { Survey } from "@prisma/client";
import prisma from "../../client";
import {iLoadSurveyByIdRepository} from "../utils/interfaces";

class LoadSurveyByIdRepository implements iLoadSurveyByIdRepository{
	async load(surveyId: string): Promise<Survey | null> {
		const survey = await prisma.survey.findUnique({
			where: {id: surveyId}
		});

		return survey;
	}
}

export default LoadSurveyByIdRepository;