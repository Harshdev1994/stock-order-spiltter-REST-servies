import { Router } from 'express'
import { createOrderHandler, listOrdersHandler } from '../controllers/orderController'

const router = Router()

router.post('/', createOrderHandler)
router.get('/', listOrdersHandler)

export default router
