const {
  route
} = require("./index.chat.js");
const {
  voiceAnswer,
  voiceEvent,
  rtcEvent,
} = require("./index.contactCenter.js")


module.exports = {
  voiceAnswer,
  voiceEvent,
  rtcEvent,
  route
}