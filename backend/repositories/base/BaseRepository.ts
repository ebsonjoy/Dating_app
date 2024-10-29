import { Model, Document } from "mongoose";
import { IRepository } from "../../interfaces/base/IBaseRepository";

export abstract class BaseRepository<T extends Document>
  implements IRepository<T>
{
  constructor(protected readonly model: Model<T>) {}

  async getAll(): Promise<T[]> {
    try {
      return await this.model.find({}).exec();
    } catch (error) {
      console.log(error);
      throw new Error("Failed to retrieve items");
    }
  }

  async getById(id: string): Promise<T> {
    const item = await this.model.findById(id).exec();
    if (!item) throw new Error("Item not found");
    return item;
  }

  async create(item: T): Promise<T> {
    try {
      return await this.model.create(item);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create item");
    }
  }

  async update(id: string, item: Partial<T>): Promise<T> {
    const updated = await this.model
      .findByIdAndUpdate(id, item, { new: true })
      .exec();
    if (!updated) throw new Error("Item not found");
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to delete item");
    }
  }
}
