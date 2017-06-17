/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * PAYBACK Demo Skill, In Dev by @mh0rkk and @lordthundering and Stephan Klocke
 **/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

const handlers = {
    'NewSession': function () {
        let pointBalance=2314;
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SSML_SKILL_NAME'), pointBalance);
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'PAYBACKPointBalance': function () {
        handlePointBalance(this);
    },

    'PAYBACKLastTransactions': function () {
        handleLastTransactions(this);
    },

    'PAYBACKInterestingCoupons': function () {
        handleCoupons(this,null);
    },

    'PAYBACKInterestingCouponsForPartner': function () {
        const partner = this.event.request.intent.slots.partner;
        let partnerName;
        if (partnerName && partner.value) {
            partnerName = partner.value.toLowerCase();
        }

        handleCoupons(this,partnerName);
    },

    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
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
    'en-GB': {
        translation: {
            SKILL_NAME: 'British Minecraft Helper',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what\'s the recipe for a chest? ... Now, what can I help you with.",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Recipe for %s.',
            HELP_MESSAGE: "You can ask questions such as, what\'s the recipe, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMT: "You can say things like, what\'s the recipe, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            RECIPE_REPEAT_MESSAGE: 'Try saying repeat.',
            RECIPE_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            RECIPE_NOT_FOUND_WITH_ITEM_NAME: 'the recipe for %s. ',
            RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: 'that recipe. ',
            RECIPE_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },
    'en-US': {
        translation: {
            SKILL_NAME: 'American Minecraft Helper',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what\'s the recipe for a chest? ... Now, what can I help you with.",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Recipe for %s.',
            HELP_MESSAGE: "You can ask questions such as, what\'s the recipe, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMT: "You can say things like, what\'s the recipe, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            RECIPE_REPEAT_MESSAGE: 'Try saying repeat.',
            RECIPE_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            RECIPE_NOT_FOUND_WITH_ITEM_NAME: 'the recipe for %s. ',
            RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: 'that recipe. ',
            RECIPE_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },
    'de-DE': {
        translation: {
            SSML_SKILL_NAME: '<phoneme alphabet="ipa" ph="peɪ-bɛk">PAYBACK</phoneme>',
            SKILL_NAME: 'PAYBACK',
            WELCOME_MESSAGE: 'Herzlich Willkommen bei %s. Du hast aktuell %i Punkte. Möchtest du etwas über deine aktuellen Coupons wissen?',
            WELCOME_REPROMT: 'Wenn du wissen möchtest, was du sagen kannst, sag einfach „Hilf mir“.',
            HELP_MESSAGE: 'Du kannst beispielsweise Fragen stellen wie „welche ECoupons von REWE habe ich“, du kannst aber auch nach deinen letzten Einkäufen fragen - oder du kannst „Beenden“ sagen ... Was kann PAYBACK für dich tun?',
            HELP_REPROMT: 'Du kannst beispielsweise Sachen sagen wie „Wie geht das Rezept für“ oder du kannst „Beenden“ sagen ... Wie kann ich dir helfen?',
            STOP_MESSAGE: 'Bis bald und viel Spaß beim Einkaufen!',
            POINTBALANCE_DEMO_PROMPT: 'Dein aktueller PAYBACK Punktestand ist %i Punkte. Super dass du so viel gesammelt hast! Wenn du noch mehr Punkte sammeln magst, sage einfach coupons. Du kannst deine Punkte aber natuerlich auch im Prämienshop in der App oder im Web gegen spannede Prämien eintauschen.',
            POINTBALNCE_REPROMPT:'Möchtest du etwas über deinen Coupons wissen? Sonst kannst du auch einfach Hilf sagen',
            COUPONS_DEMO_PROMPT_REWE: 'REWE Coupons',
            COUPONS_DEMO_PROMPT_FRESSNAPF: 'REWE Coupons',
            COUPONS_DEMO_PROMPT_OTHER: 'Leider konnte ich keine Coupons für diesen Partner finden. Du kannst entweder durch all deine Coupons gehen oder nach einem bestimmten anderen Partner fragen.',
            COUPONS_DEMO_PROMPT: 'Hier kommt was ueber deine Coupons',
            COUPONS_REPROMPT:'Was möchtest du tun?',
            TRANSACTIONS_DEMO_PROMPT: 'Die letzten Transaktionen waren am 27.5. bei dm - dafür hast du 22 Punkte bekommen, am 20.5. bei REWE für 32 Punkte und am 20.5. bei Apollo mit insgesamt 342 Punkten. Möchtest du noch mehr Punkte sammeln? Dann sage jetzt Coupons.',
            TRANSACTIONS_REPROMPT:'Möchtest du etwas über deinen Coupons wissen? Sonst kannst du auch einfach Hilf sagen'
        },
    },
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};


function handlePointBalance(alexa)
{           
            let pointBalance=2234;
            let speechOutput = alexa.t('POINTBALANCE_DEMO_PROMPT',pointBalance);
            let reprompt= alexa.t('POINTBALNCE_REPROMPT');
            alexa.attributes.speechOutput = speechOutput;
            
            alexa.emit(':ask', speechOutput,reprompt);
}

function handleCoupons(alexa,partnerName)
{           
            let pointBalance=2234;
            if (partnerName== null) {
                let speechOutput = alexa.t('COUPONS_DEMO_PROMPT');
            } else if (partnerName=="rewe") {

            }
            let reprompt= alexa.t('COUPONS_REPROMPT');
            
            alexa.attributes.speechOutput = speechOutput;

            alexa.emit(':ask', speechOutput,reprompt);
}

function handleLastTransactions(alexa)
{           
            let speechOutput = alexa.t('TRANSACTIONS_DEMO_PROMPT');

            alexa.attributes.speechOutput = speechOutput;

            let reprompt= alexa.t('TRANSACTIONS_REPROMPT');
            alexa.attributes.speechOutput = speechOutput;
            
            alexa.emit(':ask', speechOutput,reprompt);
}

/**
 * 
 * 
        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
        const myRecipes = this.t('RECIPES');
        const recipe = myRecipes[itemName];

        if (recipe) {
            this.attributes.speechOutput = recipe;
            this.attributes.repromptSpeech = this.t('RECIPE_REPEAT_MESSAGE');
            this.emit(':askWithCard', recipe, this.attributes.repromptSpeech, cardTitle, recipe);
        } else {
            let speechOutput = this.t('RECIPE_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('RECIPE_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('RECIPE_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
 */