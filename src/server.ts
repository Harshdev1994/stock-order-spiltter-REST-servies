import app from './app'
import { PORT } from './config'

app.listen(PORT, () => {
  console.log(`Stock order splitter API running on http://localhost:${PORT}`)
  console.log(`Decimal places allowed for quantities: ${process.env.DECIMAL_PLACES ?? 3}`)
})
