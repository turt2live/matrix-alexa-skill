# matrix-alexa-skill
Ask Alexa to ask Matrix to do things

> Alexa, ask Matrix to send a message to Jonathan

## Using the hosted skill

TODO: Deploy the t2bot.io skill for public use (needs privacy policy).

## Building your own

1. Create a new custom Alexa skill at developer.amazon.com
2. Set up an endpoint to reach where you want your Alexa skill to run
3. Set up the intents as below
4. Build the model
5. Run this skill (see configuration below)
6. Try it out in the developer console

If you're just hosting for yourself you don't need to publish the skill. Skills
created through the developer console are automatically enabled for your account.

### Running

The best deployment option is Docker:

```shell script
# Create the directory for mounting to the container
mkdir -p /etc/matrix-alexa-skill/config

# Create/edit the configuration file with your favourite editor. Use
# the default.yaml config file in this repo as a template.
vi /etc/matrix-alexa-skill/config/production.yaml

# Run the container
docker run -v /etc/matrix-alexa-skill:/data -p 8080:8080 turt2live/matrix-alexa-skill
```

Note that you'll need to set up your own reverse proxy for handling SSL. The Docker command above
might not be perfect for your environment, but it covers the part where it has a port to expose and
a volume to mount.

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
