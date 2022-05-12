const {
  route
} = require("./index.chat");
const {
  voiceAnswer,
  voiceEvent,
  rtcEvent,
} = require("./index.contactCenter")


module.exports = {
  voiceAnswer,
  voiceEvent,
  rtcEvent,
  route
}