import { AppDataSource } from "../data-source";
import { Questionary } from "../entities/Questionary";
import { Department } from "../entities/Department";

export class QuestionaryService {
  private questionaryRepository = AppDataSource.getRepository(Questionary);

  async getAllQuestionarys(): Promise<Questionary[]> {
    return await this.questionaryRepository.find();
  }

  async getQuestionaryById(id: number): Promise<Questionary | null> {
    return await this.questionaryRepository.findOne({
      where: { id },
    });
  }

  async createQuestionary(data: Partial<Questionary>): Promise<Questionary> {
    const questionary = this.questionaryRepository.create({
      ...data,
    });
    return await this.questionaryRepository.save(questionary);
  }

  async updateQuestionary(
    id: number,
    data: Partial<Questionary>
  ): Promise<Questionary | null> {
    const questionary = await this.questionaryRepository.findOneBy({ id });
    if (!questionary) {
      return null;
    }
    this.questionaryRepository.merge(questionary, data);
    return await this.questionaryRepository.save(questionary);
  }

  async deleteQuestionary(id: number): Promise<boolean> {
    const result = await this.questionaryRepository.delete(id);
    return result.affected !== 0;
  }
}
