/**
 *
 * This file is auto-generated. Do not edit manually: changes may be erased.
 * Generated by Aqua compiler: https://github.com/fluencelabs/aqua/.
 * If you find any bugs, please write an issue on GitHub: https://github.com/fluencelabs/aqua/issues
 * Aqua version: 0.9.4
 *
 */
import { FluencePeer } from '@fluencelabs/fluence';
import type { CallParams$$ } from '@fluencelabs/fluence/dist/internal/compilerSupport/v4'
import {
    callFunction$$,
    registerService$$,
} from '@fluencelabs/fluence/dist/internal/compilerSupport/v4';


// Services

export interface MyOpDef {
    array_length: (fdb: { alias: string; cid: string; data_key: string; public_key: string; }[], callParams: CallParams$$<'fdb'>) => number | Promise<number>;
}
export function registerMyOp(service: MyOpDef): void;
export function registerMyOp(serviceId: string, service: MyOpDef): void;
export function registerMyOp(peer: FluencePeer, service: MyOpDef): void;
export function registerMyOp(peer: FluencePeer, serviceId: string, service: MyOpDef): void;
       

export function registerMyOp(...args: any) {
    registerService$$(
        args,
        {
    "defaultServiceId" : "op",
    "functions" : {
        "tag" : "labeledProduct",
        "fields" : {
            "array_length" : {
                "tag" : "arrow",
                "domain" : {
                    "tag" : "labeledProduct",
                    "fields" : {
                        "fdb" : {
                            "tag" : "array",
                            "type" : {
                                "tag" : "struct",
                                "name" : "FdbDht",
                                "fields" : {
                                    "alias" : {
                                        "tag" : "scalar",
                                        "name" : "string"
                                    },
                                    "cid" : {
                                        "tag" : "scalar",
                                        "name" : "string"
                                    },
                                    "data_key" : {
                                        "tag" : "scalar",
                                        "name" : "string"
                                    },
                                    "public_key" : {
                                        "tag" : "scalar",
                                        "name" : "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "codomain" : {
                    "tag" : "unlabeledProduct",
                    "items" : [
                        {
                            "tag" : "scalar",
                            "name" : "i64"
                        }
                    ]
                }
            }
        }
    }
}
    );
}
      
// Functions
 
export type InitializeResult = { err_msg: string; success: boolean; }
export function initialize(
    config?: {ttl?: number}
): Promise<InitializeResult>;

export function initialize(
    peer: FluencePeer,
    config?: {ttl?: number}
): Promise<InitializeResult>;

export function initialize(...args: any) {

    let script = `
                    (xor
                     (seq
                      (seq
                       (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                       (xor
                        (call -relay- ("${process.env.DHT_SERVICE_ID}" "initialize") [] result)
                        (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                       )
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [result])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
    return callFunction$$(
        args,
        {
    "functionName" : "initialize",
    "arrow" : {
        "tag" : "arrow",
        "domain" : {
            "tag" : "labeledProduct",
            "fields" : {
                
            }
        },
        "codomain" : {
            "tag" : "unlabeledProduct",
            "items" : [
                {
                    "tag" : "struct",
                    "name" : "FdbResult",
                    "fields" : {
                        "err_msg" : {
                            "tag" : "scalar",
                            "name" : "string"
                        },
                        "success" : {
                            "tag" : "scalar",
                            "name" : "bool"
                        }
                    }
                }
            ]
        }
    },
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}

 
export type Sign_and_insertResult = [{ cid: string; error: string; success: boolean; }, { err_msg: string; success: boolean; }]
export function sign_and_insert(
    key: string,
    pk: string,
    sk: string,
    content: string,
    name: string,
    config?: {ttl?: number}
): Promise<Sign_and_insertResult>;

export function sign_and_insert(
    peer: FluencePeer,
    key: string,
    pk: string,
    sk: string,
    content: string,
    name: string,
    config?: {ttl?: number}
): Promise<Sign_and_insertResult>;

export function sign_and_insert(...args: any) {

    let script = `
                    (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (seq
                            (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                            (call %init_peer_id% ("getDataSrv" "key") [] key)
                           )
                           (call %init_peer_id% ("getDataSrv" "pk") [] pk)
                          )
                          (call %init_peer_id% ("getDataSrv" "sk") [] sk)
                         )
                         (call %init_peer_id% ("getDataSrv" "content") [] content)
                        )
                        (call %init_peer_id% ("getDataSrv" "name") [] name)
                       )
                       (xor
                        (seq
                         (seq
                          (call -relay- ("ed25519" "sign") [content sk] signature)
                          (call -relay- ("ipfs_dag" "put") [content "" 0] result)
                         )
                         (call -relay- ("${process.env.DHT_SERVICE_ID}" "insert") [key name result.$.cid! pk signature content ""] rst)
                        )
                        (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                       )
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [result rst])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
    return callFunction$$(
        args,
        {
    "functionName" : "sign_and_insert",
    "arrow" : {
        "tag" : "arrow",
        "domain" : {
            "tag" : "labeledProduct",
            "fields" : {
                "key" : {
                    "tag" : "scalar",
                    "name" : "string"
                },
                "pk" : {
                    "tag" : "scalar",
                    "name" : "string"
                },
                "sk" : {
                    "tag" : "scalar",
                    "name" : "string"
                },
                "content" : {
                    "tag" : "scalar",
                    "name" : "string"
                },
                "name" : {
                    "tag" : "scalar",
                    "name" : "string"
                }
            }
        },
        "codomain" : {
            "tag" : "unlabeledProduct",
            "items" : [
                {
                    "tag" : "struct",
                    "name" : "IpfsDagPutResult",
                    "fields" : {
                        "cid" : {
                            "tag" : "scalar",
                            "name" : "string"
                        },
                        "error" : {
                            "tag" : "scalar",
                            "name" : "string"
                        },
                        "success" : {
                            "tag" : "scalar",
                            "name" : "bool"
                        }
                    }
                },
                {
                    "tag" : "struct",
                    "name" : "FdbResult",
                    "fields" : {
                        "err_msg" : {
                            "tag" : "scalar",
                            "name" : "string"
                        },
                        "success" : {
                            "tag" : "scalar",
                            "name" : "bool"
                        }
                    }
                }
            ]
        }
    },
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}

 

export function get_metadata_uri(
    key: string,
    config?: {ttl?: number}
): Promise<string>;

export function get_metadata_uri(
    peer: FluencePeer,
    key: string,
    config?: {ttl?: number}
): Promise<string>;

export function get_metadata_uri(...args: any) {

    let script = `
                    (xor
                     (seq
                      (seq
                       (seq
                        (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                        (call %init_peer_id% ("getDataSrv" "key") [] key)
                       )
                       (new $rss
                        (xor
                         (seq
                          (seq
                           (seq
                            (seq
                             (seq
                              (call -relay- ("${process.env.DHT_SERVICE_ID}" "get_records_by_key") [key] get_records_by_key)
                              (call -relay- ("op" "array_length") [get_records_by_key] n)
                             )
                             (par
                              (fold get_records_by_key rst-0
                               (par
                                (new $sb
                                 (seq
                                  (seq
                                   (seq
                                    (call -relay- ("ipfs_dag" "get") [rst-0.$.cid! "" 0] get)
                                    (xor
                                     (mismatch rst-0.$.alias! ""
                                      (xor
                                       (seq
                                        (null)
                                        (call -relay- ("block_formatter" "serialize") [rst-0.$.alias! get.$.content! rst-0.$.cid!] $sb)
                                       )
                                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                                      )
                                     )
                                     (seq
                                      (null)
                                      (call -relay- ("block_formatter" "serialize") [rst-0.$.public_key! get.$.content! rst-0.$.cid!] $sb)
                                     )
                                    )
                                   )
                                   (new $sb_test
                                    (seq
                                     (seq
                                      (seq
                                       (call -relay- ("math" "add") [0 1] sb_incr)
                                       (fold $sb s
                                        (seq
                                         (seq
                                          (ap s $sb_test)
                                          (canon -relay- $sb_test  #sb_iter_canon)
                                         )
                                         (xor
                                          (match #sb_iter_canon.length sb_incr
                                           (null)
                                          )
                                          (next s)
                                         )
                                        )
                                        (never)
                                       )
                                      )
                                      (canon -relay- $sb_test  #sb_result_canon)
                                     )
                                     (ap #sb_result_canon sb_gate)
                                    )
                                   )
                                  )
                                  (call -relay- ("block_formatter" "deserialize") [sb_gate.$.[0]!] $rss)
                                 )
                                )
                                (next rst-0)
                               )
                               (never)
                              )
                              (null)
                             )
                            )
                            (par
                             (seq
                              (seq
                               (call -relay- ("math" "sub") [n 1] sub)
                               (new $rss_test
                                (seq
                                 (seq
                                  (seq
                                   (call -relay- ("math" "add") [sub 1] rss_incr)
                                   (fold $rss s
                                    (seq
                                     (seq
                                      (ap s $rss_test)
                                      (canon -relay- $rss_test  #rss_iter_canon)
                                     )
                                     (xor
                                      (match #rss_iter_canon.length rss_incr
                                       (null)
                                      )
                                      (next s)
                                     )
                                    )
                                    (never)
                                   )
                                  )
                                  (canon -relay- $rss_test  #rss_result_canon)
                                 )
                                 (ap #rss_result_canon rss_gate)
                                )
                               )
                              )
                              (call -relay- ("math" "sub") [n 1] sub-0)
                             )
                             (call -relay- ("peer" "timeout") [9000 "timeout"])
                            )
                           )
                           (canon -relay- $rss  #rss_canon)
                          )
                          (call -relay- ("block_formatter" "format") ["" #rss_canon] format)
                         )
                         (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                        )
                       )
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [format])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 4])
                    )
    `
    return callFunction$$(
        args,
        {
    "functionName" : "get_metadata_uri",
    "arrow" : {
        "tag" : "arrow",
        "domain" : {
            "tag" : "labeledProduct",
            "fields" : {
                "key" : {
                    "tag" : "scalar",
                    "name" : "string"
                }
            }
        },
        "codomain" : {
            "tag" : "unlabeledProduct",
            "items" : [
                {
                    "tag" : "scalar",
                    "name" : "string"
                }
            ]
        }
    },
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}
