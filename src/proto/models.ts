/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Timestamp } from "./google/protobuf/timestamp";

export const protobufPackage = "";

export enum ParticipantStatus {
  Active = 0,
  Banned = 1,
  UNRECOGNIZED = -1,
}

export function participantStatusFromJSON(object: any): ParticipantStatus {
  switch (object) {
    case 0:
    case "Active":
      return ParticipantStatus.Active;
    case 1:
    case "Banned":
      return ParticipantStatus.Banned;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ParticipantStatus.UNRECOGNIZED;
  }
}

export function participantStatusToJSON(object: ParticipantStatus): string {
  switch (object) {
    case ParticipantStatus.Active:
      return "Active";
    case ParticipantStatus.Banned:
      return "Banned";
    case ParticipantStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum MessageType {
  ParticipantCreated = 0,
  System = 1,
  UNRECOGNIZED = -1,
}

export function messageTypeFromJSON(object: any): MessageType {
  switch (object) {
    case 0:
    case "ParticipantCreated":
      return MessageType.ParticipantCreated;
    case 1:
    case "System":
      return MessageType.System;
    case -1:
    case "UNRECOGNIZED":
    default:
      return MessageType.UNRECOGNIZED;
  }
}

export function messageTypeToJSON(object: MessageType): string {
  switch (object) {
    case MessageType.ParticipantCreated:
      return "ParticipantCreated";
    case MessageType.System:
      return "System";
    case MessageType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum MessageSubType {
  ParticipantJoined = 0,
  ChatCreated = 1,
  TextMessage = 2,
  UNRECOGNIZED = -1,
}

export function messageSubTypeFromJSON(object: any): MessageSubType {
  switch (object) {
    case 0:
    case "ParticipantJoined":
      return MessageSubType.ParticipantJoined;
    case 1:
    case "ChatCreated":
      return MessageSubType.ChatCreated;
    case 2:
    case "TextMessage":
      return MessageSubType.TextMessage;
    case -1:
    case "UNRECOGNIZED":
    default:
      return MessageSubType.UNRECOGNIZED;
  }
}

export function messageSubTypeToJSON(object: MessageSubType): string {
  switch (object) {
    case MessageSubType.ParticipantJoined:
      return "ParticipantJoined";
    case MessageSubType.ChatCreated:
      return "ChatCreated";
    case MessageSubType.TextMessage:
      return "TextMessage";
    case MessageSubType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum WSRoomTypes {
  Channel = 0,
  Participant = 1,
  UNRECOGNIZED = -1,
}

export function wSRoomTypesFromJSON(object: any): WSRoomTypes {
  switch (object) {
    case 0:
    case "Channel":
      return WSRoomTypes.Channel;
    case 1:
    case "Participant":
      return WSRoomTypes.Participant;
    case -1:
    case "UNRECOGNIZED":
    default:
      return WSRoomTypes.UNRECOGNIZED;
  }
}

export function wSRoomTypesToJSON(object: WSRoomTypes): string {
  switch (object) {
    case WSRoomTypes.Channel:
      return "Channel";
    case WSRoomTypes.Participant:
      return "Participant";
    case WSRoomTypes.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface ParticipantShortInfo {
  identifier: string;
  lastSeenAt?: Date;
  isOnline: boolean;
  customData?: CustomData | undefined;
}

export interface ChannelParticipantGrants {
  sendMessage?: boolean | undefined;
  readMessages?: boolean | undefined;
  admin?: boolean | undefined;
}

export interface Message {
  id: string;
  sender?: ParticipantShortInfo | undefined;
  text: string;
  type: MessageType;
  subType: MessageSubType;
  localId: string;
  customData?: CustomData | undefined;
  createdAt?: Date;
}

export interface CustomEvent {
  roomType: WSRoomTypes;
  roomIdentifier: string;
  eventName: string;
  customData?: CustomData | undefined;
}

export interface CustomData {
  data: { [key: string]: string };
}

export interface CustomData_DataEntry {
  key: string;
  value: string;
}

export interface ShortChannel {
  id: string;
  identifier: string;
  customData?: CustomData | undefined;
}

function createBaseParticipantShortInfo(): ParticipantShortInfo {
  return { identifier: "", lastSeenAt: undefined, isOnline: false, customData: undefined };
}

export const ParticipantShortInfo = {
  encode(message: ParticipantShortInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identifier !== "") {
      writer.uint32(10).string(message.identifier);
    }
    if (message.lastSeenAt !== undefined) {
      Timestamp.encode(toTimestamp(message.lastSeenAt), writer.uint32(18).fork()).ldelim();
    }
    if (message.isOnline === true) {
      writer.uint32(24).bool(message.isOnline);
    }
    if (message.customData !== undefined) {
      CustomData.encode(message.customData, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ParticipantShortInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParticipantShortInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifier = reader.string();
          break;
        case 2:
          message.lastSeenAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 3:
          message.isOnline = reader.bool();
          break;
        case 4:
          message.customData = CustomData.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ParticipantShortInfo {
    return {
      identifier: isSet(object.identifier) ? String(object.identifier) : "",
      lastSeenAt: isSet(object.lastSeenAt) ? fromJsonTimestamp(object.lastSeenAt) : undefined,
      isOnline: isSet(object.isOnline) ? Boolean(object.isOnline) : false,
      customData: isSet(object.customData) ? CustomData.fromJSON(object.customData) : undefined,
    };
  },

  toJSON(message: ParticipantShortInfo): unknown {
    const obj: any = {};
    message.identifier !== undefined && (obj.identifier = message.identifier);
    message.lastSeenAt !== undefined && (obj.lastSeenAt = message.lastSeenAt.toISOString());
    message.isOnline !== undefined && (obj.isOnline = message.isOnline);
    message.customData !== undefined &&
      (obj.customData = message.customData ? CustomData.toJSON(message.customData) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<ParticipantShortInfo>, I>>(base?: I): ParticipantShortInfo {
    return ParticipantShortInfo.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ParticipantShortInfo>, I>>(object: I): ParticipantShortInfo {
    const message = createBaseParticipantShortInfo();
    message.identifier = object.identifier ?? "";
    message.lastSeenAt = object.lastSeenAt ?? undefined;
    message.isOnline = object.isOnline ?? false;
    message.customData = (object.customData !== undefined && object.customData !== null)
      ? CustomData.fromPartial(object.customData)
      : undefined;
    return message;
  },
};

function createBaseChannelParticipantGrants(): ChannelParticipantGrants {
  return { sendMessage: undefined, readMessages: undefined, admin: undefined };
}

export const ChannelParticipantGrants = {
  encode(message: ChannelParticipantGrants, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sendMessage !== undefined) {
      writer.uint32(8).bool(message.sendMessage);
    }
    if (message.readMessages !== undefined) {
      writer.uint32(16).bool(message.readMessages);
    }
    if (message.admin !== undefined) {
      writer.uint32(24).bool(message.admin);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChannelParticipantGrants {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChannelParticipantGrants();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sendMessage = reader.bool();
          break;
        case 2:
          message.readMessages = reader.bool();
          break;
        case 3:
          message.admin = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ChannelParticipantGrants {
    return {
      sendMessage: isSet(object.sendMessage) ? Boolean(object.sendMessage) : undefined,
      readMessages: isSet(object.readMessages) ? Boolean(object.readMessages) : undefined,
      admin: isSet(object.admin) ? Boolean(object.admin) : undefined,
    };
  },

  toJSON(message: ChannelParticipantGrants): unknown {
    const obj: any = {};
    message.sendMessage !== undefined && (obj.sendMessage = message.sendMessage);
    message.readMessages !== undefined && (obj.readMessages = message.readMessages);
    message.admin !== undefined && (obj.admin = message.admin);
    return obj;
  },

  create<I extends Exact<DeepPartial<ChannelParticipantGrants>, I>>(base?: I): ChannelParticipantGrants {
    return ChannelParticipantGrants.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ChannelParticipantGrants>, I>>(object: I): ChannelParticipantGrants {
    const message = createBaseChannelParticipantGrants();
    message.sendMessage = object.sendMessage ?? undefined;
    message.readMessages = object.readMessages ?? undefined;
    message.admin = object.admin ?? undefined;
    return message;
  },
};

function createBaseMessage(): Message {
  return {
    id: "",
    sender: undefined,
    text: "",
    type: 0,
    subType: 0,
    localId: "",
    customData: undefined,
    createdAt: undefined,
  };
}

export const Message = {
  encode(message: Message, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.sender !== undefined) {
      ParticipantShortInfo.encode(message.sender, writer.uint32(18).fork()).ldelim();
    }
    if (message.text !== "") {
      writer.uint32(26).string(message.text);
    }
    if (message.type !== 0) {
      writer.uint32(32).int32(message.type);
    }
    if (message.subType !== 0) {
      writer.uint32(40).int32(message.subType);
    }
    if (message.localId !== "") {
      writer.uint32(50).string(message.localId);
    }
    if (message.customData !== undefined) {
      CustomData.encode(message.customData, writer.uint32(58).fork()).ldelim();
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(66).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Message {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.sender = ParticipantShortInfo.decode(reader, reader.uint32());
          break;
        case 3:
          message.text = reader.string();
          break;
        case 4:
          message.type = reader.int32() as any;
          break;
        case 5:
          message.subType = reader.int32() as any;
          break;
        case 6:
          message.localId = reader.string();
          break;
        case 7:
          message.customData = CustomData.decode(reader, reader.uint32());
          break;
        case 8:
          message.createdAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Message {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      sender: isSet(object.sender) ? ParticipantShortInfo.fromJSON(object.sender) : undefined,
      text: isSet(object.text) ? String(object.text) : "",
      type: isSet(object.type) ? messageTypeFromJSON(object.type) : 0,
      subType: isSet(object.subType) ? messageSubTypeFromJSON(object.subType) : 0,
      localId: isSet(object.localId) ? String(object.localId) : "",
      customData: isSet(object.customData) ? CustomData.fromJSON(object.customData) : undefined,
      createdAt: isSet(object.createdAt) ? fromJsonTimestamp(object.createdAt) : undefined,
    };
  },

  toJSON(message: Message): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.sender !== undefined &&
      (obj.sender = message.sender ? ParticipantShortInfo.toJSON(message.sender) : undefined);
    message.text !== undefined && (obj.text = message.text);
    message.type !== undefined && (obj.type = messageTypeToJSON(message.type));
    message.subType !== undefined && (obj.subType = messageSubTypeToJSON(message.subType));
    message.localId !== undefined && (obj.localId = message.localId);
    message.customData !== undefined &&
      (obj.customData = message.customData ? CustomData.toJSON(message.customData) : undefined);
    message.createdAt !== undefined && (obj.createdAt = message.createdAt.toISOString());
    return obj;
  },

  create<I extends Exact<DeepPartial<Message>, I>>(base?: I): Message {
    return Message.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Message>, I>>(object: I): Message {
    const message = createBaseMessage();
    message.id = object.id ?? "";
    message.sender = (object.sender !== undefined && object.sender !== null)
      ? ParticipantShortInfo.fromPartial(object.sender)
      : undefined;
    message.text = object.text ?? "";
    message.type = object.type ?? 0;
    message.subType = object.subType ?? 0;
    message.localId = object.localId ?? "";
    message.customData = (object.customData !== undefined && object.customData !== null)
      ? CustomData.fromPartial(object.customData)
      : undefined;
    message.createdAt = object.createdAt ?? undefined;
    return message;
  },
};

function createBaseCustomEvent(): CustomEvent {
  return { roomType: 0, roomIdentifier: "", eventName: "", customData: undefined };
}

export const CustomEvent = {
  encode(message: CustomEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.roomType !== 0) {
      writer.uint32(8).int32(message.roomType);
    }
    if (message.roomIdentifier !== "") {
      writer.uint32(18).string(message.roomIdentifier);
    }
    if (message.eventName !== "") {
      writer.uint32(26).string(message.eventName);
    }
    if (message.customData !== undefined) {
      CustomData.encode(message.customData, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CustomEvent {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCustomEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roomType = reader.int32() as any;
          break;
        case 2:
          message.roomIdentifier = reader.string();
          break;
        case 3:
          message.eventName = reader.string();
          break;
        case 4:
          message.customData = CustomData.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CustomEvent {
    return {
      roomType: isSet(object.roomType) ? wSRoomTypesFromJSON(object.roomType) : 0,
      roomIdentifier: isSet(object.roomIdentifier) ? String(object.roomIdentifier) : "",
      eventName: isSet(object.eventName) ? String(object.eventName) : "",
      customData: isSet(object.customData) ? CustomData.fromJSON(object.customData) : undefined,
    };
  },

  toJSON(message: CustomEvent): unknown {
    const obj: any = {};
    message.roomType !== undefined && (obj.roomType = wSRoomTypesToJSON(message.roomType));
    message.roomIdentifier !== undefined && (obj.roomIdentifier = message.roomIdentifier);
    message.eventName !== undefined && (obj.eventName = message.eventName);
    message.customData !== undefined &&
      (obj.customData = message.customData ? CustomData.toJSON(message.customData) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<CustomEvent>, I>>(base?: I): CustomEvent {
    return CustomEvent.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CustomEvent>, I>>(object: I): CustomEvent {
    const message = createBaseCustomEvent();
    message.roomType = object.roomType ?? 0;
    message.roomIdentifier = object.roomIdentifier ?? "";
    message.eventName = object.eventName ?? "";
    message.customData = (object.customData !== undefined && object.customData !== null)
      ? CustomData.fromPartial(object.customData)
      : undefined;
    return message;
  },
};

function createBaseCustomData(): CustomData {
  return { data: {} };
}

export const CustomData = {
  encode(message: CustomData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    Object.entries(message.data).forEach(([key, value]) => {
      CustomData_DataEntry.encode({ key: key as any, value }, writer.uint32(10).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CustomData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCustomData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          const entry1 = CustomData_DataEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.data[entry1.key] = entry1.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CustomData {
    return {
      data: isObject(object.data)
        ? Object.entries(object.data).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: CustomData): unknown {
    const obj: any = {};
    obj.data = {};
    if (message.data) {
      Object.entries(message.data).forEach(([k, v]) => {
        obj.data[k] = v;
      });
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CustomData>, I>>(base?: I): CustomData {
    return CustomData.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CustomData>, I>>(object: I): CustomData {
    const message = createBaseCustomData();
    message.data = Object.entries(object.data ?? {}).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseCustomData_DataEntry(): CustomData_DataEntry {
  return { key: "", value: "" };
}

export const CustomData_DataEntry = {
  encode(message: CustomData_DataEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CustomData_DataEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCustomData_DataEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CustomData_DataEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: CustomData_DataEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  create<I extends Exact<DeepPartial<CustomData_DataEntry>, I>>(base?: I): CustomData_DataEntry {
    return CustomData_DataEntry.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CustomData_DataEntry>, I>>(object: I): CustomData_DataEntry {
    const message = createBaseCustomData_DataEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseShortChannel(): ShortChannel {
  return { id: "", identifier: "", customData: undefined };
}

export const ShortChannel = {
  encode(message: ShortChannel, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.identifier !== "") {
      writer.uint32(18).string(message.identifier);
    }
    if (message.customData !== undefined) {
      CustomData.encode(message.customData, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ShortChannel {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseShortChannel();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.identifier = reader.string();
          break;
        case 4:
          message.customData = CustomData.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ShortChannel {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      identifier: isSet(object.identifier) ? String(object.identifier) : "",
      customData: isSet(object.customData) ? CustomData.fromJSON(object.customData) : undefined,
    };
  },

  toJSON(message: ShortChannel): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.identifier !== undefined && (obj.identifier = message.identifier);
    message.customData !== undefined &&
      (obj.customData = message.customData ? CustomData.toJSON(message.customData) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<ShortChannel>, I>>(base?: I): ShortChannel {
    return ShortChannel.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ShortChannel>, I>>(object: I): ShortChannel {
    const message = createBaseShortChannel();
    message.id = object.id ?? "";
    message.identifier = object.identifier ?? "";
    message.customData = (object.customData !== undefined && object.customData !== null)
      ? CustomData.fromPartial(object.customData)
      : undefined;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends { $case: string } ? { [K in keyof Omit<T, "$case">]?: DeepPartial<T[K]> } & { $case: T["$case"] }
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
