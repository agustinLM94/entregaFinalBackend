import express from 'express'
import productsRoutes from './src/routes/productsRoutes.js'
import viewRoutes from './src/routes/viewsRoutes.js'
import __dirname from './dirname.js'
import handlebars  from 'express-handlebars'
import mongoose from 'mongoose'

const app = express()
const PORT = 8080
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/products',productsRoutes)
app.use('/',viewRoutes)
app.use('/static',express.static(__dirname + '/public'))
app.engine('hbs',handlebars.engine({extname:'.hbs',runtimeOptions:{allowProtoPropertiesByDefault:true}}))
app.set('view engine', 'hbs')
app.set('views',__dirname + '/src/views')


mongoose.connect('mongodb+srv://agustinemanuellopez:Agus1969@cluster0.edcgj.mongodb.net/dataAgustin?retryWrites=true&w=majority&appName=Cluster0')
app.listen(PORT,()=> console.log(`server in port ${PORT}`))
