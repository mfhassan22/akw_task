/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import UploadsController from '#controllers/uploads_controller'
import UsersController from '#controllers/users_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/register', [AuthController, 'register']).as('auth.register')
router.post('/login', [AuthController, 'login']).as('auth.login')
router.delete('/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth({ guards: ['api'] }))
router.get('/user', [AuthController, 'user']).as('auth.user').use(middleware.auth({ guards: ['api'] }))

router.get('/users', [UsersController, 'getAllUsers']).as('users.list').use(middleware.auth({ guards: ['api'] }))
router.get('/users/role/:id', [UsersController, 'changeUserRole']).as('users.change.role').use(middleware.auth({ guards: ['api'] }))

router.post('/upload', [UploadsController, 'store']).as('upload').use(middleware.auth({ guards: ['api'] }))
router.put('/upload', [UploadsController, 'update']).as('upload.update').use(middleware.auth({ guards: ['api'] }))
router.delete('/upload/:id', [UploadsController, 'deleteFile']).as('upload.delete').use(middleware.auth({ guards: ['api'] }))

router.get('/userfiles/:id', [UploadsController, 'userFiles']).as('user.files').use(middleware.auth({ guards: ['api'] }))

router.get('/uploads/:fileName', async ({ params, response }) => {
  const fileName = params.fileName
  return response.download(`./uploads/${fileName}`)
})