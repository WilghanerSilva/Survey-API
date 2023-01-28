interface iCreateSurveyRepository {
  create(userId: string): Promise<string>;
};

export default iCreateSurveyRepository;