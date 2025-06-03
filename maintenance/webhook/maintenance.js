#!/usr/bin/env node

const express = require("express");
const bodyParser = require("body-parser");
const { execSync } = require("child_process");

const app = express();
const PORT = 8081;

app.use(bodyParser.json());

app.post("/webhook/maintenance", (req, res) => {
  const ref = req.body.ref;
  const match = ref.match(/start-(\d{2})-(\d{2})_end-(\d{2})-(\d{2})$/);

  if (!match) {
    return res.status(400).send("Invalid branch name.");
  }

  const [, sh, sm, eh, em] = match;
  const start = `${sh}:${sm}`;
  const end = `${eh}:${em}`;

  try {
    execSync(`/bin/bash /var/www/maintenance/deploy-config.sh ${start} ${end}`);
    return res.status(200).send("Maintenance cron scheduled.");
  } catch (e) {
    console.error("Execution error:", e.message);
    return res.status(500).send("Execution error.");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Maintenance Webhook listening at http://localhost:${PORT}`);
});
