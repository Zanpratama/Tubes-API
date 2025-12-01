import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import ConsolesController from '#controllers/consoles_controller'
import RentsController from '#controllers/rents_controller'
import { middleware } from '#start/kernel'

router.on('/').renderInertia('login')
router.on('/dashboard').renderInertia('dashboard')

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.get('/me', [AuthController, 'me']).use(middleware.auth())
  })
  .prefix('/auth')

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
