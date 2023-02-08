import prisma from "../../client";
import { iCreateSurveyRepository } from "../utils/interfaces";

class CreateSurveyRepository implements iCreateSurveyRepository {
	async create(userId: string): Promise<string> {
		const user = await prisma.user.findUnique({
			where: {
				id: userId
			}
		});

		if(!user)
			throw new Error("Invalid user id");
    
		const survey = await prisma.survey.create({
			data: {
				author: {
					connect: {
						id: userId
					}
				}
			},
      
      
		});

		return survey.id;
	}
}

export default CreateSurveyRepository;