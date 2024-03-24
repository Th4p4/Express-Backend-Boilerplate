import { Document, Model, UpdateWriteOpResult } from 'mongoose';

interface Repository<T> {
  create: (data: T) => Promise<T extends Document ? T : any>;
  update: (param: Partial<T>, data: T) => Promise<UpdateWriteOpResult>;
  find: (data: Partial<T>) => Promise<T[]>;
  delete: (data: Partial<T>) => Promise<any>;
  findAll: () => Promise<T[]>;
  findOne: (data: Partial<T>) => Promise<T>;
}

class BaseRepository<T> implements Repository<T> {
  constructor(private dbModel: Model<any>) {}
  async create(data: T) {
    const queryData = await this.dbModel.create(data);
    return queryData;
  }
  async update(param: Partial<T>, data: T) {
    const updatedData = await this.dbModel.updateMany({
      where: { ...param },
      data,
    });
    return updatedData;
  }

  async find(data: Partial<T>) {
    const foundData = await this.dbModel.find(data);
    return foundData;
  }
  async delete(data: Partial<T>) {
    const deletedData = await this.dbModel.deleteMany(data);
    return deletedData;
  }
  async findAll() {
    const allData = await this.dbModel.find();
    return allData;
  }
  async findOne(data: Partial<T>) {
    const foundData = await this.dbModel.findOne(data);
    return foundData;
  }
}
export type { Repository };
export default BaseRepository;
