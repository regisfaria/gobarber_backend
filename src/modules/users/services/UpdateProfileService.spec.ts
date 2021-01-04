import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'examplepass',
    });

    const updatedUser = await updateProfile.execute({
      userId: user.id,
      name: 'Gisre',
      email: 'gisreriafa@mailg.com',
    });

    expect(updatedUser.name).toBe('Gisre');
    expect(updatedUser.email).toBe('gisreriafa@mailg.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'examplepass',
    });

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'test@example.com',
      password: 'examplepass',
    });

    await expect(
      updateProfile.execute({
        userId: user.id,
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'examplepass',
    });

    const updatedUser = await updateProfile.execute({
      userId: user.id,
      name: 'Gisre',
      email: 'gisreriafa@mailg.com',
      oldPassword: 'examplepass',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without oldpassword', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'examplepass',
    });

    await expect(
      updateProfile.execute({
        userId: user.id,
        name: 'Gisre',
        email: 'gisreriafa@mailg.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong oldpassword', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'examplepass',
    });

    await expect(
      updateProfile.execute({
        userId: user.id,
        name: 'Gisre',
        email: 'gisreriafa@mailg.com',
        oldPassword: 'wrongOldPassword',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update profile from a non-existing user', async () => {
    await expect(
      updateProfile.execute({
        userId: 'non-existing-user-id',
        name: 'Gisre',
        email: 'gisreriafa@mailg.com',
        oldPassword: '123123',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
