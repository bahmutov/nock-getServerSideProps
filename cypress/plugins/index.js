const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

module.exports = (on, config) => {
  // if (config.testingType === 'component') {
  //   require('@cypress/react/plugins/next')(on, config)
  // }
  let customServer

  // register handlers for cy.task command
  // https://on.cypress.io/task
  on('task', {
    async startNextApp() {
      if (customServer) {
        console.log('closing previous server')
        await new Promise((resolve) => {
          customServer.close(resolve)
        })
      }

      const dev = true
      const app = next({ dev })
      const handle = app.getRequestHandler()
      await app.prepare()

      customServer = createServer((req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true)
        handle(req, res, parsedUrl)
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
