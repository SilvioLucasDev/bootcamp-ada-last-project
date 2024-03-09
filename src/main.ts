import { HttpServer } from "./server"

;(() => {
  const httpServer = new HttpServer()

  httpServer.setup()
  httpServer.start()
})()
