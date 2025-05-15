import { Request, Response } from "express";
import { AddressService } from "../services/AddressService";

export class AddressController {
  private addressService = new AddressService();

  public getAllAddresses = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const addresses = await this.addressService.getAllAddresses();
      res.json(addresses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getByUserName = async (req: Request, res: Response): Promise<void> => {
    try {
      const userName = req.body.name;
      const addresses = await this.addressService.getAllAddressesByUserName(
        userName
      );
      res.json(addresses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getAddressById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const address = await this.addressService.getAddressById(id);
      if (!address) {
        res.status(404).json({ message: "Address não encontrado" });
      }
      res.json(address);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public createAddress = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      const address = await this.addressService.createAddress(data);
      res.status(201).json(address);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateAddress = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const address = await this.addressService.updateAddress(id, data);
      if (!address) {
        res.status(404).json({ message: "Address não encontrado" });
      }
      res.json(address);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public deleteAddress = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const success = await this.addressService.deleteAddress(id);
      if (!success) {
        res.status(404).json({ message: "Address não encontrado" });
      }
      res.json({ message: "Address deletado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
