const env = require("./env");

async function buildArcjet({ max = 100, interval = 60 } = {}) {
  const { arcjet, shield, detectBot, slidingWindow } = await import(
    "@arcjet/node"
  );

  return arcjet({
    key: env.arcjet_key,
    rules: [
      shield({ mode: "LIVE" }),
      detectBot({
        mode: "LIVE",
        allow: ["CATEGORY:SEARCH_ENGINE"],
      }),
      slidingWindow({
        mode: "LIVE",
        max,
        interval,
      }),
    ],
  });
}

module.exports = buildArcjet;
