import { Model, Document } from 'mongoose';
import { IRepository } from '../../interfaces/base/IBaseRepository';

export abstract class BaseRepository<T extends Document> implements IRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async getAll(): Promise<T[]> {
    return this.model.find({}).exec();
  }

  async getById(id: string): Promise<T> { // Keep return type as T
    const item = await this.model.findById(id).exec();
    if (!item) throw new Error('Item not found'); // Throw error if not found
    return item; // Now this can safely return T
  }

  async create(item: T): Promise<T> {
    return this.model.create(item);
  }

  async update(id: string, item: Partial<T>): Promise<T> { // Keep return type as T
    const updated = await this.model.findByIdAndUpdate(id, item, { new: true }).exec();
    if (!updated) throw new Error('Item not found'); // Throw error if not found
    return updated; 
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result; // Return true if deleted, otherwise false
  }
}
