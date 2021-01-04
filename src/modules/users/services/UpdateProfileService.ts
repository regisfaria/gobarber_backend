import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface Request {
  userId: string;
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    userId,
    name,
    email,
    oldPassword,
    password,
  }: Request): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    const emailExists = await this.usersRepository.findByEmail(email);

    if (emailExists && userId !== emailExists.id) {
      throw new AppError('E-mail already in use');
    }

    user.name = name;
    user.email = email;

    if (password && !oldPassword) {
      throw new AppError('Cannot update password without the oldpassword');
    }

    if (password && oldPassword) {
      const checkOldPassword = await this.hashProvider.compareHash(
        oldPassword,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    return user;
  }
}
