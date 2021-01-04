import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import ResetPasswordService from './ResetPasswordService';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generatedHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({ password: '123123', token });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generatedHash).toHaveBeenCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });

  it('should not reset password with a non-existing token', async () => {
    expect(
      resetPassword.execute({ password: '123123', token: 'unexisting token' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not reset password with a non-existing token', async () => {
    await expect(
      resetPassword.execute({ password: '123123', token: 'unexisting token' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not reset password from a non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate('123123213');

    await expect(
      resetPassword.execute({ password: '123123', token }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password after token expires', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    //  Mock will make the selected function on spy execute the function I've written inside the arrow function
    // the mockImplementationOnce only will overwrite the selected function one time
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({ password: '123123', token }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
