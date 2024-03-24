import BaseRepository, {
  Repository,
} from '../../../components/common/repositories/baseRespository';
import { IUser } from '../services/entities';
import { IOptions, QueryResult } from '@src/helpers/paginate/paginate';
import mongoose from 'mongoose';
import { IUserDoc, IUserModel } from '../models';

type IUserRepository = Repository<IUser> & {
  queryUsers: (
    query: string,
    filter: Record<string, any>,
    options: IOptions,
  ) => Promise<QueryResult>;
  getUserById: (id: mongoose.Types.ObjectId) => Promise<IUserDoc | null>;
  getUserByEmail: (email: string) => Promise<IUserDoc | null>;
  deleteUserById: (userId: mongoose.Types.ObjectId) => Promise<IUserDoc | null>;
  matchPassword: (user: IUserDoc, password: string) => Promise<boolean>;
  isUsernameTaken: (username: string) => Promise<boolean>;
  isEmailTaken: (email: string) => Promise<boolean>;
};

class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  private userDbClient;
  constructor(userDbClient: IUserModel) {
    super(userDbClient);
    this.userDbClient = userDbClient;
  }

  async queryUsers(
    query: string,
    filter: Record<string, any>,
    options: IOptions,
  ): Promise<QueryResult> {
    if (query) {
      filter = {
        ...filter,
        $or: [{ name: new RegExp(query, 'i') }, { email: new RegExp(query, 'i') }],
      };
    }

    return this.userDbClient.paginate(filter, options);
  }

  async getUserById(id: mongoose.Types.ObjectId): Promise<IUserDoc | null> {
    return this.userDbClient.findById(id);
  }

  async getUserByEmail(email: string): Promise<IUserDoc | null> {
    return this.userDbClient.findOne({ email });
  }

  async deleteUserById(userId: mongoose.Types.ObjectId): Promise<IUserDoc | null> {
    return this.userDbClient.findByIdAndDelete(userId);
  }

  async matchPassword(user: IUserDoc, password: string): Promise<boolean> {
    return user.isPasswordMatch(password);
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    return this.userDbClient.isUsernameTaken(username);
  }

  async isEmailTaken(email: string): Promise<boolean> {
    return this.userDbClient.isEmailTaken(email);
  }
}

export type { IUserRepository };
export default UserRepository;
