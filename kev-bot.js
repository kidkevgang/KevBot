// imports
const gd = require("./globaldata.js");
const init = require("./init.js");
const event = require("./eventhandlers.js");
const { oncePerHour } = require("./functions/oncePerHour.js");
const { oncePerDay } = require("./functions/oncePerDay.js");
const { updateUserNames } = require("./functions/updateUserNames.js");
const { Events } = require("discord.js");

// Initialization
async function initialize() {
  console.log(await init.directories());
  console.log(await init.audio(process.env.CLEAR_AUDIO_PRIOR_TO_DOWNLOAD === "true"));
  console.log(await init.categories());
  console.log(await init.commands());
  await gd.client.login(process.env.BOT_TOKEN);
  await updateUserNames();
}
initialize().catch((err) => {
  console.error(err);
  console.error("Initialization failed! Exiting program!");
  process.exit(1); // end program
});

// Events
try {
  gd.client.once(Events.ClientReady, event.onReady);
  gd.client.on(Events.VoiceStateUpdate, (a, b) => {
    event.onVoiceStateUpdate(a, b);
  });
  gd.client.on(Events.MessageCreate, (message) => {
    event.onMessage(message, process.env.COMMAND_PREFIX);
  });
  setInterval(oncePerHour, 1000 * 60 * 60); // once per hour updates
  setInterval(oncePerDay, 1000 * 60 * 60 * 24); // once per day updates
} catch (err) {
  console.error(err);
}
