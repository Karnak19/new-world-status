import { cheerio } from "./package.ts";
import type { TagElement } from "./package.ts";

import { sanitizer } from "./sanitizer.ts";

class ServerStatus {
  private readonly SERVERS = new Map();
  private readonly SELECTOR =
    "div.ags-ServerStatus-content-responses-response:nth-child(3)div.ags-ServerStatus-content-responses-response > div.ags-ServerStatus-content-responses-response-server";

  getStatus(server: string) {
    return this.SERVERS.get(server);
  }

  async scrapPage() {
    const res = await fetch(
      "https://www.newworld.com/fr-fr/support/server-status"
    );
    const response = await res.text();

    const $ = cheerio.load(response);

    return $(this.SELECTOR).toArray() as TagElement[];
  }

  updateStatuses(elements: TagElement[]) {
    elements.forEach((element) => {
      const sanitized = sanitizer(element)
        .children.map((elt) => {
          if (!Array.isArray(elt.children)) return;

          const mem = elt.children.map((childElt) => {
            if (childElt.type === "text") {
              return {
                type: childElt.type,
                text: childElt.data?.replace(/\s+/g, ""),
              };
            }

            if (childElt.type === "tag") {
              return {
                type: childElt.type,
                status: childElt.attribs.title,
              };
            }
          });

          return mem;
        })
        .filter((x) => x)
        .map((elt) => {
          return elt!.filter(
            (e) => e?.status || (e?.type === "text" && e.text)
          );
        })
        .flatMap((elt) => elt);

      this.SERVERS.set(
        sanitized[1]!.text?.toLowerCase(),
        sanitized[0]?.status?.toLowerCase()
      );
    });
  }
}

export default new ServerStatus();
