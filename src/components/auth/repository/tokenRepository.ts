import BaseRepository, { Repository } from '../../../components/common/repositories/baseRespository';
import { IToken } from '../services/entities';
import mongoose from 'mongoose';
import { Moment } from 'moment';
import { ITokenDoc, ITokenModel } from '../models';

type ITokenRepository = Repository<ITokenDoc> & {
  saveToken: (
    token: string,
    userId: mongoose.Types.ObjectId,
    expires: Moment,
    type: string,
    blacklisted?: boolean,
  ) => Promise<ITokenDoc>;
};

class TokenRepository extends BaseRepository<IToken> implements ITokenRepository {
  private tokenDbClient;
  constructor(tokenDbClient: ITokenModel) {
    super(tokenDbClient);
    this.tokenDbClient = tokenDbClient;
  }

  /**
   * Save a token
   * @param {string} token
   * @param {mongoose.Types.ObjectId} userId
   * @param {Moment} expires
   * @param {string} type
   * @param {boolean} [blacklisted]
   * @returns {Promise<ITokenDoc>}
   */
  saveToken = async (
    token: string,
    userId: mongoose.Types.ObjectId,
    expires: Moment,
    type: string,
    blacklisted: boolean = false,
  ): Promise<ITokenDoc> => {
    return this.tokenDbClient.create({
      token,
      user: userId,
      expires: expires.toDate(),
      type,
      blacklisted,
    });
  };
}
export type { ITokenRepository };
export default TokenRepository;
