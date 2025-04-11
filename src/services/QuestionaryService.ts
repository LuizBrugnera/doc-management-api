import { AppDataSource } from "../data-source";
import { Questionary } from "../entities/Questionary";
import { Department } from "../entities/Department";

export class QuestionaryService {
  private questionaryRepository = AppDataSource.getRepository(Questionary);

  async getAllQuestionarys(): Promise<Questionary[]> {
    return await this.questionaryRepository.find();
  }

  public async generateUniqueHash(length = 5): Promise<string> {
    const maxAttempts = 10000;

    for (let i = 0; i < maxAttempts; i++) {
      const hash = Math.floor(Math.random() * Math.pow(10, length))
        .toString()
        .padStart(length, "0");

      const exists = await this.checkIfExistsQuestionsWithHash(hash);
      if (!exists) return hash;
    }

    throw new Error("Não foi possível gerar um hash único.");
  }

  async checkIfExistsQuestionsWithCpf(cpf: string): Promise<boolean> {
    const exists = await this.questionaryRepository.findOne({
      where: { cpf },
    });
    return !!exists;
  }
  async checkIfExistsQuestionsWithHash(hash: string): Promise<boolean> {
    const exists = await this.questionaryRepository.findOne({
      where: { hash },
    });
    return !!exists;
  }

  async getQuestionaryById(id: number): Promise<Questionary | null> {
    return await this.questionaryRepository.findOne({
      where: { id },
    });
  }

  async createQuestionary(data: Partial<Questionary>): Promise<Questionary> {
    const hash = await this.generateUniqueHash();
    const questionary = this.questionaryRepository.create({ ...data, hash });
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
