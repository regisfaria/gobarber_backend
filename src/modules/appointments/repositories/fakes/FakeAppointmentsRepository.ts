import { uuid } from 'uuidv4';
import { isEqual, getDate, getMonth, getYear } from 'date-fns';

import IAppointmentsRepositories from '@modules/appointments/repositories/IAppointmentsRepository';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class FakeAppointmentsRepository implements IAppointmentsRepositories {
  private appointments: Appointment[] = [];

  public async findByDate(
    date: Date,
    providerId: string,
  ): Promise<Appointment | undefined> {
    const findAppoinment = this.appointments.find(
      appointment =>
        isEqual(appointment.date, date) &&
        appointment.providerId === providerId,
    );

    return findAppoinment;
  }

  public async findAllInMonthFromProvider({
    providerId,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appointmentsInMonth = this.appointments.filter(
      appointment =>
        appointment.providerId === providerId &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointmentsInMonth;
  }

  public async findAllInDayFromProvider({
    providerId,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appointmentsInMonth = this.appointments.filter(
      appointment =>
        appointment.providerId === providerId &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year &&
        getDate(appointment.date) === day,
    );

    return appointmentsInMonth;
  }

  public async create({
    providerId,
    userId,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, providerId, userId });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default FakeAppointmentsRepository;
