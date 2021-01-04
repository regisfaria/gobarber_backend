import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateUserImageService from '@modules/users/services/UpdateUserImageService';

export default class UserImageController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserImage = container.resolve(UpdateUserImageService);

    const user = await updateUserImage.execute({
      userId: request.user.id,
      imageFileName: request.file.filename,
    });

    return response.json(classToClass(user));
  }
}
