import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import uploadConfig from '@config/upload';

import { Exclude, Expose } from 'class-transformer';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Expose({ name: 'imageUrl' })
  getImageUrl(): string | null {
    if (!this.image) {
      return null;
    }

    switch (uploadConfig.driver) {
      case 'disk':
        return this.image
          ? `${process.env.APP_API_URL}/files/${this.image}`
          : null;
      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.image}`;
      default:
        return null;
    }
  }
}
