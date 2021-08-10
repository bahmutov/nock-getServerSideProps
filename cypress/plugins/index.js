const nock = require('nock')
const http = require('http')
const next = require('next')

module.exports = async (on, config) => {
  const app = next({ dev: true })
  const handleNextRequests = app.getRequestHandler()
  await app.prepare()

  const customServer = new http.Server(async (req, res) => {
    return handleNextRequests(req, res)
  })

  await new Promise((resolve, reject) => {
    customServer.listen(3000, (err) => {
      if (err) {
        return reject(err)
      }
      console.log('> Ready on http://localhost:3000')
      resolve()
    })
  })

  // register handlers for cy.task command
  // https://on.cypress.io/task
  on('task', {
    clearNock() {
      nock.restore()
      nock.cleanAll()

      return null
    },

    async nock({ hostname, method, path, statusCode, body }) {
      nock.activate()

      console.log('nock will: %s %s%s respond with %d %o',
        method, hostname, path, statusCode, body)

      method = method.toLowerCase()
      nock(hostname)[method](path).reply(statusCode, body)

      return null
    },
  })

  return config
}
