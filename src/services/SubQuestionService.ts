import { AppDataSource } from "../data-source";
import { SubQuestion } from "../entities/SubQuestion";

export class SubQuestionService {
  private subQuestionRepository = AppDataSource.getRepository(SubQuestion);

  async getAllSubQuestions(): Promise<SubQuestion[]> {
    return await this.subQuestionRepository.find();
  }

  async getSubQuestionById(id: number): Promise<SubQuestion | null> {
    return await this.subQuestionRepository.findOne({
      where: { id },
    });
  }

  async createSubQuestion(data: Partial<SubQuestion>): Promise<SubQuestion> {
    const subQuestion = this.subQuestionRepository.create({ ...data });
    return await this.subQuestionRepository.save(subQuestion);
  }

  async updateSubQuestion(
    id: number,
    data: Partial<SubQuestion>
  ): Promise<SubQuestion | null> {
    const subQuestion = await this.subQuestionRepository.findOneBy({ id });
    if (!subQuestion) {
      return null;
    }
    this.subQuestionRepository.merge(subQuestion, data);
    return await this.subQuestionRepository.save(subQuestion);
  }

  async deleteSubQuestion(id: number): Promise<boolean> {
    const result = await this.subQuestionRepository.delete(id);
    return result.affected !== 0;
  }
}
