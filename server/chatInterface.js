const {OpenAI} = require("openai");

const setup = { /** REQUIRED ENVIRONEMENT VARIABLES - mainly the api key */
    organization: process.env.ORGANIZATION,
    apiKey: process.env.GPT_API_KEY
};
const fs = require('node:fs/promises');

class ChatSession {


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
        let rtrn = await fs.readFile('./personality.chat', { encoding: 'utf8' });
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
            'gpt-4-0125-preview',
            'gpt-4-turbo-preview'
        ]
        const DEFAULT_VERSION = 'gpt-3.5-turbo';
        let data = await fs.readFile('version.chat', { encoding: 'utf8' });
        data = data.split("\n");
        data = data.map(element => element.trim());
        data.push(VERSION_OPTIONS[0]);
        while(true/**!(VERSION_OPTIONS.includes(data[0]))**/){
            console.log("Discarded unrecognized model: " + data.pop());
            if (data.length == 0) {
                console.log("Could not find recognizable version from source file, using default version: "+DEFAULT_VERSION);
                return DEFAULT_VERSION;
                
            }
        }; 
        console.log("GPT Model: " + data[0]);
        return data[0];
        
    }
}

module.exports = ChatSession;