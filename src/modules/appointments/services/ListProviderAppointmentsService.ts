import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  providerId: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
export default class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    providerId,
    month,
    year,
    day,
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${providerId}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.retrieve<Appointment[]>(
      cacheKey,
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        {
          providerId,
          month,
          day,
          year,
        },
      );

      await this.cacheProvider.save(cacheKey, classToClass(appointments));
    }

    return appointments;
  }
}
