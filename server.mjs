import cors from "cors";
import express from "express";
import dialogflow from '@google-cloud/dialogflow';
import { WebhookClient, Card, Suggestion, Image, Payload } from 'dialogflow-fulfillment';
import gcHelper from "google-credentials-helper"


const sessionClient = new dialogflow.SessionsClient();

const app = express();
app.use(cors({
    origin: '*'
}));
app.use(cors())
app.use(express.json())
// app.use('/', express.static(path.join(__dirname, 'web/build')))



const PORT = process.env.PORT || 7001;

// THATS   process id manually to request and responce 

app.post("/talktochatbot", async (req, res) => {

    const projectId = "saylaniwelfare-swaj"
    const sessionId = req.body.sessionId || "session123"
    const query = req.body.text;
    const languageCode = "en-US"

    // The path to identify the agent that owns the created intent.
    const sessionPath = sessionClient.projectAgentSessionPath(
        projectId,
        sessionId
    );
    
    

    console.log(req.body)
    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: req.body.text,
                languageCode: languageCode,
            },
        },
    };
    const responses = await sessionClient.detectIntent(request);

    console.log("responses: ", responses);

    console.log("resp: ", responses[0].queryResult);


    res.send({
        text: responses.data.text[0].queryResult
    });

})

// Thats Work with  webhook to connect with dialogflow to request and responce

// app.post("/webhook", (req, res) => {

// // Now do with library dialogflow webhook service


// const agent = new WebhookClient({ request: req, response: res });


// function welcome(agent){
//     let image = new Image("https://media.nationalgeographic.org/assets/photos/000/263/26383.jpg");

//     agent.add(image)

//     // agent.add(` //ssml
//     //     <speak>
//     //         <prosody rate="slow" pitch="-2st">Can you hear me now?</prosody>
//     //     </speak>
//     // `);

//     agent.add('Welcome to the Weather Assistant!');
//     agent.add('you can ask me name, or weather updates');
//     agent.add(new Suggestion('what is your name'));
//     agent.add(new Suggestion('Weather update'));
//     agent.add(new Suggestion('Cancel'));



//     function fallback(agent) {
//         agent.add('Woah! Its getting a little hot in here.');
//         agent.add(`I didn't get that, can you try again?`);
//     }

//     let intentMap = new Map(); // Map functions to Dialogflow intent names
//     agent.handleRequest(intentMap);
//     intentMap.set('Default Welcome Intent', welcome);
    
//     intentMap.set('Default Fallback Intent', fallback);
// }







// // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//     // const params = req.body.queryResult.parameters;

//     // console.log("params.cityName: ", params.cityName)

//     // TODO: make api call to weather server

//     // res.send({
//     //     "fulfillmentText": `response from webhok. weather of  is 17°C.
//     //                         thank you for calling weather app. good bye.`,

//     //     "fulfillmentMessages": [
//     //         {
//     //             "text": {
//     //                 "text": [
//     //                     `response from webhoook weather of  is 17°C.
//     //                     thank you for calling weather app. good bye.`
//     //                 ]
//     //             }
//     //         }
//     //     ]
//     // })
// })

app.post("/webhook", (req, res) => {

    const agent = new WebhookClient({ request: req, response: res });

    function welcome(agent) {
        // agent.add(new Card({
        //     title: 'Vibrating molecules',
        //     imageUrl: "https://media.nationalgeographic.org/assets/photos/000/263/26383.jpg",
        //     text: 'Did you know that temperature is really just a measure of how fast molecules are vibrating around?! 😱',
        //     buttonText: 'Temperature Wikipedia Page',
        //     buttonUrl: "https://sysborg.com"
        // })
        // );

        let image = new Image("https://media.nationalgeographic.org/assets/photos/000/263/26383.jpg");

        agent.add(image)

        // agent.add(` //ssml
        //     <speak>
        //         <prosody rate="slow" pitch="-2st">Can you hear me now?</prosody>
        //     </speak>
        // `);

        agent.add('Welcome to the Weather Assistant!');
        agent.add('you can ask me name, or weather updates');
        agent.add(new Suggestion('what is your name'));
        agent.add(new Suggestion('Weather update'));
        agent.add(new Suggestion('Cancel'));


        const facebookSuggestionChip = [{
            "content_type": "text",
            "title": "I am quick reply",
            // "image_url": "http://example.com/img/red.png",
            // "payload":"<DEVELOPER_DEFINED_PAYLOAD>"
        },
        {
            "content_type": "text",
            "title": "I am quick reply 2",
            // "image_url": "http://example.com/img/red.png",
            // "payload":"<DEVELOPER_DEFINED_PAYLOAD>"
        }]
        const payload = new Payload(
            'FACEBOOK',
            facebookSuggestionChip
        );
        agent.add(payload)

    }


    function testing () {
        agent.add("Testing is running on....")
    }

    function fund(agent) {
        // Get parameters from Dialogflow to convert
        // const cityName = agent.parameters.cityName;

        // console.log(`User requested to city ${cityName}`);

        //TODO: Get weather from api

        // Compile and send response
        // agent.add(`in ${cityName} its 27 degree centigrade, would you like to know anything else?`);
        agent.add(`Thank you contacting us , now you need to go through the website.`);
        // agent.add(new Suggestion('What is your name'));
        // agent.add(new Suggestion('Hi'));
        // agent.add(new Suggestion('Cancel'));
    }

    function fallback(agent) {
        agent.add('Woah! Its getting a little hot in here.');
        agent.add(`I didn't get that, can you try again?`);
    }

    let intentMap = new Map(); // Map functions to Dialogflow intent names
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Testing', testing);
    intentMap.set('FundCategory', fund);
    intentMap.set('Default Fallback Intent', fallback);
    agent.handleRequest(intentMap);

})

app.get("/profile", (req, res) => {
    res.send("here is your profile");
})
app.get("/", (req, res) => {
    res.send("Welcome to dailogeflow feature");
})
app.get("/about", (req, res) => {
    res.send("some information about me");
})

// app.get("/**", (req, res, next) => {
//     res.sendFile(path.join(__dirname, "./web/build/index.html"))
// })

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});