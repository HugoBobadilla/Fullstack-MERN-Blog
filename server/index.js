const app = require('./app')
const config = require('./utils/config')

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`)
})