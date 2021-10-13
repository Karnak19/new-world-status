import "https://deno.land/x/dotenv/load.ts";

import { WEBHOOK_URL } from "./env.ts";
import { cron, Webhook, RichEmbed } from "./package.ts";

import serverStatus from "./servers.ts";

const webhook = new Webhook(WEBHOOK_URL as string);

console.log("STARTING SERVER");
let prevStatus: string;

// every 10 seconds job
cron("*/10 * * * * *", async () => {
  serverStatus.updateStatuses(await serverStatus.scrapPage());

  const newStatus = serverStatus.getStatus("kaloon");

  if (prevStatus !== newStatus) {
    const embed = new RichEmbed(
      "Kaloon status",
      serverStatus.getStatus("kaloon").toUppercase()
    );

    webhook.post(embed);

    prevStatus = newStatus;
  }
});
