'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

// Make endpoint requests
const http = require('http');

/**
 * The AlexaSkill prototype and helper functions
 */
// var AlexaSkill = require('./AlexaSkill');

var Moody = function () {
    AlexaSkill.call(this, APP_ID);
};

function createConnection(callback) {

  return http.get({
    host: '104.196.44.38',
    port: 3000,
    path: '/trigger_photo'
  }, function(response) {

    var body = '';

    response.on('data', function(c) {
     body += c;
    });

    response.on('end', function () {
     console.log(body);
     //var response = JSON.parse(body);
     eventCallback(body);
    });
  }).on('socket', (socket) => {
    socket.emit('agentRemove');
  });

}


const handlers = {
    'NewSession': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        console.log('hello welcome message');
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);

        console.log('About to create connection');
        createConnection(function(rec) {
          console.log('Creating connection rn');
          var response = "Aside: Connection established"
          this.emit(':tell', response);
          console.log(response);
        }
      )

    },
    'MoodIntent': function () {
        console.log('beginning MoodIntent');
        // const input = this.event.request.intent.slots.response;
        const input = this.response;

        let inputPhrase;

        if (input && input.value) {
            inputPhrase = input.value.toLowerCase();
        }

        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), inputPhrase);

        if (inputPhrase) {
            console.log('hello hello hello');
            var speechOutput = inputPhrase;
            var repromptSpeech = this.t('SPEECH_REPEAT_MESSAGE');
            this.emit(':ask', inputPhrase, repromptSpeech, inputPhrase);
        } else {
            let speechOutput = this.t('SPEECH_NOT_UNDERSTOOD_MESSAGE');
            const repromptSpeech = this.t('COMMAND_NOT_FOUND_REPROMPT');
            if (inputPhrase) {
                console.log('hello command not found message');
                speechOutput += this.t('COMMAND_NOT_FOUND', inputPhrase);
            } else {
                speechOutput = this.t('SPEECH_NOT_UNDERSTOOD_MESSAGE');
            }
            speechOutput += repromptSpeech;

            // this.attributes.speechOutput = speechOutput;
            // this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = '';
        speechOutput += "You can talk to me about anything: the weather, your day, how you feel... don\'t be shy!";
        speechOutput += "Or, you can say exit. Now, what\'s up?",
        this.emit(':ask', speechOutput, speechOutput);
    },
    'AMAZON.RepeatIntent': function () {
      var speechOutput = '';
      speechOutput += "I\'m sorry, I didn\'t get what you said, could you please repeat it?"
      this.emit(":tell", speechOutput, speechOutput);
    },
    'AMAZON.StopIntent': function () {
      this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

const languageStrings = {
    'en-US': {
        translation: {
            SKILL_NAME: 'Moody',
            WELCOME_MESSAGE: "Good morning! I\'m %s. How did you sleep last night?",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - %s.',
            STOP_MESSAGE: 'Goodbye! Hope you have a terrific day!',
            SPEECH_REPEAT_MESSAGE: 'Try saying repeat.',
            SPEECH_NOT_UNDERSTOOD_MESSAGE: "I\'m sorry, I currently do not know ",
            COMMAND_NOT_FOUND: 'the recipe for %s. ',
            COMMAND_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },
    'en-GB': {
        translation: {
            SKILL_NAME: 'Moody',
            WELCOME_MESSAGE: "Good morning! I\'m %s. How did you sleep last night?",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - %s.',
            STOP_MESSAGE: 'Goodbye! Hope you have a terrific day!',
            SPEECH_REPEAT_MESSAGE: 'Try saying repeat.',
            SPEECH_NOT_UNDERSTOOD_MESSAGE: "I\'m sorry, I currently do not know ",
            COMMAND_NOT_FOUND: 'the recipe for %s. ',
            COMMAND_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },
    'en-DE': {
        translation: {
            SKILL_NAME: 'Moody',
            WELCOME_MESSAGE: "Good morning! I\'m %s. How did you sleep last night?",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - %s.',
            STOP_MESSAGE: 'Goodbye! Hope you have a terrific day!',
            SPEECH_REPEAT_MESSAGE: 'Try saying repeat.',
            SPEECH_NOT_UNDERSTOOD_MESSAGE: "I\'m sorry, I currently do not know ",
            COMMAND_NOT_FOUND: 'the recipe for %s. ',
            COMMAND_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID; //optional
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
