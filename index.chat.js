const DATACENTER = `https://api.nexmo.com`
 
const CS_URL = `https://api.nexmo.com`;
const WS_URL = `https://ws.nexmo.com`;

 const route = (app) => {
    app.get('/hello', async (req, res) => {
  
      const {
        logger,
      } = req.nexmo;
  
      logger.info(`Hello Request HTTP `)
  
      res.json({
        text: "Hello Request!"
      })
    })
  
    app.post("/api/login", async (req, res) => {
      console.log("Nexmo Object", req.nexmo)
      const {
        generateBEToken,
        generateUserToken,
        logger,
        csClient,
        storageClient,
      } = req.nexmo;
      let userResponse
      const { username } = req.body;
      try {
        userResponse = await csClient({
          url: `${CS_URL}/v0.3/users?name=${username}`,
          method: "get"
        });
      } catch (err) {
        logger.error({ err }, "ERROR");
        return res.status(err.status || 500).json({ error: err.toJSON() });
      }
  
      logger.info({ user: userResponse.data, token: generateUserToken(username) }, "User received is: ")
      res.json({
        user: username,
        token: generateUserToken(username),
        ws_url: WS_URL,
        cs_url: CS_URL,
      });
    });
  
    app.post("/api/subscribe", async (req, res) => {
      const {
        generateBEToken,
        generateUserToken,
        logger,
        csClient,
        storageClient,
      } = req.nexmo;
  
      try {
        const { username } = req.body;
        logger.info({ body: req.body }, "New users request")
        const resNewUser = await csClient({
          url: `${CS_URL}/v0.3/users`,
          method: "post",
          data: {
            name: username,
          },
        });
  
        await storageClient.set(`user:${username}`, resNewUser.data.id);
        const storageUser = await storageClient.get(`user:${username}`);
  
        return res.json({ user: username, token: generateUserToken(username), resNewUser: resNewUser.data, storageUser });
      } catch (err) {
        logger.error({ err }, "ERROR");
        return res.status(err.status || 500).json({ error: err.toJSON() });
      }
    });
  
    app.get("/setup", async (req, res) => {
      console.log("Nexmo Object", req.nexmo)
      const {
        logger,
        storageClient,
      } = req.nexmo;
      await storageClient.set(`skill:javascript`, "alam,alam2,user1,user10")
      await storageClient.set(`skill:java`, "alam,user10")
      return res.json({ status: 200 })
    })
  
    app.get("/api/users", async (req, res) => {
      const {
        generateBEToken,
        generateUserToken,
        logger,
        csClient,
        storageClient,
      } = req.nexmo;
      const users = await csClient({
        url: `${CS_URL}/v0.3/users`
      })
      res.json({
        users: users.data
      })
    })

    app.get("/api/:conversationID/member", async (req, res) => {
        const {
            generateBEToken,
            generateUserToken,
            logger,
            csClient,
            storageClient,
          } = req.nexmo; 
          const conversation = await csClient({
              url: `${CS_URL}/v0.3/conversations/${req.params.conversationID}/members`
          })
          res.json({conversations: conversation.data})
    })

    app.post("/api/:conversationID/audio", async (req, res) => {
        const {
            generateBEToken,
            generateUserToken,
            logger,
            csClient,
            storageClient,
          } = req.nexmo; 
          logger.info({body: req.body}, "POST request body is: ")
          const id = req.params.conversationID
          const eventJson = {
            "type": "audio:say",
            "body": {
              "level": 1,
              "loop": 1,
              "queue": true,
              "language": "en-US",
              "style": 2,
              "text": req.body.text,
              "ssml": true,
            }
          }
          try {
            const response = await csClient({
                url: `${CS_URL}/v0.3/conversations/${id}/events`,
                method: "post",
                data: eventJson
            })
            logger.info({api: response.data}, "its here")
            res.json(response.data)
          } catch (error) {
              logger.error({error: error}, "error while sending event is: ", ` ${CS_URL}/v0.3/conversations/${id}/event`)
              res.json(error.toJSON ? error.toJSON() : error.toString())
          }
    })

    app.post("/api/:conversationID/text", async (req, res) => {
        const {
            generateBEToken,
            generateUserToken,
            logger,
            csClient,
            storageClient,
          } = req.nexmo; 
          logger.info({body: req.body}, "POST request body is: ")
          const id = req.params.conversationID
          const eventJson = {
            "type": "text",
            "body": {
              "text": req.body.text,
            },
            from: req.body.from
          }
          try {
            const response = await csClient({
                url: `${CS_URL}/v0.3/conversations/${id}/events`,
                method: "post",
                data: eventJson
            })
            logger.info({api: response.data}, "its here")
            res.json(response.data)
          } catch (error) {
              logger.error({error: error}, "error while sending event is: ", ` ${CS_URL}/v0.3/conversations/${id}/event`)
              res.json(error.toJSON ? error.toJSON() : error.toString())
          }
    })
  }

  module.exports = {
      route
  }