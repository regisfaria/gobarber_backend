import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface Request {
  userId: string;
  imageFileName: string;
}

@injectable()
export default class UpdateUserAvatarServie {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ userId, imageFileName }: Request): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    // Delete old image
    if (user.image) {
      await this.storageProvider.deleteFile(user.image);
    }

    const fileName = await this.storageProvider.saveFile(imageFileName);

    user.image = fileName;

    await this.usersRepository.save(user);

    return user;
  }
}
