import { AdaptedClosedQuestion, AdaptedOpenQuestion } from "../utils/types/questions-types";
import { iCreateQuestionsRepository } from "../utils/interfaces";
import { Survey } from "@prisma/client";
import prisma from "../../client";

class CreateQuestionsRepository implements iCreateQuestionsRepository {
	async create(
		opQuesions: AdaptedOpenQuestion[], 
		clQuestions: AdaptedClosedQuestion[], 
		surveyId: string
	): Promise<Survey> {
		
		const survey = await prisma.survey.update({
			where: {id: surveyId},
			data: {
				objetiveQuestions: {
					createMany: {
						data: {
							...clQuestions
						}
					}
				},
				subjetiveQuestions: {
					createMany: {
						data: {
							...opQuesions
						}
					}
				}
			}
		});

		return survey;
	}
}


export default CreateQuestionsRepository;