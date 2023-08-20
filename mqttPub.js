const mqtt = require('mqtt');
const mqttDetails = require('./mqttConfig.json')

const mqttBroker = mqttDetails.mqttBroker;
const mqttPort = mqttDetails.port;
const mqttUser = mqttDetails.mqttUser;
const mqttPassword = mqttDetails.mqttPassword;
const mqttTopic = mqttDetails.mqttPubTopic;

const mqttClient = mqtt.connect(mqttBroker,
    {
        port: mqttPort,
        username: mqttUser,
        password: mqttPassword,
    });


function dataPublisher(data) {

    mqttClient.publish(mqttTopic, JSON.stringify(data), (err) => {
        console.log(data)
        if (err) {
            console.error('MQTT publish error:', err);
        } else {
            console.log('Data published to MQTT:', data);
        }
    });

}

module.exports = {
    dataPublisher,
}

