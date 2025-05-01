import { AppDataSource } from "../data-source";
import { Question } from "../entities/Question";

export class QuestionService {
  private questionRepository = AppDataSource.getRepository(Question);

  async getAllQuestions(): Promise<Question[]> {
    return await this.questionRepository.find({ relations: ["subQuestions"] });
  }

  async getQuestionById(id: number): Promise<Question | null> {
    return await this.questionRepository.findOne({
      where: { id },
    });
  }

  async createQuestion(data: Partial<Question>): Promise<Question> {
    const question = this.questionRepository.create({ ...data });
    return await this.questionRepository.save(question);
  }

  async updateQuestion(
    id: number,
    data: Partial<Question>
  ): Promise<Question | null> {
    const question = await this.questionRepository.findOneBy({ id });
    if (!question) {
      return null;
    }
    this.questionRepository.merge(question, data);
    return await this.questionRepository.save(question);
  }

  async deleteQuestion(id: number): Promise<boolean> {
    const result = await this.questionRepository.delete(id);
    return result.affected !== 0;
  }
}
