/* eslint-disable */
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
  publishMeBecameOnline: boolean;
}

export interface MeJoinedToChannel {
  meIdentifier: string;
  channelId: string;
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
  return { publishMeBecameOnline: false };
}

export const JoinChannel = {
  encode(message: JoinChannel, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.publishMeBecameOnline === true) {
      writer.uint32(8).bool(message.publishMeBecameOnline);
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
          message.publishMeBecameOnline = reader.bool();
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
      publishMeBecameOnline: isSet(object.publishMeBecameOnline) ? Boolean(object.publishMeBecameOnline) : false,
    };
  },

  toJSON(message: JoinChannel): unknown {
    const obj: any = {};
    message.publishMeBecameOnline !== undefined && (obj.publishMeBecameOnline = message.publishMeBecameOnline);
    return obj;
  },

  create<I extends Exact<DeepPartial<JoinChannel>, I>>(base?: I): JoinChannel {
    return JoinChannel.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<JoinChannel>, I>>(object: I): JoinChannel {
    const message = createBaseJoinChannel();
    message.publishMeBecameOnline = object.publishMeBecameOnline ?? false;
    return message;
  },
};

function createBaseMeJoinedToChannel(): MeJoinedToChannel {
  return { meIdentifier: "", channelId: "" };
}

export const MeJoinedToChannel = {
  encode(message: MeJoinedToChannel, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.meIdentifier !== "") {
      writer.uint32(10).string(message.meIdentifier);
    }
    if (message.channelId !== "") {
      writer.uint32(18).string(message.channelId);
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
          message.channelId = reader.string();
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
      channelId: isSet(object.channelId) ? String(object.channelId) : "",
    };
  },

  toJSON(message: MeJoinedToChannel): unknown {
    const obj: any = {};
    message.meIdentifier !== undefined && (obj.meIdentifier = message.meIdentifier);
    message.channelId !== undefined && (obj.channelId = message.channelId);
    return obj;
  },

  create<I extends Exact<DeepPartial<MeJoinedToChannel>, I>>(base?: I): MeJoinedToChannel {
    return MeJoinedToChannel.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MeJoinedToChannel>, I>>(object: I): MeJoinedToChannel {
    const message = createBaseMeJoinedToChannel();
    message.meIdentifier = object.meIdentifier ?? "";
    message.channelId = object.channelId ?? "";
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
