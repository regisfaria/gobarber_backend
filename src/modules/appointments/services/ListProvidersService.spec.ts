import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list all providers except the logged user', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'somepass',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'johntre@example.com',
      password: 'somepass',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'John Qua',
      email: 'johnqua@example.com',
      password: 'somepass',
    });

    const providers = await listProviders.execute({ userId: loggedUser.id });

    // toEqual is used to check if elements are the same
    // if I've used toBe, this test would've failed
    // since below array isn't the same array as providers.
    expect(providers).toEqual([user1, user2]);
  });
});
