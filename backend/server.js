import express from 'express'
import cors from 'cors'
import perfumeRoutes from './routes/perfumes.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/perfumes', perfumeRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))