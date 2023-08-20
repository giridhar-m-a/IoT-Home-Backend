const express = require('express');
const bodyParser = require('body-parser');
const mqttPublish = require('./mqttPub');
const mqttDetails = require('./mqttConfig.json')
const mqtt = require('mqtt');
const app = express();
const port = 3000;



const mqttPort = mqttDetails.port;
const mqttBroker = mqttDetails.mqttBroker;
const mqttTopic = mqttDetails.mqttSubTopic;
const mqttUser = mqttDetails.mqttUser;
const mqttPassword = mqttDetails.mqttPassword;
const client = mqtt.connect(mqttBroker,
    {
        port: mqttPort,
        username: mqttUser,
        password: mqttPassword,
    });
var sensorValues;



client.on('connect', () => {
    console.log('Connected to MQTT broker')
    client.subscribe(mqttTopic)
})

client.on('message', (topic, message) => {
    var currentTime = new Date();
    var currentDate = new Date();
    sensorValues = {
        ...JSON.parse(message.toString()),
        time: currentTime.toLocaleTimeString(),
        date: currentDate.toLocaleDateString() // Add timestamp field as ISO string
    };

    console.log(sensorValues);


})

app.use(bodyParser.json())

app.get('/sensorValues', async (req, res) => {
    try {
        res.json(sensorValues);
    } catch (err) {
        console.error(`Error retrieving sensor data: ${err}`);
        res.status(500).json({ error: "Internal server error" });
    } 
});

app.post('/publish', (req, res) => {
    try {

        const data = req.body;
        console.log('Received data:', JSON.stringify(data));
        mqttPublish.dataPublisher(data);
        res.status(200).send('Data published to MQTT');

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(400).send('Invalid request data');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});





