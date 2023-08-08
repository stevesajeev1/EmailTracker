const path = require("path");
const { Webhook, MessageBuilder } = require("discord-webhook-node");

// Create Express server
const express = require("express");
const app = express();
const port = 3000;

// Get environment variables
require("dotenv").config();

const webhookURL = process.env["WEBHOOK"];
const user = process.env["USER"];
const hook = new Webhook(webhookURL);

// UptimeRobot is used to keep Repl alive, pings at SERVER_URL/alive
app.get("/alive", (req, res) => {
    res.send("Kept Alive");
});

// Used to prevent requests appearing twice
app.get("/pixel.png", (req, res) => {
    res.send();
});

// Home page
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

// Send invisible pixel for all other requests
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "pixel.png"));

    // Only track when receiver opens, not the sender
    if (
        req.headers["user-agent"].includes("GoogleImageProxy") ||
        "if-none-match" in req.headers
    ) {
        // Path contains email subject
        const email = decodeURI(req.path.substring(1));

        // Get current date
        const formattedDate = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/New_York",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        }).format(new Date());

        // Create embed
        const embed = new MessageBuilder()
            .setTitle("Email Opened")
            .addField("Subject:", email)
            .addField("Date/Time:", formattedDate)
            .setColor("#0492C2")
            .setTimestamp();

        // Send embed
        hook.send(`<@${user}>`);
        hook.send(embed);
    }
});

// Start server
app.listen(port, () => {
    console.log("Server Running!");
});
