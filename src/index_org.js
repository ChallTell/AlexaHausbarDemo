/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/

'use strict';

const Alexa = require('alexa-sdk');

const recipes = require('./drink_data_simple.json');

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            RECIPES: recipes.RECIPE_EN_US,
            SKILL_NAME: 'Minecraft Helper',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what\'s the recipe for a chest? ... Now, what can I help you with?",
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
            RECIPES: recipes.RECIPE_EN_US,
            SKILL_NAME: 'American Minecraft Helper',
        },
    },
    'en-GB': {
        translation: {
            RECIPES: recipes.RECIPE_EN_GB,
            SKILL_NAME: 'British Minecraft Helper',
        },
    },
    'de': {
        translation: {
            RECIPES: recipes,
            SKILL_NAME: 'deine Hausbar',
            WELCOME_MESSAGE: 'Willkommen bei %s. Du kannst beispielsweise die Frage stellen: Wie ist das Rezept für einen Old Fashioned ... Nun, womit kann ich dir helfen?',
            WELCOME_REPROMT: 'Wenn du wissen möchtest, was du sagen kannst, sag einfach „Hilf mir“.',
            DISPLAY_CARD_TITLE: '%s - Rezept für %s.',
            HELP_MESSAGE: 'Du kannst beispielsweise Fragen stellen wie „Wie geht das Rezept für“ oder du kannst „Beenden“ sagen ... Wie kann ich dir helfen?',
            HELP_REPROMT: 'Du kannst beispielsweise Sachen sagen wie „Wie geht das Rezept für“ oder du kannst „Beenden“ sagen ... Wie kann ich dir helfen?',
            STOP_MESSAGE: 'Prost und viel Spaß!',
            RECIPE_REPEAT_MESSAGE: 'Sage einfach „Wiederholen“.',
            RECIPE_NOT_FOUND_MESSAGE: 'Tut mir leid, ich kenne derzeit ',
            RECIPE_NOT_FOUND_WITH_ITEM_NAME: 'das Rezept für %s nicht. ',
            RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: 'dieses Rezept nicht. ',
            RECIPE_NOT_FOUND_REPROMPT: 'Womit kann ich dir sonst helfen?',
            RECIPE_MESSAGE: 'Einen %s bereitest du so zu: %s. Kann ich dir sonst noch helfen?',
            RECIPE_MESSAGE_RANDOM: 'Ich hätte einen %s anzubieten. Dafür musst du %s. Kann ich dir sonst noch helfen?'
        },
    },
};

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'RandomDrinkIntent': function () {
        
        const myRecipes = this.t('RECIPES');
        let names=Object.keys(myRecipes);
        let index = Math.floor(Math.random()*names.length);
        let itemName=names[index];
        console.log("Looking at recipe %s at it %s",itemName,index);
          const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
        const recipe = myRecipes[itemName];

        if (recipe) {
            this.attributes.speechOutput = this.t('RECIPE_MESSAGE_RANDOM',itemName,recipe);
            this.attributes.repromptSpeech = this.t('RECIPE_REPEAT_MESSAGE');
            this.emit(':askWithCard', this.attributes.speechOutput, this.attributes.repromptSpeech, cardTitle, recipe);
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
        
    },
    'RecipeIntent': function () {
        const myRecipes = this.t('RECIPES');
        const itemSlot = this.event.request.intent.slots.Item;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value;
        }
        console.log("Looking for Cocktail: %s",itemName);
        let searchName=itemName.toLowerCase();
        let names=Object.keys(myRecipes);
        var lowerCaseNames = names.map(function(value) {
            return value.toLowerCase();
        });
        var pos = lowerCaseNames.indexOf(searchName);
        
        let recipeName=names[pos];
         
        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
        const recipe = myRecipes[recipeName];
        

        if (recipe) {
            this.attributes.speechOutput = this.t('RECIPE_MESSAGE',itemName,recipe);
            this.attributes.repromptSpeech = this.t('RECIPE_REPEAT_MESSAGE');
            this.emit(':askWithCard', this.attributes.speechOutput, this.attributes.repromptSpeech, cardTitle, recipe);
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
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
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
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

