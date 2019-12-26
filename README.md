# matrix-alexa-skill
Ask Alexa to ask Matrix to do things

> Alexa, ask Matrix to send a message to Jonathan

## Using the hosted skill

TODO

## Building your own

1. Create a new custom Alexa skill at developer.amazon.com
2. Set up an endpoint to reach where you want your Alexa bot to run
3. Set up the intents as below
4. Build the model
5. Run this library (see configuration below)
6. Try it out

### Running

TODO

### Intents

#### `SendMessageIntent`

Utterances:
* say hello to `{displayName}`
* send a message to `{displayName}`

Slots:
* `displayName` - `AMAZON.FirstName` - Required.
  * Prompt: I can do that. Who would you like to send this message to?
  * Utterance: `{displayName}`
* `message` - `AMAZON.SearchQuery` - Required.
  * Prompt: I can help with that. What should the message say?
  * Utterance: `{message}`


