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

// app.get('/metadata/:dataKey', async (req: Request, res: Response) => {
//   try {

//     let metadatas = await client.request("get_metadatas", [req.params.dataKey, ""]);
//     let data: any = {}

//     if (metadatas.success) {
//       for (let val of metadatas.metadatas) {
//         let content = await client.request("ipfs_get", [val.cid]);
        
//         if (content.success) {
//           if (isJsonObject(content.content)) {
//             let d = JSON.parse(content.content)

//             if (d.content) {
//               data[val.alias != "" ? val.alias : val.public_key] = d.content;
//             }
//           }
//         }
//       }
//     }
//     res.json(data);
//   } catch (err) {
//     console.log({err})
//     res.status(400).json({
//       error: err
//     })
//   }
// });

app.get('/metadata/:tokenKey/:tokenId', async (req: Request, res: Response) => {
  try {
    // let metaContract = await client.request("get_meta_contract", [req.params.tokenKey]);

    // if (!metaContract.success) {
    //   throw new Error(metaContract.err_msg);
    // }

    let metadatas = await client.request("search_metadatas", {
      query: [
        {
          column: "token_key",
          op: "=",
          query: req.params.tokenKey,
        },
        {
          column: "token_id",
          op: "=",
          query: req.params.tokenId,
        },
        {
          column: "meta_contract_id",
          op: "=",
          query: "0x01",
        },
      ],
      ordering: [],
      from: 0,
      to: 0,
    });
    let data: any = {}

    if (metadatas.success) {
      // let filteredMetadatas = metadatas.metadatas.filter(m => m.meta_contract_id === metaContract.meta.meta_contract_id)
      for (let val of metadatas.metadatas) {
        let content = await client.request("ipfs_get", [val.cid]);
        
        if (content.success) {
          if (isJsonObject(content.content)) {
            let d = JSON.parse(content.content)

            if (d.content) {
              if (val.alias != "") {
                  data[val.alias] = d.content;
              } else {
                if (val.loose) {
                  data[val.public_key] = d.content;
                } else {
                  data = { ...data, ...d.content};
                }
              }
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

    // console.log("tokenKey: ", tokenKey);
    // let metaContract = await client.request("get_meta_contract", [tokenKey]);

    // if (!metaContract.success) {
    //   throw new Error(metaContract.err_msg);
    // }

    // let dataKey = await client.request("generate_data_key", [req.params.chainId, req.params.tokenAddress, req.params.tokenId])

    let metadatas = await client.request("search_metadatas", {
      query: [
        {
          column: "token_key",
          op: "=",
          query: tokenKey,
        },
        {
          column: "token_id",
          op: "=",
          query: req.params.tokenId,
        },
        {
          column: "meta_contract_id",
          op: "=",
          query: "0x01",
        },
      ],
      ordering: [],
      from: 0,
      to: 0,
    });
    let data: any = {}

    // console.log("metadatas: ",metadatas);

    if (metadatas.success) {
      for (let val of metadatas.metadatas) {
        let content = await client.request("ipfs_get", [val.cid]);
        
        if (content.success) {
          if (isJsonObject(content.content)) {
            let d = JSON.parse(content.content)

            // console.log("d: ", d);

            if (d.content) {
              if (val.alias != "") {
                  data[val.alias] = d.content;
              } else {
                if (val.loose) {
                  data[val.public_key] = d.content;
                } else {
                  data = { ...data, ...d.content};
                }
              }
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