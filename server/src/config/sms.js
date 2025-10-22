const axios = require("axios");
const env = require("./env");

const base_url = env.infobip_url;
const api_key = env.infobip_key;

module.exports = { base_url, api_key };
