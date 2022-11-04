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
 
 const {generateMaxToken} = require("./tokenGenerator.js");
 /**
  * 
  * @param {object} app - this is an express app
  * you can register and handler same way you would do in express. 
  * the only difference is that in every req, you will have a req.nexmo variable containning a nexmo context
  * 
  */
 const route = (app) => {
 app.get('/test', (req, res) => {
 res.send({status: 200});
 })
//   app.get('/hello', async (req, res) => {
//
//     const {
//       logger,
//     } = req.nexmo;
//
//     logger.info(`Hello Request HTTP `)
//
//     res.json({
//       text: "Hello Request!"
//     })
//   })
 
   app.post("/api/login", async (req, res) => {
     console.log("Hellow its called")
    //  const {
    //    generateBEToken,
    //    generateUserToken,
    //    logger,
    //    csClient,
    //    storageClient,
    //  } = req.nexmo;
    //  let userResponse
    //  const { username } = req.body;
    //  try {
    //    userResponse = await csClient({
    //      url: `${CS_URL}/v0.3/users?name=${username}`,
    //      method: "get"
    //    });
    //    console.log('Mehboob ALAM', username);
    //   //  logger.info({ user: userResponse.data, token: generateMaxToken({username}) }, "User received is: ")
    //    res.json({
    //      user: username,
    //      token: generateMaxToken({username}),
    //      ws_url: WS_URL,
    //      cs_url: CS_URL,
    //    });
    //  } catch (err) {
    //    logger.error({ err }, "ERROR");
    //    return res.status(err.status || 500).json({ error: err.toJSON() });
    //  }
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
 
       return res.json({ user: username, token: generateMaxToken({username}), resNewUser: resNewUser.data, storageUser });
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
 
 }
 
 const voiceEvent = async (req, res, next) => {
   const { logger, storageClient, csClient } = req.nexmo;
   logger.info({ event: req.body }, "event body is")
   if (!req.body.speech) {
     return res.json({})
   }
   try {
    //  let skill = req.body.speech.results[0].text.toLowerCase()
    //  const users = await storageClient.get(`skill:${skill}`)
    //  const agent = users.split(",")[0]
    //  if (!agent) {
    //    return res.json([{
    //      "action": "talk",
    //      "text": `Sorry, we dont have expert for ${skill}`
    //    }])
    //  }
     const NCCO = [{
       "action": "talk",
       "text": `We are connecting you with alam`
     }, {
       "action": "connect",
       "timeout": "45",
       "from": "Vonage",
       "endpoint": [
         {
           "type": "app",
           "user": "alam"
         }
       ]
     }]
     logger.info({ ncco: NCCO }, "NCCO IS: ")
     //return res.json(NCCO)
   } catch (err) {
     logger.error("Error on voiceEvent function", {err})
     return res.json([{
       "action": "talk",
       "text": `Sorry, we received an error of ${err.toString()}`
     }])
   }
 
 }
 
 const voiceAnswer = async (req, res, next) => {
   const { logger, csClient, config } = req.nexmo;
   logger.info("req", { req_body: req.body })
   logger.info({ config }, "Configurations are: ")
   try {
     const isPhoneNumber = onlyNumbers(req.body.to)
     const from = req.body.from || req.body.from_user
     const NCCO = [{
      "action": "talk",
      "text": `We are connecting you with alam`
    }, {
      "action": "connect",
      "timeout": "45",
      "from": "Vonage",
      "endpoint": [
        {
          "type": "app",
          "user": "alam"
        }
      ]
    }]
     logger.info({ NCCO }, "NCCO obj is: ")
     return res.json(NCCO)
   } catch (err) {
     logger.error("Error on voiceAnswer function", { err })
   }
 
 }
 
 function onlyNumbers(str) {
   if (str) {
     return /^[0-9]+$/.test(str)
   }
   return false
 }
 const rtcEvent = async (event, nexmo) => {
 
   const { logger } = nexmo
   logger.info("Event for RTC are: ", { even: event })
 }
 
 module.exports = {
   voiceAnswer,
   voiceEvent,
   rtcEvent,
   route
 }
 
 
 
 /**
  * [{
       "action": "talk",
       "text": `Hi , ${from} , We are connecting you with ${req.body.to.split("").join(" ")}`
     },
     {
       "action": "connect",
       "timeout": "45",
       "from": isPhoneNumber ? config.phone_number : from,
       "endpoint": [
         {
           "type": isPhoneNumber ? "phone" : "app",
           "number": isPhoneNumber ? req.body.to : null,
           "user": isPhoneNumber ? null : req.body.to
         }
       ]
     }
     // {
     //   "action": "stream",
     //   "streamUrl": ["https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba-online-audio-converter.com_-1.wav"]
     // }
     ]
  */