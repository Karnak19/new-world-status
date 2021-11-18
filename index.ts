import "https://deno.land/x/dotenv/load.ts";

import { WEBHOOK_URL, SERVER } from "./env.ts";
import { cron, Webhook, RichEmbed } from "./package.ts";

import serverStatus from "./servers.ts";

const webhook = new Webhook(WEBHOOK_URL as string);

console.log("STARTING SERVER");
let prevStatus: string;

// every 10 seconds job
cron("*/20 * * * * *", async () => {
  serverStatus.updateStatuses(await serverStatus.scrapPage());

  const newStatus = serverStatus.getStatus(SERVER);

  console.log(`Current ${SERVER} status ->>`, newStatus);

  if (prevStatus !== newStatus) {
    const embed = new RichEmbed(
      `${SERVER} status`,
      serverStatus.getStatus(SERVER)
    );

    webhook.post(embed);

    prevStatus = newStatus;
  }
});
