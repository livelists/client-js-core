/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { CustomData, Message } from "./models";

export const protobufPackage = "";

export interface OutBoundMessage {
  message?: { $case: "sendMessage"; sendMessage: SendMessage } | { $case: "joinChannel"; joinChannel: JoinChannel };
}

export interface InBoundMessage {
  message?: { $case: "newMessage"; newMessage: Message } | {
    $case: "meJoinedToChannel";
    meJoinedToChannel: MeJoinedToChannel;
  };
}

export interface SendMessage {
  text: string;
  localId: string;
  customData?: CustomData | undefined;
}

export interface JoinChannel {
  initialPageSize: number;
  initialOffset: number;
}

export interface ChannelInitialInfo {
  channelId: string;
  historyMessages: Message[];
}

export interface MeJoinedToChannel {
  meIdentifier: string;
  isSuccess: boolean;
  channel?: ChannelInitialInfo;
}

function createBaseOutBoundMessage(): OutBoundMessage {
  return { message: undefined };
}

export const OutBoundMessage = {
  encode(message: OutBoundMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    switch (message.message?.$case) {
      case "sendMessage":
        SendMessage.encode(message.message.sendMessage, writer.uint32(10).fork()).ldelim();
        break;
      case "joinChannel":
        JoinChannel.encode(message.message.joinChannel, writer.uint32(18).fork()).ldelim();
        break;
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OutBoundMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOutBoundMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.message = { $case: "sendMessage", sendMessage: SendMessage.decode(reader, reader.uint32()) };
          break;
        case 2:
          message.message = { $case: "joinChannel", joinChannel: JoinChannel.decode(reader, reader.uint32()) };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OutBoundMessage {
    return {
      message: isSet(object.sendMessage)
        ? { $case: "sendMessage", sendMessage: SendMessage.fromJSON(object.sendMessage) }
        : isSet(object.joinChannel)
        ? { $case: "joinChannel", joinChannel: JoinChannel.fromJSON(object.joinChannel) }
        : undefined,
    };
  },

  toJSON(message: OutBoundMessage): unknown {
    const obj: any = {};
    message.message?.$case === "sendMessage" &&
      (obj.sendMessage = message.message?.sendMessage ? SendMessage.toJSON(message.message?.sendMessage) : undefined);
    message.message?.$case === "joinChannel" &&
      (obj.joinChannel = message.message?.joinChannel ? JoinChannel.toJSON(message.message?.joinChannel) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<OutBoundMessage>, I>>(base?: I): OutBoundMessage {
    return OutBoundMessage.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<OutBoundMessage>, I>>(object: I): OutBoundMessage {
    const message = createBaseOutBoundMessage();
    if (
      object.message?.$case === "sendMessage" &&
      object.message?.sendMessage !== undefined &&
      object.message?.sendMessage !== null
    ) {
      message.message = { $case: "sendMessage", sendMessage: SendMessage.fromPartial(object.message.sendMessage) };
    }
    if (
      object.message?.$case === "joinChannel" &&
      object.message?.joinChannel !== undefined &&
      object.message?.joinChannel !== null
    ) {
      message.message = { $case: "joinChannel", joinChannel: JoinChannel.fromPartial(object.message.joinChannel) };
    }
    return message;
  },
};

function createBaseInBoundMessage(): InBoundMessage {
  return { message: undefined };
}

export const InBoundMessage = {
  encode(message: InBoundMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    switch (message.message?.$case) {
      case "newMessage":
        Message.encode(message.message.newMessage, writer.uint32(10).fork()).ldelim();
        break;
      case "meJoinedToChannel":
        MeJoinedToChannel.encode(message.message.meJoinedToChannel, writer.uint32(18).fork()).ldelim();
        break;
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): InBoundMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInBoundMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.message = { $case: "newMessage", newMessage: Message.decode(reader, reader.uint32()) };
          break;
        case 2:
          message.message = {
            $case: "meJoinedToChannel",
            meJoinedToChannel: MeJoinedToChannel.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): InBoundMessage {
    return {
      message: isSet(object.newMessage)
        ? { $case: "newMessage", newMessage: Message.fromJSON(object.newMessage) }
        : isSet(object.meJoinedToChannel)
        ? { $case: "meJoinedToChannel", meJoinedToChannel: MeJoinedToChannel.fromJSON(object.meJoinedToChannel) }
        : undefined,
    };
  },

  toJSON(message: InBoundMessage): unknown {
    const obj: any = {};
    message.message?.$case === "newMessage" &&
      (obj.newMessage = message.message?.newMessage ? Message.toJSON(message.message?.newMessage) : undefined);
    message.message?.$case === "meJoinedToChannel" && (obj.meJoinedToChannel = message.message?.meJoinedToChannel
      ? MeJoinedToChannel.toJSON(message.message?.meJoinedToChannel)
      : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<InBoundMessage>, I>>(base?: I): InBoundMessage {
    return InBoundMessage.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<InBoundMessage>, I>>(object: I): InBoundMessage {
    const message = createBaseInBoundMessage();
    if (
      object.message?.$case === "newMessage" &&
      object.message?.newMessage !== undefined &&
      object.message?.newMessage !== null
    ) {
      message.message = { $case: "newMessage", newMessage: Message.fromPartial(object.message.newMessage) };
    }
    if (
      object.message?.$case === "meJoinedToChannel" &&
      object.message?.meJoinedToChannel !== undefined &&
      object.message?.meJoinedToChannel !== null
    ) {
      message.message = {
        $case: "meJoinedToChannel",
        meJoinedToChannel: MeJoinedToChannel.fromPartial(object.message.meJoinedToChannel),
      };
    }
    return message;
  },
};

function createBaseSendMessage(): SendMessage {
  return { text: "", localId: "", customData: undefined };
}

export const SendMessage = {
  encode(message: SendMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.text !== "") {
      writer.uint32(10).string(message.text);
    }
    if (message.localId !== "") {
      writer.uint32(18).string(message.localId);
    }
    if (message.customData !== undefined) {
      CustomData.encode(message.customData, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SendMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSendMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.text = reader.string();
          break;
        case 2:
          message.localId = reader.string();
          break;
        case 3:
          message.customData = CustomData.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SendMessage {
    return {
      text: isSet(object.text) ? String(object.text) : "",
      localId: isSet(object.localId) ? String(object.localId) : "",
      customData: isSet(object.customData) ? CustomData.fromJSON(object.customData) : undefined,
    };
  },

  toJSON(message: SendMessage): unknown {
    const obj: any = {};
    message.text !== undefined && (obj.text = message.text);
    message.localId !== undefined && (obj.localId = message.localId);
    message.customData !== undefined &&
      (obj.customData = message.customData ? CustomData.toJSON(message.customData) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<SendMessage>, I>>(base?: I): SendMessage {
    return SendMessage.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SendMessage>, I>>(object: I): SendMessage {
    const message = createBaseSendMessage();
    message.text = object.text ?? "";
    message.localId = object.localId ?? "";
    message.customData = (object.customData !== undefined && object.customData !== null)
      ? CustomData.fromPartial(object.customData)
      : undefined;
    return message;
  },
};

function createBaseJoinChannel(): JoinChannel {
  return { initialPageSize: 0, initialOffset: 0 };
}

export const JoinChannel = {
  encode(message: JoinChannel, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.initialPageSize !== 0) {
      writer.uint32(8).int64(message.initialPageSize);
    }
    if (message.initialOffset !== 0) {
      writer.uint32(16).int64(message.initialOffset);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): JoinChannel {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseJoinChannel();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.initialPageSize = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.initialOffset = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): JoinChannel {
    return {
      initialPageSize: isSet(object.initialPageSize) ? Number(object.initialPageSize) : 0,
      initialOffset: isSet(object.initialOffset) ? Number(object.initialOffset) : 0,
    };
  },

  toJSON(message: JoinChannel): unknown {
    const obj: any = {};
    message.initialPageSize !== undefined && (obj.initialPageSize = Math.round(message.initialPageSize));
    message.initialOffset !== undefined && (obj.initialOffset = Math.round(message.initialOffset));
    return obj;
  },

  create<I extends Exact<DeepPartial<JoinChannel>, I>>(base?: I): JoinChannel {
    return JoinChannel.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<JoinChannel>, I>>(object: I): JoinChannel {
    const message = createBaseJoinChannel();
    message.initialPageSize = object.initialPageSize ?? 0;
    message.initialOffset = object.initialOffset ?? 0;
    return message;
  },
};

function createBaseChannelInitialInfo(): ChannelInitialInfo {
  return { channelId: "", historyMessages: [] };
}

export const ChannelInitialInfo = {
  encode(message: ChannelInitialInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.channelId !== "") {
      writer.uint32(10).string(message.channelId);
    }
    for (const v of message.historyMessages) {
      Message.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChannelInitialInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChannelInitialInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.channelId = reader.string();
          break;
        case 2:
          message.historyMessages.push(Message.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ChannelInitialInfo {
    return {
      channelId: isSet(object.channelId) ? String(object.channelId) : "",
      historyMessages: Array.isArray(object?.historyMessages)
        ? object.historyMessages.map((e: any) => Message.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ChannelInitialInfo): unknown {
    const obj: any = {};
    message.channelId !== undefined && (obj.channelId = message.channelId);
    if (message.historyMessages) {
      obj.historyMessages = message.historyMessages.map((e) => e ? Message.toJSON(e) : undefined);
    } else {
      obj.historyMessages = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChannelInitialInfo>, I>>(base?: I): ChannelInitialInfo {
    return ChannelInitialInfo.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ChannelInitialInfo>, I>>(object: I): ChannelInitialInfo {
    const message = createBaseChannelInitialInfo();
    message.channelId = object.channelId ?? "";
    message.historyMessages = object.historyMessages?.map((e) => Message.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMeJoinedToChannel(): MeJoinedToChannel {
  return { meIdentifier: "", isSuccess: false, channel: undefined };
}

export const MeJoinedToChannel = {
  encode(message: MeJoinedToChannel, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.meIdentifier !== "") {
      writer.uint32(10).string(message.meIdentifier);
    }
    if (message.isSuccess === true) {
      writer.uint32(16).bool(message.isSuccess);
    }
    if (message.channel !== undefined) {
      ChannelInitialInfo.encode(message.channel, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MeJoinedToChannel {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMeJoinedToChannel();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.meIdentifier = reader.string();
          break;
        case 2:
          message.isSuccess = reader.bool();
          break;
        case 3:
          message.channel = ChannelInitialInfo.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MeJoinedToChannel {
    return {
      meIdentifier: isSet(object.meIdentifier) ? String(object.meIdentifier) : "",
      isSuccess: isSet(object.isSuccess) ? Boolean(object.isSuccess) : false,
      channel: isSet(object.channel) ? ChannelInitialInfo.fromJSON(object.channel) : undefined,
    };
  },

  toJSON(message: MeJoinedToChannel): unknown {
    const obj: any = {};
    message.meIdentifier !== undefined && (obj.meIdentifier = message.meIdentifier);
    message.isSuccess !== undefined && (obj.isSuccess = message.isSuccess);
    message.channel !== undefined &&
      (obj.channel = message.channel ? ChannelInitialInfo.toJSON(message.channel) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<MeJoinedToChannel>, I>>(base?: I): MeJoinedToChannel {
    return MeJoinedToChannel.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MeJoinedToChannel>, I>>(object: I): MeJoinedToChannel {
    const message = createBaseMeJoinedToChannel();
    message.meIdentifier = object.meIdentifier ?? "";
    message.isSuccess = object.isSuccess ?? false;
    message.channel = (object.channel !== undefined && object.channel !== null)
      ? ChannelInitialInfo.fromPartial(object.channel)
      : undefined;
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends { $case: string } ? { [K in keyof Omit<T, "$case">]?: DeepPartial<T[K]> } & { $case: T["$case"] }
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
