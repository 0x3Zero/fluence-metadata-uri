import express, { Express, Request, Response } from 'express';
import { Fluence, FluencePeer, KeyPair } from '@fluencelabs/fluence';
import {get_metadata_uri, ipfs_get } from './_aqua/metadata';
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

    let data: any = {}

    if (response.success) {

      for (let val of response.metadatas) {
        let content = await ipfs_get(peer, val.cid, { ttl: ttl });

        if (content.success) {
          if (isJsonObject(content.content)) {
            let d = JSON.parse(content.content)

            if (d.content) {
              data[val.alias != "" ? val.alias : val.public_key] = d.content;
            }
          }
        }
      }
    }

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