export const errors = {
  internalServerError: {
    code: 'INTERNAL_SERVER_ERROR',
    status: 500,
    message: 'Internal server error',
  },
  // AUTH
  passwordIncorrect: {
    code: 'WRONG_PASSWORD',
    status: 401,
    message: 'Contraseña incorrecta',
  },
  // USER
  userNotExist: {
    code: 'USER_NOT_FOUND',
    status: 404,
    message: 'Usuario no encontrado',
  },
  userAlreadyExist: {
    code: 'USER_ALREADY_EXIST',
    status: 409,
    message: 'El usuario se encuentra registrado',
  },
  // TASK
  taskNotExist: {
    code: 'TASK_NOT_FOUND',
    status: 404,
    message: 'Tarea no encontrada',
  },
};
