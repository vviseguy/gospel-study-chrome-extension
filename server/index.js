

const ChatSession = require("./chatInterface.js");
let chatSession = new ChatSession();
function printHeader(str){
  console.clear();
  console.log(str);
}

const express = require('express');
const cors = require('cors')
const app = express();
printHeader("\nLoading...");




// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 1830;


app.use(cors())

// {
//   origin: '*://www.churchofjesuschrist.org/*'
// }

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses -- WHAT DOES THIS DO?
app.set('trust proxy', true);

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/ask`, apiRouter);


printHeader("\nLoading... done");


apiRouter.get('/q/:question', async (req, res) => {
  // console.log("[user] asked question: "+req.headers.question);
  // // console.log("with: "+JSON.stringify(req.headers));
  // console.log("with body: "+JSON.stringify(req.body));
  // console.log(req.params.question);
  
  await chatSession.ask(req.params.question)
  .then((response) => res.send({"msg": response }))
  .then(()=> console.log("sent!"))
  .catch(
    (err)=>{
      console.log(err);
      return res.status(404).send({ msg: 'There was an error' });
    }
  );
});

apiRouter.get('/d/:question', async (req, res) => {
  
  await chatSession.ask_demo(req.params.question)
  .then((response) => res.send({"msg": response }))
  .then(()=> console.log("sent!"))
  .catch(
    (err)=>{
      console.log(err);
      return res.status(404).send({ msg: 'There was an error' });
    }
  );
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// peerProxy(httpService);
