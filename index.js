/**

what's in this file: 
In this file you specify a JS module with some callbacks. Basically those callbacks get calls when you receive an event from the vonage backend. There's also a 
special route function that is called on your conversation function start up allowing your to expose new local http endpoint

the event you can interract here are the same you can specify in your application: https://developer.nexmo.com/application/overview

event callbacks for rtc: 
 - rtcEvent (event, context)

event callbacks for anything else (those one are just standard express middleware access req.nexmo to get the context): 

voice callbacks 
 - voiceEvent (req, res, next)
 - voiceAnswer (req, res, next)

messages callbacks (if you specifiy one of thise, you need to declare both of them, those one are just standard express middleware access req.nexmo ):
- messagesInbound (req, res, next)
- messagesStatus (req, res, next)


route(app) // app is an express app




nexmo context: 
you can find this as the second parameter of rtcEvent funciton or as part or the request in req.nexmo in every request received by the handler 
you specify in the route function.

it contains the following: 
const {
        generateBEToken,
        generateUserToken,
        logger,
        csClient,
        storageClient
} = nexmo;

- generateBEToken, generateUserToken,// those methods can generate a valid token for application
- csClient: this is just a wrapper on https://github.com/axios/axios who is already authenticated as a nexmo application and 
    is gonna already log any request/response you do on conversation api. 
    Here is the api spec: https://jurgob.github.io/conversation-service-docs/#/openapiuiv3
- logger: this is an integrated logger, basically a bunyan instance
- storageClient: this is a simple key/value inmemory-storage client based on redis

*/



/** 
 * 
 * This function is meant to handle all the asyncronus event you are gonna receive from conversation api 
 * 
 * it has 2 parameters, event and nexmo context
 * @param {object} event - this is a conversation api event. Find the list of the event here: https://jurgob.github.io/conversation-service-docs/#/customv3
 * @param {object} nexmo - see the context section above
 * */
 const path = require("path");

const DATACENTER = `https://api.nexmo.com`

 const CS_URL = `https://api.nexmo.com`;
 const WS_URL = `https://ws.nexmo.com`; 

const rtcEvent = async (event, { logger, csClient }) => {

    try { 
        const type = event.type
        if (type === 'app:knocking') { /* I m receiving a knocker, it means someone is trying to enstiblish a call  */
            const knocking_id = event.from
            
            /* create a conversation */
            const channel = event.body.channel
            const convRes = await csClient({
                url: `${DATACENTER}/v0.3/conversations`,
                method: "post",
                data: {},
            })

            const conversation_id = convRes.data.id
            const user_id = event.body.user.id

            /* join the user created by the knocker in the conversation  aka we join the caller to the conversation we have just created */
            const memberRes = await csClient({
                url: `${DATACENTER}/v0.3/conversations/${conversation_id}/members`,
                method: "post",
                data: {
                    user:    {
                        id: user_id
                    } ,
                    knocking_id: knocking_id,
                    state: "joined",
                    channel: {
                        type: channel.type,
                        id: channel.id,
                        to: channel.to,
                        from: channel.from,
                        "preanswer": false
                    },
                    "media": {
                        "audio": true
                    }

                }
            })

        } else if (type === 'member:media' && (event.body.media && event.body.media.audio === true)) { /* the member as the audio enabled */
            const legId = event.body.channel.id

            /* we send a text to speech action to the conversation */
            await csClient({
                url: `${DATACENTER}/v0.3/legs/${legId}/talk`,
                method: "post",
                data: { "loop": 1, "text": "Hello, have a nice day! ", "level": 0, "voice_name": "Kimberly" },
            })

        } else if (type == 'audio:say:done'){ /* the text to speech is finished */
            /* we hangup the call */
            const legId = event.body.channel.id
            await csClient({
                url: `${DATACENTER}/v0.1/legs/${legId}`,
                method: "put",
                data: { "action": "hangup", "uuid": legId }
            })

        }

    } catch (err) {
        
        logger.error("Error on rtcEvent function")
    }
    
}


/**
 * 
 * @param {object} app - this is an express app
 * you can register and handler same way you would do in express. 
 * the only difference is that in every req, you will have a req.nexmo variable containning a nexmo context
 * 
 */
const route =  (app) => {
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
          return res.status(err.status || 500).json({error: err.toJSON()});
      }
      
      logger.info({user: userResponse.data}, "User received is: ")
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
        logger.info({body: req.body }, "New users request")
        const resNewUser = await csClient({
          url: `${CS_URL}/v0.3/users`,
          method: "post",
          data: {
            name: username,
          },
        });
  
        await storageClient.set(`user:${username}`, resNewUser.data.id);
        const storageUser = await storageClient.get(`user:${username}`);
  
        return res.json({ username, resNewUser: resNewUser.data, storageUser });
      } catch (err) {
        logger.error({ err }, "ERROR");
        return res.status(err.status || 500).json({error: err.toJSON()});
      }
    });

    app.get("/api/users", async (req, res) => {
        const {
            generateBEToken,
            generateUserToken,
            logger,
            csClient,
            storageClient,
          } = req.nexmo;
        //   logger.info({ req }, "API Users' request") // json and a string
          const users = await csClient({
              url: `${CS_URL}/v0.3/users`
          })
        res.json({
            users: users.data
        })
    })
  
}



module.exports = {
    rtcEvent,
    route
}
