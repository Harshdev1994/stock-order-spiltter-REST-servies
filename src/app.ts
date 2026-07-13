import express from 'express'
import morgan from 'morgan'
import orderRoutes from './routes/orderRoutes'
import { timedLogger } from './middlewares/timedLogger'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(timedLogger)

app.use('/orders', orderRoutes)

app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

export default app
