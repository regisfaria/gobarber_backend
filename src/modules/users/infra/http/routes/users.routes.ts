import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import multer from 'multer';
import uploadConfig from '@config/upload';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UsersController from '../controllers/UsersControllers';
import UserImageController from '../controllers/UserImageController';

const usersRouter = Router();

const usersController = new UsersController();
const userImageController = new UserImageController();

const upload = multer(uploadConfig.multer);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.patch(
  '/image',
  ensureAuthenticated,
  upload.single('user-image'),
  userImageController.update,
);

export default usersRouter;
