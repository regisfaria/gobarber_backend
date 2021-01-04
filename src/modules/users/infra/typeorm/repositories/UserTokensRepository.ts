import { getRepository, Repository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const foundToken = await this.ormRepository.findOne({ where: { token } });

    return foundToken;
  }

  public async generate(userId: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({ userId });

    await this.ormRepository.save(userToken);

    return userToken;
  }
}

export default UserTokensRepository;
