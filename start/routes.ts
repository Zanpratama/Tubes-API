import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import ConsolesController from '#controllers/consoles_controller'
import RentsController from '#controllers/rents_controller'
import UsersController from '#controllers/users_controller'
import { middleware } from '#start/kernel'

router.on('/').renderInertia('login')
router.on('/register').renderInertia('register')

router
  .group(() => {
    router.post('/login', [UsersController, 'login'])
    router.post('/register', [UsersController, 'register'])
  })
  .prefix('/auth')

router.on('/dashboard').renderInertia('dashboard')

router
  .group(() => {
    router.get('/', [ConsolesController, 'index'])
    router.get('/:id', [ConsolesController, 'show'])
    router.post('/', [ConsolesController, 'store'])
    router.put('/:id', [ConsolesController, 'update'])
    router.delete('/:id', [ConsolesController, 'destroy'])
  })
  .prefix('/consoles')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/', [RentsController, 'index'])
    router.get('/:id', [RentsController, 'show'])
    router.post('/', [RentsController, 'store'])
    router.put('/:id', [RentsController, 'update'])
    router.delete('/:id', [RentsController, 'destroy'])
  })
  .prefix('/rents')
  .use(middleware.auth())
