import { AppDataSource } from "../data-source";
import { Address } from "../entities/Address";
import { User } from "../entities/User";

export class AddressService {
  private addressRepository = AppDataSource.getRepository(Address);
  private userRepository = AppDataSource.getRepository(User);

  async getAllAddresses(): Promise<Address[]> {
    return await this.addressRepository.find();
  }

  async getAllAddressesByUserName(userName: string): Promise<Address[]> {
    return await this.addressRepository.find({
      where: { user: { name: userName } },
    });
  }

  async getAddressById(id: number): Promise<Address | null> {
    return await this.addressRepository.findOne({
      where: { id },
    });
  }

  async createAddress(data: Partial<Address>): Promise<Address> {
    const user = await this.userRepository.findOneBy({
      id: data.user?.id,
    });
    if (!user) {
      throw new Error("Departamento não encontrado");
    }
    const address = this.addressRepository.create({ ...data, user });
    return await this.addressRepository.save(address);
  }

  async updateAddress(
    id: number,
    data: Partial<Address>
  ): Promise<Address | null> {
    const address = await this.addressRepository.findOneBy({ id });
    if (!address) {
      return null;
    }
    this.addressRepository.merge(address, data);
    return await this.addressRepository.save(address);
  }

  async deleteAddress(id: number): Promise<boolean> {
    const result = await this.addressRepository.delete(id);
    return result.affected !== 0;
  }
}
