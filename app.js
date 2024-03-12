const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors middleware
const mqttPublish = require("./mqttPub");
const mqtt = require("mqtt");

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Parse JSON requests
app.use(bodyParser.json());

// MQTT setup
const mqttPort = process.env.port;
const mqttBroker = process.env.mqttBroker;
const mqttTopic = process.env.mqttSubTopic;
const mqttUser = process.env.mqttUser;
const mqttPassword = process.env.mqttPassword;
const client = mqtt.connect(mqttBroker, {
  port: mqttPort,
  username: mqttUser,
  password: mqttPassword,
});

let sensorValues;

client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe(mqttTopic);
});

client.on("message", (topic, message) => {
  var currentDateTime = new Date();
  sensorValues = {
    ...JSON.parse(message.toString()),
    time: currentDateTime.toLocaleTimeString(),
    date: currentDateTime.toLocaleDateString(), // Add timestamp field as ISO string
  };

  console.log(`sensor: ${JSON.stringify(sensorValues)}`);
});

// Route to get sensor values
app.get("/sensorValues", async (req, res) => {
  try {
    res.json(sensorValues);
  } catch (err) {
    console.error(`Error retrieving sensor data: ${err}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to publish data to MQTT
app.post("/publish", (req, res) => {
  try {
    const data = req.body;
    console.log("Received data:", JSON.stringify(data));
    mqttPublish.dataPublisher(data);
    res.status(200).send("Data published to MQTT");
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(400).send("Invalid request data");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
