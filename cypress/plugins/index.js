const http = require('http')
const next = require('next')

module.exports = async (on, config) => {
  // if (config.testingType === 'component') {
  //   require('@cypress/react/plugins/next')(on, config)
  // }
  const app = next({ dev: true })
  const handleNextRequests = app.getRequestHandler()
  await app.prepare()

  let customServer

  // register handlers for cy.task command
  // https://on.cypress.io/task
  on('task', {
    async startNextApp() {
      // if (app) {
      //   console.log('closing previous app')
      //   await app.close()
      // }

      if (customServer) {
        console.log('closing previous server')

        await new Promise((resolve) => {
          customServer.close(resolve)
        })
      }

      customServer = new http.Server(async (req, res) => {
        return handleNextRequests(req, res)
      })

      return new Promise((resolve, reject) => {
        customServer.listen(3000, (err) => {
          if (err) {
            return reject(err)
          }
          console.log('> Ready on http://localhost:3000')
          // cy.task must return some value
          resolve(null)
        })
      })
    }
  })

  return config
}
