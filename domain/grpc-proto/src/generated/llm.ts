// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.0
//   protoc               v3.19.1
// source: llm.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from '@bufbuild/protobuf/wire';
import {
  type CallOptions,
  ChannelCredentials,
  Client,
  type ClientOptions,
  type ClientUnaryCall,
  type handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  type ServiceError,
  type UntypedServiceImplementation,
} from '@grpc/grpc-js';

export const protobufPackage = 'llm.v1';

export interface EnhanceQueryTextRequest {
  text: string;
  context: string;
}

export interface EnhanceQueryTextResponse {
  enhancedText: string;
}

function createBaseEnhanceQueryTextRequest(): EnhanceQueryTextRequest {
  return { text: '', context: '' };
}

export const EnhanceQueryTextRequest: MessageFns<EnhanceQueryTextRequest> = {
  encode(message: EnhanceQueryTextRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.text !== '') {
      writer.uint32(10).string(message.text);
    }
    if (message.context !== '') {
      writer.uint32(18).string(message.context);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): EnhanceQueryTextRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEnhanceQueryTextRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.text = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.context = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EnhanceQueryTextRequest {
    return {
      text: isSet(object.text) ? globalThis.String(object.text) : '',
      context: isSet(object.context) ? globalThis.String(object.context) : '',
    };
  },

  toJSON(message: EnhanceQueryTextRequest): unknown {
    const obj: any = {};
    if (message.text !== '') {
      obj.text = message.text;
    }
    if (message.context !== '') {
      obj.context = message.context;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EnhanceQueryTextRequest>, I>>(base?: I): EnhanceQueryTextRequest {
    return EnhanceQueryTextRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EnhanceQueryTextRequest>, I>>(object: I): EnhanceQueryTextRequest {
    const message = createBaseEnhanceQueryTextRequest();
    message.text = object.text ?? '';
    message.context = object.context ?? '';
    return message;
  },
};

function createBaseEnhanceQueryTextResponse(): EnhanceQueryTextResponse {
  return { enhancedText: '' };
}

export const EnhanceQueryTextResponse: MessageFns<EnhanceQueryTextResponse> = {
  encode(message: EnhanceQueryTextResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.enhancedText !== '') {
      writer.uint32(10).string(message.enhancedText);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): EnhanceQueryTextResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEnhanceQueryTextResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.enhancedText = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EnhanceQueryTextResponse {
    return { enhancedText: isSet(object.enhancedText) ? globalThis.String(object.enhancedText) : '' };
  },

  toJSON(message: EnhanceQueryTextResponse): unknown {
    const obj: any = {};
    if (message.enhancedText !== '') {
      obj.enhancedText = message.enhancedText;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EnhanceQueryTextResponse>, I>>(base?: I): EnhanceQueryTextResponse {
    return EnhanceQueryTextResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EnhanceQueryTextResponse>, I>>(object: I): EnhanceQueryTextResponse {
    const message = createBaseEnhanceQueryTextResponse();
    message.enhancedText = object.enhancedText ?? '';
    return message;
  },
};

export type ServiceLLMService = typeof ServiceLLMService;
export const ServiceLLMService = {
  enhanceQueryText: {
    path: '/llm.v1.ServiceLLM/EnhanceQueryText',
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: EnhanceQueryTextRequest) => Buffer.from(EnhanceQueryTextRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => EnhanceQueryTextRequest.decode(value),
    responseSerialize: (value: EnhanceQueryTextResponse) => Buffer.from(EnhanceQueryTextResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => EnhanceQueryTextResponse.decode(value),
  },
} as const;

export interface ServiceLLMServer extends UntypedServiceImplementation {
  enhanceQueryText: handleUnaryCall<EnhanceQueryTextRequest, EnhanceQueryTextResponse>;
}

export interface ServiceLLMClient extends Client {
  enhanceQueryText(request: EnhanceQueryTextRequest, callback: (error: ServiceError | null, response: EnhanceQueryTextResponse) => void): ClientUnaryCall;
  enhanceQueryText(
    request: EnhanceQueryTextRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: EnhanceQueryTextResponse) => void
  ): ClientUnaryCall;
  enhanceQueryText(
    request: EnhanceQueryTextRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: EnhanceQueryTextResponse) => void
  ): ClientUnaryCall;
}

export const ServiceLLMClient = makeGenericClientConstructor(ServiceLLMService, 'llm.v1.ServiceLLM') as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): ServiceLLMClient;
  service: typeof ServiceLLMService;
  serviceName: string;
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends globalThis.Array<infer U>
    ? globalThis.Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : T extends {}
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}