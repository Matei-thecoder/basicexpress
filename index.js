
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

require('dotenv').config()

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  
}
run().catch(console.dir);


// Create an instance of an Express application
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json())
// Define a port for the server to listen on
const port = 3000;
const db = client.db('app');
const users = db.collection('users');
const messages = db.collection('messages');
// Define a basic route for the root URL "/"

app.post('/signup',(req,res)=>{
  const username = req.body.user;
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password,10);
  const data = {
    username : username,
    email:email,
    password:hashedPassword
  }
  let finduser;
  const findUser = async()=>{
    finduser= await users.findOne({username:username});
  }
  findUser();
  console.log(finduser);
  
  if(finduser)
  {
    console.log(finduser);
    res.send('user already exists');
  }
  else
  {
    const insert = async()=>{
      try{
        await users.insertOne(data);
        console.log('inserted');
      }
      catch(e)
      {
        console.log(e);
      }
    }
    insert();
    res.send('ok');
  }
  

})

app.post('/login',(req,res)=>{
  const username = req.body.user;
  const password = req.body.password;

  let finduser;
  const findUser = async()=>{
    finduser= await users.findOne({username:username});
    if(finduser)
      {
        console.log(finduser);
          let verifiedpassword = bcrypt.compareSync(password,finduser.password);
          if(verifiedpassword)
          {
            let data = {
              result:"ok",
              username:username
            }
            res.cookie("username",username);
              res.send(data);
              console.log('ok');
              
          }
          else
          {
            res.send('error2');
            console.log('wrong password')
          }
      }
    else
    {
      res.send('error1');
      console.log('user doesnt exist')
    }
  }
  findUser();
  
  
});
app.post("/getMessages",(req,res)=>{
  let allMessages;
  const getMessages = async()=>{
    allMessages = await messages.find();
    if(allMessages)
    {
      if(allMessages.length>0)
      {
        res.send(allMessages);
        console.log("messages send");
      }
      else
      {
        res.send('no messages');
        console.log("no messages");
      }
     
    }
    else
    {
      res.send('error');
      console.log('error')
    }

  }
  getMessages();
})

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});