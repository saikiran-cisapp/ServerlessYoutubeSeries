const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const WebSocket = require('../common/websocketMessage');

const tableName = process.env.tableName;

exports.handler = async event => {
    console.log('event', event);

    try {
        let messages, domainName, stage;
        const { connectionId: connectionID } = event.requestContext;
    
        const body = JSON.parse(event.body);
        const record = await Dynamo.get(connectionID, tableName);
        console.log('record->', record);

        record.map(async (singleRecord) => {

            messages = singleRecord.messages;
            domainName = singleRecord.domainName;
            stage = singleRecord.stage;
            console.log(singleRecord);
            await WebSocket.send({
                domainName,
                stage,
                connectionID: singleRecord.ID,
                message: body.message,
            });
        });

        // WebSocket.send({});
        console.log('sent message');
        console.log(body.message);

        return Responses._200({ message: 'got a message' });
    } catch (error) {
        console.log('error');
        console.error(error);
        return Responses._400({ message: 'message could not be received' });
    }

    return Responses._200({ message: 'got a message' });
};
