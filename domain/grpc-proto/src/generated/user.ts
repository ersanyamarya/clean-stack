// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               v3.19.1
// source: user.proto

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
import { Timestamp } from './google/protobuf/timestamp';

export const protobufPackage = 'user.v1';

export interface UserIdMessage {
  id: string;
}

export interface UserGenericResponse {
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string | undefined;
  id: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  photoUrl?: string | undefined;
}

export interface CreateUserResponse {
  id: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

export interface ListUsersRequest {
  page: number;
  limit: number;
}

export interface ListUsersResponse {
  users: UserGenericResponse[];
  total: number;
}

export interface UpdateUserRequest {
  id: string;
  firstName?: string | undefined;
  lastName?: string | undefined;
  email?: string | undefined;
  photoUrl?: string | undefined;
}

function createBaseUserIdMessage(): UserIdMessage {
  return { id: '' };
}

export const UserIdMessage: MessageFns<UserIdMessage> = {
  encode(message: UserIdMessage, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== '') {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): UserIdMessage {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserIdMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
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

  fromJSON(object: any): UserIdMessage {
    return { id: isSet(object.id) ? globalThis.String(object.id) : '' };
  },

  toJSON(message: UserIdMessage): unknown {
    const obj: any = {};
    if (message.id !== '') {
      obj.id = message.id;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UserIdMessage>, I>>(base?: I): UserIdMessage {
    return UserIdMessage.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UserIdMessage>, I>>(object: I): UserIdMessage {
    const message = createBaseUserIdMessage();
    message.id = object.id ?? '';
    return message;
  },
};

function createBaseUserGenericResponse(): UserGenericResponse {
  return {
    firstName: '',
    lastName: '',
    email: '',
    photoUrl: undefined,
    id: '',
    createdAt: undefined,
    updatedAt: undefined,
  };
}

export const UserGenericResponse: MessageFns<UserGenericResponse> = {
  encode(message: UserGenericResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.firstName !== '') {
      writer.uint32(10).string(message.firstName);
    }
    if (message.lastName !== '') {
      writer.uint32(18).string(message.lastName);
    }
    if (message.email !== '') {
      writer.uint32(26).string(message.email);
    }
    if (message.photoUrl !== undefined) {
      writer.uint32(34).string(message.photoUrl);
    }
    if (message.id !== '') {
      writer.uint32(42).string(message.id);
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(50).fork()).join();
    }
    if (message.updatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.updatedAt), writer.uint32(58).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): UserGenericResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserGenericResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.firstName = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.lastName = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.email = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.photoUrl = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.id = reader.string();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.createdAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        }
        case 7: {
          if (tag !== 58) {
            break;
          }

          message.updatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
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

  fromJSON(object: any): UserGenericResponse {
    return {
      firstName: isSet(object.firstName) ? globalThis.String(object.firstName) : '',
      lastName: isSet(object.lastName) ? globalThis.String(object.lastName) : '',
      email: isSet(object.email) ? globalThis.String(object.email) : '',
      photoUrl: isSet(object.photoUrl) ? globalThis.String(object.photoUrl) : undefined,
      id: isSet(object.id) ? globalThis.String(object.id) : '',
      createdAt: isSet(object.createdAt) ? fromJsonTimestamp(object.createdAt) : undefined,
      updatedAt: isSet(object.updatedAt) ? fromJsonTimestamp(object.updatedAt) : undefined,
    };
  },

  toJSON(message: UserGenericResponse): unknown {
    const obj: any = {};
    if (message.firstName !== '') {
      obj.firstName = message.firstName;
    }
    if (message.lastName !== '') {
      obj.lastName = message.lastName;
    }
    if (message.email !== '') {
      obj.email = message.email;
    }
    if (message.photoUrl !== undefined) {
      obj.photoUrl = message.photoUrl;
    }
    if (message.id !== '') {
      obj.id = message.id;
    }
    if (message.createdAt !== undefined) {
      obj.createdAt = message.createdAt.toISOString();
    }
    if (message.updatedAt !== undefined) {
      obj.updatedAt = message.updatedAt.toISOString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UserGenericResponse>, I>>(base?: I): UserGenericResponse {
    return UserGenericResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UserGenericResponse>, I>>(object: I): UserGenericResponse {
    const message = createBaseUserGenericResponse();
    message.firstName = object.firstName ?? '';
    message.lastName = object.lastName ?? '';
    message.email = object.email ?? '';
    message.photoUrl = object.photoUrl ?? undefined;
    message.id = object.id ?? '';
    message.createdAt = object.createdAt ?? undefined;
    message.updatedAt = object.updatedAt ?? undefined;
    return message;
  },
};

function createBaseCreateUserRequest(): CreateUserRequest {
  return { firstName: '', lastName: '', email: '', password: '', photoUrl: undefined };
}

export const CreateUserRequest: MessageFns<CreateUserRequest> = {
  encode(message: CreateUserRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.firstName !== '') {
      writer.uint32(10).string(message.firstName);
    }
    if (message.lastName !== '') {
      writer.uint32(18).string(message.lastName);
    }
    if (message.email !== '') {
      writer.uint32(26).string(message.email);
    }
    if (message.password !== '') {
      writer.uint32(34).string(message.password);
    }
    if (message.photoUrl !== undefined) {
      writer.uint32(42).string(message.photoUrl);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): CreateUserRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.firstName = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.lastName = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.email = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.password = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.photoUrl = reader.string();
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

  fromJSON(object: any): CreateUserRequest {
    return {
      firstName: isSet(object.firstName) ? globalThis.String(object.firstName) : '',
      lastName: isSet(object.lastName) ? globalThis.String(object.lastName) : '',
      email: isSet(object.email) ? globalThis.String(object.email) : '',
      password: isSet(object.password) ? globalThis.String(object.password) : '',
      photoUrl: isSet(object.photoUrl) ? globalThis.String(object.photoUrl) : undefined,
    };
  },

  toJSON(message: CreateUserRequest): unknown {
    const obj: any = {};
    if (message.firstName !== '') {
      obj.firstName = message.firstName;
    }
    if (message.lastName !== '') {
      obj.lastName = message.lastName;
    }
    if (message.email !== '') {
      obj.email = message.email;
    }
    if (message.password !== '') {
      obj.password = message.password;
    }
    if (message.photoUrl !== undefined) {
      obj.photoUrl = message.photoUrl;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateUserRequest>, I>>(base?: I): CreateUserRequest {
    return CreateUserRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateUserRequest>, I>>(object: I): CreateUserRequest {
    const message = createBaseCreateUserRequest();
    message.firstName = object.firstName ?? '';
    message.lastName = object.lastName ?? '';
    message.email = object.email ?? '';
    message.password = object.password ?? '';
    message.photoUrl = object.photoUrl ?? undefined;
    return message;
  },
};

function createBaseCreateUserResponse(): CreateUserResponse {
  return { id: '', createdAt: undefined, updatedAt: undefined };
}

export const CreateUserResponse: MessageFns<CreateUserResponse> = {
  encode(message: CreateUserResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== '') {
      writer.uint32(10).string(message.id);
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(18).fork()).join();
    }
    if (message.updatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.updatedAt), writer.uint32(26).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): CreateUserResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateUserResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.createdAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.updatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
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

  fromJSON(object: any): CreateUserResponse {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : '',
      createdAt: isSet(object.createdAt) ? fromJsonTimestamp(object.createdAt) : undefined,
      updatedAt: isSet(object.updatedAt) ? fromJsonTimestamp(object.updatedAt) : undefined,
    };
  },

  toJSON(message: CreateUserResponse): unknown {
    const obj: any = {};
    if (message.id !== '') {
      obj.id = message.id;
    }
    if (message.createdAt !== undefined) {
      obj.createdAt = message.createdAt.toISOString();
    }
    if (message.updatedAt !== undefined) {
      obj.updatedAt = message.updatedAt.toISOString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateUserResponse>, I>>(base?: I): CreateUserResponse {
    return CreateUserResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateUserResponse>, I>>(object: I): CreateUserResponse {
    const message = createBaseCreateUserResponse();
    message.id = object.id ?? '';
    message.createdAt = object.createdAt ?? undefined;
    message.updatedAt = object.updatedAt ?? undefined;
    return message;
  },
};

function createBaseListUsersRequest(): ListUsersRequest {
  return { page: 0, limit: 0 };
}

export const ListUsersRequest: MessageFns<ListUsersRequest> = {
  encode(message: ListUsersRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.page !== 0) {
      writer.uint32(8).int32(message.page);
    }
    if (message.limit !== 0) {
      writer.uint32(16).int32(message.limit);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ListUsersRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListUsersRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.page = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.limit = reader.int32();
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

  fromJSON(object: any): ListUsersRequest {
    return {
      page: isSet(object.page) ? globalThis.Number(object.page) : 0,
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
    };
  },

  toJSON(message: ListUsersRequest): unknown {
    const obj: any = {};
    if (message.page !== 0) {
      obj.page = Math.round(message.page);
    }
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ListUsersRequest>, I>>(base?: I): ListUsersRequest {
    return ListUsersRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ListUsersRequest>, I>>(object: I): ListUsersRequest {
    const message = createBaseListUsersRequest();
    message.page = object.page ?? 0;
    message.limit = object.limit ?? 0;
    return message;
  },
};

function createBaseListUsersResponse(): ListUsersResponse {
  return { users: [], total: 0 };
}

export const ListUsersResponse: MessageFns<ListUsersResponse> = {
  encode(message: ListUsersResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    for (const v of message.users) {
      UserGenericResponse.encode(v!, writer.uint32(10).fork()).join();
    }
    if (message.total !== 0) {
      writer.uint32(16).int32(message.total);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ListUsersResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListUsersResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.users.push(UserGenericResponse.decode(reader, reader.uint32()));
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.total = reader.int32();
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

  fromJSON(object: any): ListUsersResponse {
    return {
      users: globalThis.Array.isArray(object?.users) ? object.users.map((e: any) => UserGenericResponse.fromJSON(e)) : [],
      total: isSet(object.total) ? globalThis.Number(object.total) : 0,
    };
  },

  toJSON(message: ListUsersResponse): unknown {
    const obj: any = {};
    if (message.users?.length) {
      obj.users = message.users.map(e => UserGenericResponse.toJSON(e));
    }
    if (message.total !== 0) {
      obj.total = Math.round(message.total);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ListUsersResponse>, I>>(base?: I): ListUsersResponse {
    return ListUsersResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ListUsersResponse>, I>>(object: I): ListUsersResponse {
    const message = createBaseListUsersResponse();
    message.users = object.users?.map(e => UserGenericResponse.fromPartial(e)) || [];
    message.total = object.total ?? 0;
    return message;
  },
};

function createBaseUpdateUserRequest(): UpdateUserRequest {
  return { id: '', firstName: undefined, lastName: undefined, email: undefined, photoUrl: undefined };
}

export const UpdateUserRequest: MessageFns<UpdateUserRequest> = {
  encode(message: UpdateUserRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== '') {
      writer.uint32(10).string(message.id);
    }
    if (message.firstName !== undefined) {
      writer.uint32(18).string(message.firstName);
    }
    if (message.lastName !== undefined) {
      writer.uint32(26).string(message.lastName);
    }
    if (message.email !== undefined) {
      writer.uint32(34).string(message.email);
    }
    if (message.photoUrl !== undefined) {
      writer.uint32(42).string(message.photoUrl);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): UpdateUserRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.firstName = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.lastName = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.email = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.photoUrl = reader.string();
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

  fromJSON(object: any): UpdateUserRequest {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : '',
      firstName: isSet(object.firstName) ? globalThis.String(object.firstName) : undefined,
      lastName: isSet(object.lastName) ? globalThis.String(object.lastName) : undefined,
      email: isSet(object.email) ? globalThis.String(object.email) : undefined,
      photoUrl: isSet(object.photoUrl) ? globalThis.String(object.photoUrl) : undefined,
    };
  },

  toJSON(message: UpdateUserRequest): unknown {
    const obj: any = {};
    if (message.id !== '') {
      obj.id = message.id;
    }
    if (message.firstName !== undefined) {
      obj.firstName = message.firstName;
    }
    if (message.lastName !== undefined) {
      obj.lastName = message.lastName;
    }
    if (message.email !== undefined) {
      obj.email = message.email;
    }
    if (message.photoUrl !== undefined) {
      obj.photoUrl = message.photoUrl;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateUserRequest>, I>>(base?: I): UpdateUserRequest {
    return UpdateUserRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpdateUserRequest>, I>>(object: I): UpdateUserRequest {
    const message = createBaseUpdateUserRequest();
    message.id = object.id ?? '';
    message.firstName = object.firstName ?? undefined;
    message.lastName = object.lastName ?? undefined;
    message.email = object.email ?? undefined;
    message.photoUrl = object.photoUrl ?? undefined;
    return message;
  },
};

export type ServiceUserService = typeof ServiceUserService;
export const ServiceUserService = {
  getUser: {
    path: '/user.v1.ServiceUser/GetUser',
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UserIdMessage) => Buffer.from(UserIdMessage.encode(value).finish()),
    requestDeserialize: (value: Buffer) => UserIdMessage.decode(value),
    responseSerialize: (value: UserGenericResponse) => Buffer.from(UserGenericResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => UserGenericResponse.decode(value),
  },
  createUser: {
    path: '/user.v1.ServiceUser/CreateUser',
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateUserRequest) => Buffer.from(CreateUserRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CreateUserRequest.decode(value),
    responseSerialize: (value: CreateUserResponse) => Buffer.from(CreateUserResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => CreateUserResponse.decode(value),
  },
  listUsers: {
    path: '/user.v1.ServiceUser/ListUsers',
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ListUsersRequest) => Buffer.from(ListUsersRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ListUsersRequest.decode(value),
    responseSerialize: (value: ListUsersResponse) => Buffer.from(ListUsersResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ListUsersResponse.decode(value),
  },
  updateUser: {
    path: '/user.v1.ServiceUser/UpdateUser',
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateUserRequest) => Buffer.from(UpdateUserRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => UpdateUserRequest.decode(value),
    responseSerialize: (value: UserGenericResponse) => Buffer.from(UserGenericResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => UserGenericResponse.decode(value),
  },
  deleteUser: {
    path: '/user.v1.ServiceUser/DeleteUser',
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UserIdMessage) => Buffer.from(UserIdMessage.encode(value).finish()),
    requestDeserialize: (value: Buffer) => UserIdMessage.decode(value),
    responseSerialize: (value: UserIdMessage) => Buffer.from(UserIdMessage.encode(value).finish()),
    responseDeserialize: (value: Buffer) => UserIdMessage.decode(value),
  },
} as const;

export interface ServiceUserServer extends UntypedServiceImplementation {
  getUser: handleUnaryCall<UserIdMessage, UserGenericResponse>;
  createUser: handleUnaryCall<CreateUserRequest, CreateUserResponse>;
  listUsers: handleUnaryCall<ListUsersRequest, ListUsersResponse>;
  updateUser: handleUnaryCall<UpdateUserRequest, UserGenericResponse>;
  deleteUser: handleUnaryCall<UserIdMessage, UserIdMessage>;
}

export interface ServiceUserClient extends Client {
  getUser(request: UserIdMessage, callback: (error: ServiceError | null, response: UserGenericResponse) => void): ClientUnaryCall;
  getUser(request: UserIdMessage, metadata: Metadata, callback: (error: ServiceError | null, response: UserGenericResponse) => void): ClientUnaryCall;
  getUser(
    request: UserIdMessage,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: UserGenericResponse) => void
  ): ClientUnaryCall;
  createUser(request: CreateUserRequest, callback: (error: ServiceError | null, response: CreateUserResponse) => void): ClientUnaryCall;
  createUser(request: CreateUserRequest, metadata: Metadata, callback: (error: ServiceError | null, response: CreateUserResponse) => void): ClientUnaryCall;
  createUser(
    request: CreateUserRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: CreateUserResponse) => void
  ): ClientUnaryCall;
  listUsers(request: ListUsersRequest, callback: (error: ServiceError | null, response: ListUsersResponse) => void): ClientUnaryCall;
  listUsers(request: ListUsersRequest, metadata: Metadata, callback: (error: ServiceError | null, response: ListUsersResponse) => void): ClientUnaryCall;
  listUsers(
    request: ListUsersRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: ListUsersResponse) => void
  ): ClientUnaryCall;
  updateUser(request: UpdateUserRequest, callback: (error: ServiceError | null, response: UserGenericResponse) => void): ClientUnaryCall;
  updateUser(request: UpdateUserRequest, metadata: Metadata, callback: (error: ServiceError | null, response: UserGenericResponse) => void): ClientUnaryCall;
  updateUser(
    request: UpdateUserRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: UserGenericResponse) => void
  ): ClientUnaryCall;
  deleteUser(request: UserIdMessage, callback: (error: ServiceError | null, response: UserIdMessage) => void): ClientUnaryCall;
  deleteUser(request: UserIdMessage, metadata: Metadata, callback: (error: ServiceError | null, response: UserIdMessage) => void): ClientUnaryCall;
  deleteUser(
    request: UserIdMessage,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: UserIdMessage) => void
  ): ClientUnaryCall;
}

export const ServiceUserClient = makeGenericClientConstructor(ServiceUserService, 'user.v1.ServiceUser') as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): ServiceUserClient;
  service: typeof ServiceUserService;
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

function toTimestamp(date: Date): Timestamp {
  const seconds = Math.trunc(date.getTime() / 1_000);
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new globalThis.Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof globalThis.Date) {
    return o;
  } else if (typeof o === 'string') {
    return new globalThis.Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

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
