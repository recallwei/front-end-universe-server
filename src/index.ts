import { PrismaClient } from '@prisma/client'
import express, { type Express, type Request, type Response, type NextFunction } from 'express'

const prisma = new PrismaClient()

const app: Express = express()

// cors config
app.all('*', function (req: Request, res: Response, next: NextFunction) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Authorization')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  // res.header("Content-Type", "application/json;charset=utf-8");
  next()
})

const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.raw({ type: 'application/vnd.custom-type' }))
app.use(express.text({ type: 'text/html' }))

app.get('/sites', async (req, res) => {
  const sites = await prisma.site.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return res.json(sites)
})

app.post('/sites', async (req, res) => {
  const site = await prisma.site.create({
    data: {
      userId: 0,
      createdAt: new Date()
    }
  })

  return res.json(site)
})

app.get('/sites/:id', async (req, res) => {
  const id = Number(req.params.id)
  const site = await prisma.site.findUnique({
    where: { id }
  })
  return res.json(site)
})

app.put('/sites/:id', async (req, res) => {
  const id = Number(req.params.id)
  const todo = await prisma.site.update({
    where: { id },
    data: req.body
  })
  return res.json(todo)
})

app.delete('/sites/:id', async (req, res) => {
  const id = Number(req.params.id)
  await prisma.site.delete({
    where: { id }
  })
  return res.send({ status: 'ok' })
})

app.get('/', async (req, res) => {
  res.send(
    `
  <h1>REST API</h1>
  <h2>Available Routes</h2>
  <pre>
    GET, POST /sites
    GET, PUT, DELETE /sites/:id
  </pre>
  `.trim()
  )
})

// error handler
app.use(function (error: any, request: Request, response: Response) {
  // set locals, only providing error in development
  response.locals.message = error.message
  response.locals.error = request.app.get('env') === 'development' ? error : {}
  // render the error page
  response.status(error.status || 500)
  response.render('error')
})

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
