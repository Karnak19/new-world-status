import { cron, Webhook, RichEmbed } from "./package.ts";

import serverStatus from "./servers.ts";

const webhook = new Webhook(
  "https://discord.com/api/webhooks/897858907588952074/uEsmgP-tYRKL9TXz8bwQAt76kX9bkRwwRphF5XvJTwB_1o9DD0HtCm2WI-_DouzK6ngu"
);

console.log("STARTING SERVER");
let prevStatus: string;

// every 10 seconds job
cron("*/10 * * * * *", async () => {
  serverStatus.updateStatuses(await serverStatus.scrapPage());

  const newStatus = serverStatus.getStatus("kaloon");

  if (prevStatus !== newStatus) {
    const embed = new RichEmbed(
      "Kaloon status",
      "statut: " + serverStatus.getStatus("kaloon")
    );

    webhook.post(embed);

    prevStatus = newStatus;
  }
});
