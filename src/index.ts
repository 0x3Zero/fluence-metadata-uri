import express, { Express, Request, Response } from 'express';
import { JSONRPCClient, TypedJSONRPCClient } from 'json-rpc-2.0';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import { Filter, Methods } from './types';

dotenv.config();

const jsonRpcUrl = process.env.JSONRPC_URL || "";
const client: TypedJSONRPCClient<Methods> = new JSONRPCClient((jsonRPCRequest) =>
  axios(jsonRpcUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    data: jsonRPCRequest,
  }).then((response) => {
    if (response.status === 200) {
      // Use client.receive when you received a JSON-RPC response.
      return client.receive(response.data)
    } else if (jsonRPCRequest.id !== undefined) {
      return Promise.reject(new Error(response.statusText));
    }
  })
);

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

app.get('/metadata/:dataKey', async (req: Request, res: Response) => {
  try {

    let metadatas = await client.request("get_metadatas", [req.params.dataKey, ""]);
    let data: any = {}

    if (metadatas.success) {
      for (let val of metadatas.metadatas) {
        let content = await client.request("ipfs_get", [val.cid]);
        
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

    // const response = await get_metadata_uri(peer, req.params.id, { ttl: ttl } );
    // console.log({response})

    // let data: any = {}
    // let quantum: any = {}

    // if (response.success) {

    //   for (let val of response.metadatas) {
    //     let content = await ipfs_get(peer, val.cid, { ttl: ttl });

    //     if (content.success) {
    //       if (isJsonObject(content.content)) {
    //         let d = JSON.parse(content.content)

    //         if (d.content) {
    //           data[val.alias != "" ? val.alias : val.public_key] = d.content;
    //           if (val.alias === "") {
    //             quantum[val.public_key] = d.content;
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    // data['quantum'] = quantum;
    res.json(data);
  } catch (err) {
    console.log({err})
    res.status(400).json({
      error: err
    })
  }
});

app.get('/metadata/:tokenKey/:tokenId', async (req: Request, res: Response) => {
  try {

    let metadatas = await client.request("get_metadatas_by_tokenkey", [req.params.tokenKey, req.params.tokenId, ""]);
    let data: any = {}

    if (metadatas.success) {
      for (let val of metadatas.metadatas) {
        let content = await client.request("ipfs_get", [val.cid]);
        
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

app.get('/metadata/:chainId/:tokenAddress/:tokenId', async (req: Request, res: Response) => {
  try {

    let tokenKey = await client.request("generate_token_key", [req.params.chainId, req.params.tokenAddress]);

    let metadatas = await client.request("get_metadatas_by_tokenkey", [tokenKey, req.params.tokenId, ""]);
    let data: any = {}

    if (metadatas.success) {
      for (let val of metadatas.metadatas) {
        let content = await client.request("ipfs_get", [val.cid]);
        
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
});