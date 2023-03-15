import express, { Express, Request, Response } from 'express';
import { Fluence, FluencePeer, KeyPair } from '@fluencelabs/fluence';
import {get_metadata_uri } from './_aqua/metadata';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const peer = new FluencePeer();

async function runFluence() {
  try {
    await peer.start({
        connectTo: process.env.RELAY,
    });
    console.log(
      'created a fluence client %s with relay %s',
      peer.getStatus().peerId,
      peer.getStatus().relayPeerId,
    );
  } catch (err) {
    console.error({err})
  }
}

function isJsonObject(strData: string) {
  try {
      JSON.parse(strData);
  } catch (e) {
      return false;
  }
  return true;
}

const app: Express = express();
const port = process.env.PORT || 3030;
const ttl = Number(process.env.TTL || 10000);

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Nothing to see here :p');
});

app.get('/metadata/:id', async (req: Request, res: Response) => {
  console.log(peer.getStatus())
  try {

    const response = await get_metadata_uri(peer, req.params.id, { ttl: ttl } );
    console.log({response})
    let data = JSON.parse(response)

    data = Object.keys(data).reduce((prev, curr) => {
      let content = ""
      if (isJsonObject(data[curr])) {
        let d = JSON.parse(data[curr])

        if (d.content) {
          content = isJsonObject(d.content) ? JSON.parse(d.content) : d.content
        } else {
          content = d
        }
      }
      
      return {
        ...prev,
        [curr]: content
      }
    }, {})

    res.json(data);
  } catch (err) {
    console.log({err})
    res.status(400).json({
      error: err
    })
  }
});

app.listen(port, async () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  runFluence();
});