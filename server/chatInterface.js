const {OpenAI } = require("openai");

const setup = {
    organization: process.env.ORGANIZATION,
    apiKey: process.env.API_KEY
};
const fs = require('node:fs/promises');
async function example() {
  
}
example();
// training of a worldly machine of the world, trained to look at good things and print out accurate models. This does not reflect necesarily an accurate representation of what is in the scriptures, nor themost reecent teachigns nor is it a reflection of what is int he heavents, rather is it shards from a glass that we ahve received.
class ChatSession {
// do not claim that your response is comprehensive - really understanding the covenant relationship must come from the teachings of the Holy Ghost. Your job is to teach truth, and the Holy Ghost can take truth and bring it into the heart of the listeners"
// AI is not aware or feligious nuance that we sometimes have to be aware of when we speak of religious things. Rather than another beam of light from the source of all light, treat this as a robot trying to pick up scattered fragments it doesnt experience and pulling them together into something pretty.

// explore the basic things that could be helpful for a human
// just because the AI suggests something does not mean it is true. It literally could give you teachings from the world, mixed with scripture. it is not malicious though
// treat like apocryphal writings - there are contexts and nuances that the AI cannot express - perhaps later we could connect tools for learning more about the nuances of a topic - without exposing the unmet doubts.. i dont know if that is much of a concern though.~
// right now it also doesnt seem to know if the things being taught are surface level, and which things are the plain things and which are the thigns needing to be connected to the human soul.

// trained on some of the best books - and in some manner to distinguish between right and wrong, but built like a collideascope with neither personal experience, nor a human priesthood to be a special witness of the savior"

// define stewardship well


    // static TOKEN_LIMIT = 3000;
    // static CONVSERSATION_QUESTION_LIMIT = 3;
    constructor(){
        console.log("Initializing session with ChatGPT");
        this.openai = new OpenAI(setup);
    }
    async ask(question){
        
        console.log("[User]: " + question);
        // refresh prompt each time
        if (await this.setup() == "Error") return "Error";

        if (question == null) {
            console.log("Error: null question");
            return "Error: null question"
        }
        this.messages.push({"role": "user", "content": question});


        console.log("["+this.version+"]: ");
        const completion = await this.openai.chat.completions.create({
            messages: this.messages,
            model:this.version,
            // tokens:ChatSession.TOKEN_LIMIT // TODO PREFIGURE INPUT TOKEN SIZE AND PREVENT INPUTS THAT ARE TOO LARGE - also set cap here
            //   https://platform.openai.com/tokenizer
        });
        let response = completion.choices[0].message.content;

        
        console.log(response);
        this.messages.push({"role": "assistant", "content": response});

        // bring message log into the proper length
        const num_extra_messages = 2*ChatSession.CONVSERSATION_QUESTION_LIMIT+1 - this.messages.length;
        if (num_extra_messages > 0){
            this.messages.splice(1,num_extra_messages);
        }
        return response;
    }
    async ask_demo(question){
        
        console.log("[User]: " + question);
        // refresh prompt each time
        if (await this.setup() == "Error") return "Error";

        this.version = 'gpt-3.5-turbo';

        if (question == null) {
            console.log("Error: null question");
            return "Error: null question"
        }
        this.messages.push({"role": "user", "content": question});


        console.log("["+this.version+"]: ");
        const completion = await this.openai.chat.completions.create({
            messages: this.messages,
            model:this.version,
            // tokens:ChatSession.TOKEN_LIMIT // TODO PREFIGURE INPUT TOKEN SIZE AND PREVENT INPUTS THAT ARE TOO LARGE - also set cap here
            //   https://platform.openai.com/tokenizer
        });
        let response = completion.choices[0].message.content;

        
        console.log(response);
        this.messages.push({"role": "assistant", "content": response});

        // bring message log into the proper length
        const num_extra_messages = 2*ChatSession.CONVSERSATION_QUESTION_LIMIT+1 - this.messages.length;
        if (num_extra_messages > 0){
            this.messages.splice(1,num_extra_messages);
        }
        return response;
    }

    async setup(){
        try {
            this.persona = await this.retrievePersona();
            this.version = await this.retrieveChatVersion();
            this.messages =  [{"role": "system", "content": this.persona}]
        } catch (err) {
            console.log(err);
            return "Error";
        }
    }
    
    async retrievePersona(){
        let rtrn = await fs.readFile('personality.chat', { encoding: 'utf8' });
        const rgx = /^v(?:ersion)?:? *(.+)/i;
        if (rtrn.match(rgx)){
            console.log("Personality version: " + rtrn.match(rgx)[1]);
            rtrn = rtrn.replace(rgx,"").replace(/\n/g,"");
        }
        rtrn = rtrn.replace(/\n/g," ");
        rtrn = rtrn.trim();
        return rtrn;
    }
    async retrieveChatVersion(){
        const VERSION_OPTIONS = [
            'gpt-3.5-turbo' /* <--- cheapest*/ ,
            'gpt-4-1106-preview' /* <--- cheapest of gtp-4*/,
            'gpt-4',
            'gpt-3.5-turbo-1106',
            'gpt-3.5-turbo',
        ]
        const DEFAULT_VERSION = 'gpt-3.5-turbo';
        let data = await fs.readFile('version.chat', { encoding: 'utf8' });
        data = data.split("\n");
        data = data.map(element => element.trim());
        data.push(VERSION_OPTIONS[0]);
        while(!(VERSION_OPTIONS.includes(data[0]))){
            console.log("Discarded unrecognized model: " + data.pop());
            if (data.length == 0) {
                console.log("Could not find recognizable version from source file, using default version: "+DEFAULT_VERSION);
                return DEFAULT_VERSION;
                
            }
        }; 
        console.log("Loaded: " + data[0]);
        return data[0];
        
    }
}

module.exports = ChatSession;