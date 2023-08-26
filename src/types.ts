export type Methods = {
  get_complete_transactions(params: [number, number]): TransactionsResult;
  get_metadatas(params: [string, string]): MetadatasResult;
  get_metadatas_by_tokenkey(params: [string, string, string]): MetadatasResult;
  get_metadatas_by_block(params: [string, string]): MetadatasResult;
  ipfs_get(params: [string]): IpfsGetResult;
  search_metadatas(params: Filter): MetadatasResult;
  generate_token_key(params: [string, string]): string;
  generate_data_key(params: [string, string, string]): string;
  get_meta_contract(params: [string]): MetaContractResult;
};

export type Filter = {
  query: { column: string; op: string; query: string }[];
  ordering: { column: string; sort: string }[];
  from: number;
  to: number;
};

export type IpfsGetResult = { 
  content: string; 
  error: string; 
  success: boolean; 
}

export type Transaction = {
  alias: string; 
  chain_id: string; 
  data: string; 
  data_key: string; 
  hash: string; 
  mcdata: string; 
  meta_contract_id: 
  string; method: 
  string; public_key: 
  string; status: number; 
  timestamp: number; 
  token_address: string; 
  token_id: string; 
  token_key: string; 
  version: string; 
}

export type TransactionResult = { 
  err_msg: string; 
  success: boolean; 
  transaction: Transaction; 
}

export type TransactionsResult = { 
  err_msg: string; 
  success: boolean; 
  transactions: Transaction[]; 
}

export type Metadata = {
  alias: string; 
  cid: string; 
  data_key: string; 
  hash: string; 
  loose: number; 
  meta_contract_id: string; 
  public_key: string; 
  token_key: string; 
  version: string; 
}

export type MetadatasResult = { 
  err_msg: string; 
  metadatas: Metadata[]; 
  success: boolean; 
}

export type MetaContractResult = { 
  err_msg: string; 
  meta: { 
    cid: string; 
    hash: string; 
    meta_contract_id: string; 
    public_key: string; 
    token_key: string; 
  }; 
  success: boolean; 
}