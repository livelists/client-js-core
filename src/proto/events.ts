/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Timestamp } from "./google/protobuf/timestamp";
import {
  ChannelParticipantGrants,
  CustomData,
  CustomEvent,
  Message,
  ParticipantShortInfo,
  ShortChannel,
} from "./models";

export const protobufPackage = "";

export interface OutBoundMessage {
  message?:
    | { $case: "sendMessage"; sendMessage: SendMessage }
    | { $case: "joinChannel"; joinChannel: JoinChannel }
    | { $case: "loadMoreMessages"; loadMoreMessages: LoadMoreMessages }
    | { $case: "loadParticipantsReq"; loadParticipantsReq: LoadParticipantsReq }
    | { $case: "sendCustomEvent"; sendCustomEvent: CustomEvent }
    | { $case: "loadChannelsWithMsgReq"; loadChannelsWithMsgReq: LoadChannelsWithMsgReq }
    | { $case: "updateLastSeenMessageAtReq"; updateLastSeenMessageAtReq: UpdateLastSeenMessageAtReq };
}

export interface InBoundMessage {
  message?:
    | { $case: "newMessage"; newMessage: Message }
    | { $case: "meJoinedToChannel"; meJoinedToChannel: MeJoinedToChannel }
    | { $case: "loadMoreMessagesRes"; loadMoreMessagesRes: LoadMoreMessagesRes }
    | { $case: "participantBecameOnline"; participantBecameOnline: ParticipantBecameOnline }
    | { $case: "participantBecameOffline"; participantBecameOffline: ParticipantBecameOffline }
    | { $case: "loadParticipantsRes"; loadParticipantsRes: LoadParticipantsRes }
    | { $case: "newCustomEvent"; newCustomEvent: CustomEvent }
    | { $case: "loadChannelsWithMsgRes"; loadChannelsWithMsgRes: LoadChannelsWithMsgRes }
    | { $case: "channelLastSeenMessageUpdated"; channelLastSeenMessageUpdated: ChannelLastSeenMessageUpdated }
    | { $case: "updateLastSeenMessageAtRes"; updateLastSeenMessageAtRes: UpdateLastSeenMessageAtRes };
}

export interface SendMessage {
  channelId: string;
  text: string;
  localId: string;
  customData?: CustomData | undefined;
}

export interface JoinChannel {
  channelId: string;
  initialPageSize: number;
  initialOffset: number;
}

export interface ChannelInitialInfo {
  channelId: string;
  totalMessages: number;
  firstMessageCreatedAt?: Date;
  lastMessageCreatedAt?: Date;
  notSeenMessagesCount: number;
  lastSeenMessageCreatedAt?: Date;
  historyMessages: Message[];
  customData?: CustomData | undefined;
  participantsCount: number;
  participantsOnlineCount: number;
}

export interface MeJoined {
  identifier: string;
  grants?: ChannelParticipantGrants;
  customData?: CustomData | undefined;
}

export interface MeJoinedToChannel {
  me?: MeJoined;
  isSuccess: boolean;
  isParticipantFound: boolean;
  channel?: ChannelInitialInfo;
}

export interface LoadMoreMessages {
  channelId: string;
  pageSize: number;
  firstLoadedCreatedAt?: Date | undefined;
  isLoadOlder: boolean;
  skipFromFirstLoaded: number;
}

export interface LoadMoreMessagesRequestInfo {
  pageSize: number;
  firstLoadedCreatedAt?: Date | undefined;
  skipFromFirstLoaded: number;
}

export interface LoadMoreMessagesRes {
  requestInfo?: LoadMoreMessagesRequestInfo;
  isSuccess: boolean;
  totalMessages: number;
  firstMessageCreatedAt?: Date;
  lastMessageCreatedAt?: Date;
  messages: Message[];
}

export interface ParticipantBecameOnline {
  identifier: string;
}

export interface ParticipantBecameOffline {
  identifier: string;
  lastSeenAt?: Date;
}

export interface LoadParticipantsReq {
  channelId: string;
  pageSize: number;
}

export interface LoadParticipantsRes {
  participants: ParticipantShortInfo[];
  pageSize: number;
}

export interface LoadChannelsWithMsgReq {
  messagesLimit: number;
}

export interface ChannelWithMsg {
  channel?: ShortChannel;
  notSeenMessagesCount: number;
  messages: Message[];
}

export interface LoadChannelsWithMsgRes {
  channels: ChannelWithMsg[];
}

export interface UpdateLastSeenMessageAtReq {
  channelId: string;
  lastSeenAtUnixMS: number;
}

export interface UpdateLastSeenMessageAtRes {
  channelId: string;
  lastSeenAt?: Date;
}

export interface ChannelLastSeenMessageUpdated {
  channelId: string;
  lastSeenAt?: Date;
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
      case "loadMoreMessages":
        LoadMoreMessages.encode(message.message.loadMoreMessages, writer.uint32(26).fork()).ldelim();
        break;
      case "loadParticipantsReq":
        LoadParticipantsReq.encode(message.message.loadParticipantsReq, writer.uint32(34).fork()).ldelim();
        break;
      case "sendCustomEvent":
        CustomEvent.encode(message.message.sendCustomEvent, writer.uint32(42).fork()).ldelim();
        break;
      case "loadChannelsWithMsgReq":
        LoadChannelsWithMsgReq.encode(message.message.loadChannelsWithMsgReq, writer.uint32(50).fork()).ldelim();
        break;
      case "updateLastSeenMessageAtReq":
        UpdateLastSeenMessageAtReq.encode(message.message.updateLastSeenMessageAtReq, writer.uint32(58).fork())
          .ldelim();
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
        case 3:
          message.message = {
            $case: "loadMoreMessages",
            loadMoreMessages: LoadMoreMessages.decode(reader, reader.uint32()),
          };
          break;
        case 4:
          message.message = {
            $case: "loadParticipantsReq",
            loadParticipantsReq: LoadParticipantsReq.decode(reader, reader.uint32()),
          };
          break;
        case 5:
          message.message = { $case: "sendCustomEvent", sendCustomEvent: CustomEvent.decode(reader, reader.uint32()) };
          break;
        case 6:
          message.message = {
            $case: "loadChannelsWithMsgReq",
            loadChannelsWithMsgReq: LoadChannelsWithMsgReq.decode(reader, reader.uint32()),
          };
          break;
        case 7:
          message.message = {
            $case: "updateLastSeenMessageAtReq",
            updateLastSeenMessageAtReq: UpdateLastSeenMessageAtReq.decode(reader, reader.uint32()),
          };
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
        : isSet(object.loadMoreMessages)
        ? { $case: "loadMoreMessages", loadMoreMessages: LoadMoreMessages.fromJSON(object.loadMoreMessages) }
        : isSet(object.loadParticipantsReq)
        ? {
          $case: "loadParticipantsReq",
          loadParticipantsReq: LoadParticipantsReq.fromJSON(object.loadParticipantsReq),
        }
        : isSet(object.sendCustomEvent)
        ? { $case: "sendCustomEvent", sendCustomEvent: CustomEvent.fromJSON(object.sendCustomEvent) }
        : isSet(object.loadChannelsWithMsgReq)
        ? {
          $case: "loadChannelsWithMsgReq",
          loadChannelsWithMsgReq: LoadChannelsWithMsgReq.fromJSON(object.loadChannelsWithMsgReq),
        }
        : isSet(object.updateLastSeenMessageAtReq)
        ? {
          $case: "updateLastSeenMessageAtReq",
          updateLastSeenMessageAtReq: UpdateLastSeenMessageAtReq.fromJSON(object.updateLastSeenMessageAtReq),
        }
        : undefined,
    };
  },

  toJSON(message: OutBoundMessage): unknown {
    const obj: any = {};
    message.message?.$case === "sendMessage" &&
      (obj.sendMessage = message.message?.sendMessage ? SendMessage.toJSON(message.message?.sendMessage) : undefined);
    message.message?.$case === "joinChannel" &&
      (obj.joinChannel = message.message?.joinChannel ? JoinChannel.toJSON(message.message?.joinChannel) : undefined);
    message.message?.$case === "loadMoreMessages" && (obj.loadMoreMessages = message.message?.loadMoreMessages
      ? LoadMoreMessages.toJSON(message.message?.loadMoreMessages)
      : undefined);
    message.message?.$case === "loadParticipantsReq" && (obj.loadParticipantsReq = message.message?.loadParticipantsReq
      ? LoadParticipantsReq.toJSON(message.message?.loadParticipantsReq)
      : undefined);
    message.message?.$case === "sendCustomEvent" && (obj.sendCustomEvent = message.message?.sendCustomEvent
      ? CustomEvent.toJSON(message.message?.sendCustomEvent)
      : undefined);
    message.message?.$case === "loadChannelsWithMsgReq" &&
      (obj.loadChannelsWithMsgReq = message.message?.loadChannelsWithMsgReq
        ? LoadChannelsWithMsgReq.toJSON(message.message?.loadChannelsWithMsgReq)
        : undefined);
    message.message?.$case === "updateLastSeenMessageAtReq" &&
      (obj.updateLastSeenMessageAtReq = message.message?.updateLastSeenMessageAtReq
        ? UpdateLastSeenMessageAtReq.toJSON(message.message?.updateLastSeenMessageAtReq)
        : undefined);
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
    if (
      object.message?.$case === "loadMoreMessages" &&
      object.message?.loadMoreMessages !== undefined &&
      object.message?.loadMoreMessages !== null
    ) {
      message.message = {
        $case: "loadMoreMessages",
        loadMoreMessages: LoadMoreMessages.fromPartial(object.message.loadMoreMessages),
      };
    }
    if (
      object.message?.$case === "loadParticipantsReq" &&
      object.message?.loadParticipantsReq !== undefined &&
      object.message?.loadParticipantsReq !== null
    ) {
      message.message = {
        $case: "loadParticipantsReq",
        loadParticipantsReq: LoadParticipantsReq.fromPartial(object.message.loadParticipantsReq),
      };
    }
    if (
      object.message?.$case === "sendCustomEvent" &&
      object.message?.sendCustomEvent !== undefined &&
      object.message?.sendCustomEvent !== null
    ) {
      message.message = {
        $case: "sendCustomEvent",
        sendCustomEvent: CustomEvent.fromPartial(object.message.sendCustomEvent),
      };
    }
    if (
      object.message?.$case === "loadChannelsWithMsgReq" &&
      object.message?.loadChannelsWithMsgReq !== undefined &&
      object.message?.loadChannelsWithMsgReq !== null
    ) {
      message.message = {
        $case: "loadChannelsWithMsgReq",
        loadChannelsWithMsgReq: LoadChannelsWithMsgReq.fromPartial(object.message.loadChannelsWithMsgReq),
      };
    }
    if (
      object.message?.$case === "updateLastSeenMessageAtReq" &&
      object.message?.updateLastSeenMessageAtReq !== undefined &&
      object.message?.updateLastSeenMessageAtReq !== null
    ) {
      message.message = {
        $case: "updateLastSeenMessageAtReq",
        updateLastSeenMessageAtReq: UpdateLastSeenMessageAtReq.fromPartial(object.message.updateLastSeenMessageAtReq),
      };
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
      case "loadMoreMessagesRes":
        LoadMoreMessagesRes.encode(message.message.loadMoreMessagesRes, writer.uint32(26).fork()).ldelim();
        break;
      case "participantBecameOnline":
        ParticipantBecameOnline.encode(message.message.participantBecameOnline, writer.uint32(34).fork()).ldelim();
        break;
      case "participantBecameOffline":
        ParticipantBecameOffline.encode(message.message.participantBecameOffline, writer.uint32(42).fork()).ldelim();
        break;
      case "loadParticipantsRes":
        LoadParticipantsRes.encode(message.message.loadParticipantsRes, writer.uint32(50).fork()).ldelim();
        break;
      case "newCustomEvent":
        CustomEvent.encode(message.message.newCustomEvent, writer.uint32(58).fork()).ldelim();
        break;
      case "loadChannelsWithMsgRes":
        LoadChannelsWithMsgRes.encode(message.message.loadChannelsWithMsgRes, writer.uint32(66).fork()).ldelim();
        break;
      case "channelLastSeenMessageUpdated":
        ChannelLastSeenMessageUpdated.encode(message.message.channelLastSeenMessageUpdated, writer.uint32(74).fork())
          .ldelim();
        break;
      case "updateLastSeenMessageAtRes":
        UpdateLastSeenMessageAtRes.encode(message.message.updateLastSeenMessageAtRes, writer.uint32(82).fork())
          .ldelim();
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
        case 3:
          message.message = {
            $case: "loadMoreMessagesRes",
            loadMoreMessagesRes: LoadMoreMessagesRes.decode(reader, reader.uint32()),
          };
          break;
        case 4:
          message.message = {
            $case: "participantBecameOnline",
            participantBecameOnline: ParticipantBecameOnline.decode(reader, reader.uint32()),
          };
          break;
        case 5:
          message.message = {
            $case: "participantBecameOffline",
            participantBecameOffline: ParticipantBecameOffline.decode(reader, reader.uint32()),
          };
          break;
        case 6:
          message.message = {
            $case: "loadParticipantsRes",
            loadParticipantsRes: LoadParticipantsRes.decode(reader, reader.uint32()),
          };
          break;
        case 7:
          message.message = { $case: "newCustomEvent", newCustomEvent: CustomEvent.decode(reader, reader.uint32()) };
          break;
        case 8:
          message.message = {
            $case: "loadChannelsWithMsgRes",
            loadChannelsWithMsgRes: LoadChannelsWithMsgRes.decode(reader, reader.uint32()),
          };
          break;
        case 9:
          message.message = {
            $case: "channelLastSeenMessageUpdated",
            channelLastSeenMessageUpdated: ChannelLastSeenMessageUpdated.decode(reader, reader.uint32()),
          };
          break;
        case 10:
          message.message = {
            $case: "updateLastSeenMessageAtRes",
            updateLastSeenMessageAtRes: UpdateLastSeenMessageAtRes.decode(reader, reader.uint32()),
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
        : isSet(object.loadMoreMessagesRes)
        ? {
          $case: "loadMoreMessagesRes",
          loadMoreMessagesRes: LoadMoreMessagesRes.fromJSON(object.loadMoreMessagesRes),
        }
        : isSet(object.participantBecameOnline)
        ? {
          $case: "participantBecameOnline",
          participantBecameOnline: ParticipantBecameOnline.fromJSON(object.participantBecameOnline),
        }
        : isSet(object.participantBecameOffline)
        ? {
          $case: "participantBecameOffline",
          participantBecameOffline: ParticipantBecameOffline.fromJSON(object.participantBecameOffline),
        }
        : isSet(object.loadParticipantsRes)
        ? {
          $case: "loadParticipantsRes",
          loadParticipantsRes: LoadParticipantsRes.fromJSON(object.loadParticipantsRes),
        }
        : isSet(object.newCustomEvent)
        ? { $case: "newCustomEvent", newCustomEvent: CustomEvent.fromJSON(object.newCustomEvent) }
        : isSet(object.loadChannelsWithMsgRes)
        ? {
          $case: "loadChannelsWithMsgRes",
          loadChannelsWithMsgRes: LoadChannelsWithMsgRes.fromJSON(object.loadChannelsWithMsgRes),
        }
        : isSet(object.channelLastSeenMessageUpdated)
        ? {
          $case: "channelLastSeenMessageUpdated",
          channelLastSeenMessageUpdated: ChannelLastSeenMessageUpdated.fromJSON(object.channelLastSeenMessageUpdated),
        }
        : isSet(object.updateLastSeenMessageAtRes)
        ? {
          $case: "updateLastSeenMessageAtRes",
          updateLastSeenMessageAtRes: UpdateLastSeenMessageAtRes.fromJSON(object.updateLastSeenMessageAtRes),
        }
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
    message.message?.$case === "loadMoreMessagesRes" && (obj.loadMoreMessagesRes = message.message?.loadMoreMessagesRes
      ? LoadMoreMessagesRes.toJSON(message.message?.loadMoreMessagesRes)
      : undefined);
    message.message?.$case === "participantBecameOnline" &&
      (obj.participantBecameOnline = message.message?.participantBecameOnline
        ? ParticipantBecameOnline.toJSON(message.message?.participantBecameOnline)
        : undefined);
    message.message?.$case === "participantBecameOffline" &&
      (obj.participantBecameOffline = message.message?.participantBecameOffline
        ? ParticipantBecameOffline.toJSON(message.message?.participantBecameOffline)
        : undefined);
    message.message?.$case === "loadParticipantsRes" && (obj.loadParticipantsRes = message.message?.loadParticipantsRes
      ? LoadParticipantsRes.toJSON(message.message?.loadParticipantsRes)
      : undefined);
    message.message?.$case === "newCustomEvent" && (obj.newCustomEvent = message.message?.newCustomEvent
      ? CustomEvent.toJSON(message.message?.newCustomEvent)
      : undefined);
    message.message?.$case === "loadChannelsWithMsgRes" &&
      (obj.loadChannelsWithMsgRes = message.message?.loadChannelsWithMsgRes
        ? LoadChannelsWithMsgRes.toJSON(message.message?.loadChannelsWithMsgRes)
        : undefined);
    message.message?.$case === "channelLastSeenMessageUpdated" &&
      (obj.channelLastSeenMessageUpdated = message.message?.channelLastSeenMessageUpdated
        ? ChannelLastSeenMessageUpdated.toJSON(message.message?.channelLastSeenMessageUpdated)
        : undefined);
    message.message?.$case === "updateLastSeenMessageAtRes" &&
      (obj.updateLastSeenMessageAtRes = message.message?.updateLastSeenMessageAtRes
        ? UpdateLastSeenMessageAtRes.toJSON(message.message?.updateLastSeenMessageAtRes)
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
    if (
      object.message?.$case === "loadMoreMessagesRes" &&
      object.message?.loadMoreMessagesRes !== undefined &&
      object.message?.loadMoreMessagesRes !== null
    ) {
      message.message = {
        $case: "loadMoreMessagesRes",
        loadMoreMessagesRes: LoadMoreMessagesRes.fromPartial(object.message.loadMoreMessagesRes),
      };
    }
    if (
      object.message?.$case === "participantBecameOnline" &&
      object.message?.participantBecameOnline !== undefined &&
      object.message?.participantBecameOnline !== null
    ) {
      message.message = {
        $case: "participantBecameOnline",
        participantBecameOnline: ParticipantBecameOnline.fromPartial(object.message.participantBecameOnline),
      };
    }
    if (
      object.message?.$case === "participantBecameOffline" &&
      object.message?.participantBecameOffline !== undefined &&
      object.message?.participantBecameOffline !== null
    ) {
      message.message = {
        $case: "participantBecameOffline",
        participantBecameOffline: ParticipantBecameOffline.fromPartial(object.message.participantBecameOffline),
      };
    }
    if (
      object.message?.$case === "loadParticipantsRes" &&
      object.message?.loadParticipantsRes !== undefined &&
      object.message?.loadParticipantsRes !== null
    ) {
      message.message = {
        $case: "loadParticipantsRes",
        loadParticipantsRes: LoadParticipantsRes.fromPartial(object.message.loadParticipantsRes),
      };
    }
    if (
      object.message?.$case === "newCustomEvent" &&
      object.message?.newCustomEvent !== undefined &&
      object.message?.newCustomEvent !== null
    ) {
      message.message = {
        $case: "newCustomEvent",
        newCustomEvent: CustomEvent.fromPartial(object.message.newCustomEvent),
      };
    }
    if (
      object.message?.$case === "loadChannelsWithMsgRes" &&
      object.message?.loadChannelsWithMsgRes !== undefined &&
      object.message?.loadChannelsWithMsgRes !== null
    ) {
      message.message = {
        $case: "loadChannelsWithMsgRes",
        loadChannelsWithMsgRes: LoadChannelsWithMsgRes.fromPartial(object.message.loadChannelsWithMsgRes),
      };
    }
    if (
      object.message?.$case === "channelLastSeenMessageUpdated" &&
      object.message?.channelLastSeenMessageUpdated !== undefined &&
      object.message?.channelLastSeenMessageUpdated !== null
    ) {
      message.message = {
        $case: "channelLastSeenMessageUpdated",
        channelLastSeenMessageUpdated: ChannelLastSeenMessageUpdated.fromPartial(
          object.message.channelLastSeenMessageUpdated,
        ),
      };
    }
    if (
      object.message?.$case === "updateLastSeenMessageAtRes" &&
      object.message?.updateLastSeenMessageAtRes !== undefined &&
      object.message?.updateLastSeenMessageAtRes !== null
    ) {
      message.message = {
        $case: "updateLastSeenMessageAtRes",
        updateLastSeenMessageAtRes: UpdateLastSeenMessageAtRes.fromPartial(object.message.updateLastSeenMessageAtRes),
      };
    }
    return message;
  },
};

function createBaseSendMessage(): SendMessage {
  return { channelId: "", text: "", localId: "", customData: undefined };
}

export const SendMessage = {
  encode(message: SendMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.channelId !== "") {
      writer.uint32(10).string(message.channelId);
    }
    if (message.text !== "") {
      writer.uint32(18).string(message.text);
    }
    if (message.localId !== "") {
      writer.uint32(26).string(message.localId);
    }
    if (message.customData !== undefined) {
      CustomData.encode(message.customData, writer.uint32(34).fork()).ldelim();
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
          message.channelId = reader.string();
          break;
        case 2:
          message.text = reader.string();
          break;
        case 3:
          message.localId = reader.string();
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

  fromJSON(object: any): SendMessage {
    return {
      channelId: isSet(object.channelId) ? String(object.channelId) : "",
      text: isSet(object.text) ? String(object.text) : "",
      localId: isSet(object.localId) ? String(object.localId) : "",
      customData: isSet(object.customData) ? CustomData.fromJSON(object.customData) : undefined,
    };
  },

  toJSON(message: SendMessage): unknown {
    const obj: any = {};
    message.channelId !== undefined && (obj.channelId = message.channelId);
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
    message.channelId = object.channelId ?? "";
    message.text = object.text ?? "";
    message.localId = object.localId ?? "";
    message.customData = (object.customData !== undefined && object.customData !== null)
      ? CustomData.fromPartial(object.customData)
      : undefined;
    return message;
  },
};

function createBaseJoinChannel(): JoinChannel {
  return { channelId: "", initialPageSize: 0, initialOffset: 0 };
}

export const JoinChannel = {
  encode(message: JoinChannel, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.channelId !== "") {
      writer.uint32(10).string(message.channelId);
    }
    if (message.initialPageSize !== 0) {
      writer.uint32(16).int64(message.initialPageSize);
    }
    if (message.initialOffset !== 0) {
      writer.uint32(24).int64(message.initialOffset);
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
          message.channelId = reader.string();
          break;
        case 2:
          message.initialPageSize = longToNumber(reader.int64() as Long);
          break;
        case 3:
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
      channelId: isSet(object.channelId) ? String(object.channelId) : "",
      initialPageSize: isSet(object.initialPageSize) ? Number(object.initialPageSize) : 0,
      initialOffset: isSet(object.initialOffset) ? Number(object.initialOffset) : 0,
    };
  },

  toJSON(message: JoinChannel): unknown {
    const obj: any = {};
    message.channelId !== undefined && (obj.channelId = message.channelId);
    message.initialPageSize !== undefined && (obj.initialPageSize = Math.round(message.initialPageSize));
    message.initialOffset !== undefined && (obj.initialOffset = Math.round(message.initialOffset));
    return obj;
  },

  create<I extends Exact<DeepPartial<JoinChannel>, I>>(base?: I): JoinChannel {
    return JoinChannel.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<JoinChannel>, I>>(object: I): JoinChannel {
    const message = createBaseJoinChannel();
    message.channelId = object.channelId ?? "";
    message.initialPageSize = object.initialPageSize ?? 0;
    message.initialOffset = object.initialOffset ?? 0;
    return message;
  },
};

function createBaseChannelInitialInfo(): ChannelInitialInfo {
  return {
    channelId: "",
    totalMessages: 0,
    firstMessageCreatedAt: undefined,
    lastMessageCreatedAt: undefined,
    notSeenMessagesCount: 0,
    lastSeenMessageCreatedAt: undefined,
    historyMessages: [],
    customData: undefined,
    participantsCount: 0,
    participantsOnlineCount: 0,
  };
}

export const ChannelInitialInfo = {
  encode(message: ChannelInitialInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.channelId !== "") {
      writer.uint32(10).string(message.channelId);
    }
    if (message.totalMessages !== 0) {
      writer.uint32(16).int64(message.totalMessages);
    }
    if (message.firstMessageCreatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.firstMessageCreatedAt), writer.uint32(26).fork()).ldelim();
    }
    if (message.lastMessageCreatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.lastMessageCreatedAt), writer.uint32(34).fork()).ldelim();
    }
    if (message.notSeenMessagesCount !== 0) {
      writer.uint32(40).int64(message.notSeenMessagesCount);
    }
    if (message.lastSeenMessageCreatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.lastSeenMessageCreatedAt), writer.uint32(50).fork()).ldelim();
    }
    for (const v of message.historyMessages) {
      Message.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    if (message.customData !== undefined) {
      CustomData.encode(message.customData, writer.uint32(66).fork()).ldelim();
    }
    if (message.participantsCount !== 0) {
      writer.uint32(72).int64(message.participantsCount);
    }
    if (message.participantsOnlineCount !== 0) {
      writer.uint32(80).int64(message.participantsOnlineCount);
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
          message.totalMessages = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.firstMessageCreatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 4:
          message.lastMessageCreatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 5:
          message.notSeenMessagesCount = longToNumber(reader.int64() as Long);
          break;
        case 6:
          message.lastSeenMessageCreatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 7:
          message.historyMessages.push(Message.decode(reader, reader.uint32()));
          break;
        case 8:
          message.customData = CustomData.decode(reader, reader.uint32());
          break;
        case 9:
          message.participantsCount = longToNumber(reader.int64() as Long);
          break;
        case 10:
          message.participantsOnlineCount = longToNumber(reader.int64() as Long);
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
      totalMessages: isSet(object.totalMessages) ? Number(object.totalMessages) : 0,
      firstMessageCreatedAt: isSet(object.firstMessageCreatedAt)
        ? fromJsonTimestamp(object.firstMessageCreatedAt)
        : undefined,
      lastMessageCreatedAt: isSet(object.lastMessageCreatedAt)
        ? fromJsonTimestamp(object.lastMessageCreatedAt)
        : undefined,
      notSeenMessagesCount: isSet(object.notSeenMessagesCount) ? Number(object.notSeenMessagesCount) : 0,
      lastSeenMessageCreatedAt: isSet(object.lastSeenMessageCreatedAt)
        ? fromJsonTimestamp(object.lastSeenMessageCreatedAt)
        : undefined,
      historyMessages: Array.isArray(object?.historyMessages)
        ? object.historyMessages.map((e: any) => Message.fromJSON(e))
        : [],
      customData: isSet(object.customData) ? CustomData.fromJSON(object.customData) : undefined,
      participantsCount: isSet(object.participantsCount) ? Number(object.participantsCount) : 0,
      participantsOnlineCount: isSet(object.participantsOnlineCount) ? Number(object.participantsOnlineCount) : 0,
    };
  },

  toJSON(message: ChannelInitialInfo): unknown {
    const obj: any = {};
    message.channelId !== undefined && (obj.channelId = message.channelId);
    message.totalMessages !== undefined && (obj.totalMessages = Math.round(message.totalMessages));
    message.firstMessageCreatedAt !== undefined &&
      (obj.firstMessageCreatedAt = message.firstMessageCreatedAt.toISOString());
    message.lastMessageCreatedAt !== undefined &&
      (obj.lastMessageCreatedAt = message.lastMessageCreatedAt.toISOString());
    message.notSeenMessagesCount !== undefined && (obj.notSeenMessagesCount = Math.round(message.notSeenMessagesCount));
    message.lastSeenMessageCreatedAt !== undefined &&
      (obj.lastSeenMessageCreatedAt = message.lastSeenMessageCreatedAt.toISOString());
    if (message.historyMessages) {
      obj.historyMessages = message.historyMessages.map((e) => e ? Message.toJSON(e) : undefined);
    } else {
      obj.historyMessages = [];
    }
    message.customData !== undefined &&
      (obj.customData = message.customData ? CustomData.toJSON(message.customData) : undefined);
    message.participantsCount !== undefined && (obj.participantsCount = Math.round(message.participantsCount));
    message.participantsOnlineCount !== undefined &&
      (obj.participantsOnlineCount = Math.round(message.participantsOnlineCount));
    return obj;
  },

  create<I extends Exact<DeepPartial<ChannelInitialInfo>, I>>(base?: I): ChannelInitialInfo {
    return ChannelInitialInfo.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ChannelInitialInfo>, I>>(object: I): ChannelInitialInfo {
    const message = createBaseChannelInitialInfo();
    message.channelId = object.channelId ?? "";
    message.totalMessages = object.totalMessages ?? 0;
    message.firstMessageCreatedAt = object.firstMessageCreatedAt ?? undefined;
    message.lastMessageCreatedAt = object.lastMessageCreatedAt ?? undefined;
    message.notSeenMessagesCount = object.notSeenMessagesCount ?? 0;
    message.lastSeenMessageCreatedAt = object.lastSeenMessageCreatedAt ?? undefined;
    message.historyMessages = object.historyMessages?.map((e) => Message.fromPartial(e)) || [];
    message.customData = (object.customData !== undefined && object.customData !== null)
      ? CustomData.fromPartial(object.customData)
      : undefined;
    message.participantsCount = object.participantsCount ?? 0;
    message.participantsOnlineCount = object.participantsOnlineCount ?? 0;
    return message;
  },
};

function createBaseMeJoined(): MeJoined {
  return { identifier: "", grants: undefined, customData: undefined };
}

export const MeJoined = {
  encode(message: MeJoined, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identifier !== "") {
      writer.uint32(10).string(message.identifier);
    }
    if (message.grants !== undefined) {
      ChannelParticipantGrants.encode(message.grants, writer.uint32(18).fork()).ldelim();
    }
    if (message.customData !== undefined) {
      CustomData.encode(message.customData, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MeJoined {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMeJoined();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifier = reader.string();
          break;
        case 2:
          message.grants = ChannelParticipantGrants.decode(reader, reader.uint32());
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

  fromJSON(object: any): MeJoined {
    return {
      identifier: isSet(object.identifier) ? String(object.identifier) : "",
      grants: isSet(object.grants) ? ChannelParticipantGrants.fromJSON(object.grants) : undefined,
      customData: isSet(object.customData) ? CustomData.fromJSON(object.customData) : undefined,
    };
  },

  toJSON(message: MeJoined): unknown {
    const obj: any = {};
    message.identifier !== undefined && (obj.identifier = message.identifier);
    message.grants !== undefined &&
      (obj.grants = message.grants ? ChannelParticipantGrants.toJSON(message.grants) : undefined);
    message.customData !== undefined &&
      (obj.customData = message.customData ? CustomData.toJSON(message.customData) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<MeJoined>, I>>(base?: I): MeJoined {
    return MeJoined.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MeJoined>, I>>(object: I): MeJoined {
    const message = createBaseMeJoined();
    message.identifier = object.identifier ?? "";
    message.grants = (object.grants !== undefined && object.grants !== null)
      ? ChannelParticipantGrants.fromPartial(object.grants)
      : undefined;
    message.customData = (object.customData !== undefined && object.customData !== null)
      ? CustomData.fromPartial(object.customData)
      : undefined;
    return message;
  },
};

function createBaseMeJoinedToChannel(): MeJoinedToChannel {
  return { me: undefined, isSuccess: false, isParticipantFound: false, channel: undefined };
}

export const MeJoinedToChannel = {
  encode(message: MeJoinedToChannel, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.me !== undefined) {
      MeJoined.encode(message.me, writer.uint32(10).fork()).ldelim();
    }
    if (message.isSuccess === true) {
      writer.uint32(16).bool(message.isSuccess);
    }
    if (message.isParticipantFound === true) {
      writer.uint32(24).bool(message.isParticipantFound);
    }
    if (message.channel !== undefined) {
      ChannelInitialInfo.encode(message.channel, writer.uint32(34).fork()).ldelim();
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
          message.me = MeJoined.decode(reader, reader.uint32());
          break;
        case 2:
          message.isSuccess = reader.bool();
          break;
        case 3:
          message.isParticipantFound = reader.bool();
          break;
        case 4:
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
      me: isSet(object.me) ? MeJoined.fromJSON(object.me) : undefined,
      isSuccess: isSet(object.isSuccess) ? Boolean(object.isSuccess) : false,
      isParticipantFound: isSet(object.isParticipantFound) ? Boolean(object.isParticipantFound) : false,
      channel: isSet(object.channel) ? ChannelInitialInfo.fromJSON(object.channel) : undefined,
    };
  },

  toJSON(message: MeJoinedToChannel): unknown {
    const obj: any = {};
    message.me !== undefined && (obj.me = message.me ? MeJoined.toJSON(message.me) : undefined);
    message.isSuccess !== undefined && (obj.isSuccess = message.isSuccess);
    message.isParticipantFound !== undefined && (obj.isParticipantFound = message.isParticipantFound);
    message.channel !== undefined &&
      (obj.channel = message.channel ? ChannelInitialInfo.toJSON(message.channel) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<MeJoinedToChannel>, I>>(base?: I): MeJoinedToChannel {
    return MeJoinedToChannel.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MeJoinedToChannel>, I>>(object: I): MeJoinedToChannel {
    const message = createBaseMeJoinedToChannel();
    message.me = (object.me !== undefined && object.me !== null) ? MeJoined.fromPartial(object.me) : undefined;
    message.isSuccess = object.isSuccess ?? false;
    message.isParticipantFound = object.isParticipantFound ?? false;
    message.channel = (object.channel !== undefined && object.channel !== null)
      ? ChannelInitialInfo.fromPartial(object.channel)
      : undefined;
    return message;
  },
};

function createBaseLoadMoreMessages(): LoadMoreMessages {
  return { channelId: "", pageSize: 0, firstLoadedCreatedAt: undefined, isLoadOlder: false, skipFromFirstLoaded: 0 };
}

export const LoadMoreMessages = {
  encode(message: LoadMoreMessages, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.channelId !== "") {
      writer.uint32(10).string(message.channelId);
    }
    if (message.pageSize !== 0) {
      writer.uint32(16).int32(message.pageSize);
    }
    if (message.firstLoadedCreatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.firstLoadedCreatedAt), writer.uint32(26).fork()).ldelim();
    }
    if (message.isLoadOlder === true) {
      writer.uint32(32).bool(message.isLoadOlder);
    }
    if (message.skipFromFirstLoaded !== 0) {
      writer.uint32(40).int32(message.skipFromFirstLoaded);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoadMoreMessages {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoadMoreMessages();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.channelId = reader.string();
          break;
        case 2:
          message.pageSize = reader.int32();
          break;
        case 3:
          message.firstLoadedCreatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 4:
          message.isLoadOlder = reader.bool();
          break;
        case 5:
          message.skipFromFirstLoaded = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LoadMoreMessages {
    return {
      channelId: isSet(object.channelId) ? String(object.channelId) : "",
      pageSize: isSet(object.pageSize) ? Number(object.pageSize) : 0,
      firstLoadedCreatedAt: isSet(object.firstLoadedCreatedAt)
        ? fromJsonTimestamp(object.firstLoadedCreatedAt)
        : undefined,
      isLoadOlder: isSet(object.isLoadOlder) ? Boolean(object.isLoadOlder) : false,
      skipFromFirstLoaded: isSet(object.skipFromFirstLoaded) ? Number(object.skipFromFirstLoaded) : 0,
    };
  },

  toJSON(message: LoadMoreMessages): unknown {
    const obj: any = {};
    message.channelId !== undefined && (obj.channelId = message.channelId);
    message.pageSize !== undefined && (obj.pageSize = Math.round(message.pageSize));
    message.firstLoadedCreatedAt !== undefined &&
      (obj.firstLoadedCreatedAt = message.firstLoadedCreatedAt.toISOString());
    message.isLoadOlder !== undefined && (obj.isLoadOlder = message.isLoadOlder);
    message.skipFromFirstLoaded !== undefined && (obj.skipFromFirstLoaded = Math.round(message.skipFromFirstLoaded));
    return obj;
  },

  create<I extends Exact<DeepPartial<LoadMoreMessages>, I>>(base?: I): LoadMoreMessages {
    return LoadMoreMessages.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<LoadMoreMessages>, I>>(object: I): LoadMoreMessages {
    const message = createBaseLoadMoreMessages();
    message.channelId = object.channelId ?? "";
    message.pageSize = object.pageSize ?? 0;
    message.firstLoadedCreatedAt = object.firstLoadedCreatedAt ?? undefined;
    message.isLoadOlder = object.isLoadOlder ?? false;
    message.skipFromFirstLoaded = object.skipFromFirstLoaded ?? 0;
    return message;
  },
};

function createBaseLoadMoreMessagesRequestInfo(): LoadMoreMessagesRequestInfo {
  return { pageSize: 0, firstLoadedCreatedAt: undefined, skipFromFirstLoaded: 0 };
}

export const LoadMoreMessagesRequestInfo = {
  encode(message: LoadMoreMessagesRequestInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pageSize !== 0) {
      writer.uint32(8).int32(message.pageSize);
    }
    if (message.firstLoadedCreatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.firstLoadedCreatedAt), writer.uint32(18).fork()).ldelim();
    }
    if (message.skipFromFirstLoaded !== 0) {
      writer.uint32(24).int32(message.skipFromFirstLoaded);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoadMoreMessagesRequestInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoadMoreMessagesRequestInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pageSize = reader.int32();
          break;
        case 2:
          message.firstLoadedCreatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 3:
          message.skipFromFirstLoaded = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LoadMoreMessagesRequestInfo {
    return {
      pageSize: isSet(object.pageSize) ? Number(object.pageSize) : 0,
      firstLoadedCreatedAt: isSet(object.firstLoadedCreatedAt)
        ? fromJsonTimestamp(object.firstLoadedCreatedAt)
        : undefined,
      skipFromFirstLoaded: isSet(object.skipFromFirstLoaded) ? Number(object.skipFromFirstLoaded) : 0,
    };
  },

  toJSON(message: LoadMoreMessagesRequestInfo): unknown {
    const obj: any = {};
    message.pageSize !== undefined && (obj.pageSize = Math.round(message.pageSize));
    message.firstLoadedCreatedAt !== undefined &&
      (obj.firstLoadedCreatedAt = message.firstLoadedCreatedAt.toISOString());
    message.skipFromFirstLoaded !== undefined && (obj.skipFromFirstLoaded = Math.round(message.skipFromFirstLoaded));
    return obj;
  },

  create<I extends Exact<DeepPartial<LoadMoreMessagesRequestInfo>, I>>(base?: I): LoadMoreMessagesRequestInfo {
    return LoadMoreMessagesRequestInfo.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<LoadMoreMessagesRequestInfo>, I>>(object: I): LoadMoreMessagesRequestInfo {
    const message = createBaseLoadMoreMessagesRequestInfo();
    message.pageSize = object.pageSize ?? 0;
    message.firstLoadedCreatedAt = object.firstLoadedCreatedAt ?? undefined;
    message.skipFromFirstLoaded = object.skipFromFirstLoaded ?? 0;
    return message;
  },
};

function createBaseLoadMoreMessagesRes(): LoadMoreMessagesRes {
  return {
    requestInfo: undefined,
    isSuccess: false,
    totalMessages: 0,
    firstMessageCreatedAt: undefined,
    lastMessageCreatedAt: undefined,
    messages: [],
  };
}

export const LoadMoreMessagesRes = {
  encode(message: LoadMoreMessagesRes, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.requestInfo !== undefined) {
      LoadMoreMessagesRequestInfo.encode(message.requestInfo, writer.uint32(10).fork()).ldelim();
    }
    if (message.isSuccess === true) {
      writer.uint32(16).bool(message.isSuccess);
    }
    if (message.totalMessages !== 0) {
      writer.uint32(24).int64(message.totalMessages);
    }
    if (message.firstMessageCreatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.firstMessageCreatedAt), writer.uint32(34).fork()).ldelim();
    }
    if (message.lastMessageCreatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.lastMessageCreatedAt), writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.messages) {
      Message.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoadMoreMessagesRes {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoadMoreMessagesRes();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.requestInfo = LoadMoreMessagesRequestInfo.decode(reader, reader.uint32());
          break;
        case 2:
          message.isSuccess = reader.bool();
          break;
        case 3:
          message.totalMessages = longToNumber(reader.int64() as Long);
          break;
        case 4:
          message.firstMessageCreatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 5:
          message.lastMessageCreatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 6:
          message.messages.push(Message.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LoadMoreMessagesRes {
    return {
      requestInfo: isSet(object.requestInfo) ? LoadMoreMessagesRequestInfo.fromJSON(object.requestInfo) : undefined,
      isSuccess: isSet(object.isSuccess) ? Boolean(object.isSuccess) : false,
      totalMessages: isSet(object.totalMessages) ? Number(object.totalMessages) : 0,
      firstMessageCreatedAt: isSet(object.firstMessageCreatedAt)
        ? fromJsonTimestamp(object.firstMessageCreatedAt)
        : undefined,
      lastMessageCreatedAt: isSet(object.lastMessageCreatedAt)
        ? fromJsonTimestamp(object.lastMessageCreatedAt)
        : undefined,
      messages: Array.isArray(object?.messages) ? object.messages.map((e: any) => Message.fromJSON(e)) : [],
    };
  },

  toJSON(message: LoadMoreMessagesRes): unknown {
    const obj: any = {};
    message.requestInfo !== undefined &&
      (obj.requestInfo = message.requestInfo ? LoadMoreMessagesRequestInfo.toJSON(message.requestInfo) : undefined);
    message.isSuccess !== undefined && (obj.isSuccess = message.isSuccess);
    message.totalMessages !== undefined && (obj.totalMessages = Math.round(message.totalMessages));
    message.firstMessageCreatedAt !== undefined &&
      (obj.firstMessageCreatedAt = message.firstMessageCreatedAt.toISOString());
    message.lastMessageCreatedAt !== undefined &&
      (obj.lastMessageCreatedAt = message.lastMessageCreatedAt.toISOString());
    if (message.messages) {
      obj.messages = message.messages.map((e) => e ? Message.toJSON(e) : undefined);
    } else {
      obj.messages = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LoadMoreMessagesRes>, I>>(base?: I): LoadMoreMessagesRes {
    return LoadMoreMessagesRes.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<LoadMoreMessagesRes>, I>>(object: I): LoadMoreMessagesRes {
    const message = createBaseLoadMoreMessagesRes();
    message.requestInfo = (object.requestInfo !== undefined && object.requestInfo !== null)
      ? LoadMoreMessagesRequestInfo.fromPartial(object.requestInfo)
      : undefined;
    message.isSuccess = object.isSuccess ?? false;
    message.totalMessages = object.totalMessages ?? 0;
    message.firstMessageCreatedAt = object.firstMessageCreatedAt ?? undefined;
    message.lastMessageCreatedAt = object.lastMessageCreatedAt ?? undefined;
    message.messages = object.messages?.map((e) => Message.fromPartial(e)) || [];
    return message;
  },
};

function createBaseParticipantBecameOnline(): ParticipantBecameOnline {
  return { identifier: "" };
}

export const ParticipantBecameOnline = {
  encode(message: ParticipantBecameOnline, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identifier !== "") {
      writer.uint32(10).string(message.identifier);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ParticipantBecameOnline {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParticipantBecameOnline();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifier = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ParticipantBecameOnline {
    return { identifier: isSet(object.identifier) ? String(object.identifier) : "" };
  },

  toJSON(message: ParticipantBecameOnline): unknown {
    const obj: any = {};
    message.identifier !== undefined && (obj.identifier = message.identifier);
    return obj;
  },

  create<I extends Exact<DeepPartial<ParticipantBecameOnline>, I>>(base?: I): ParticipantBecameOnline {
    return ParticipantBecameOnline.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ParticipantBecameOnline>, I>>(object: I): ParticipantBecameOnline {
    const message = createBaseParticipantBecameOnline();
    message.identifier = object.identifier ?? "";
    return message;
  },
};

function createBaseParticipantBecameOffline(): ParticipantBecameOffline {
  return { identifier: "", lastSeenAt: undefined };
}

export const ParticipantBecameOffline = {
  encode(message: ParticipantBecameOffline, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identifier !== "") {
      writer.uint32(10).string(message.identifier);
    }
    if (message.lastSeenAt !== undefined) {
      Timestamp.encode(toTimestamp(message.lastSeenAt), writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ParticipantBecameOffline {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParticipantBecameOffline();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifier = reader.string();
          break;
        case 2:
          message.lastSeenAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ParticipantBecameOffline {
    return {
      identifier: isSet(object.identifier) ? String(object.identifier) : "",
      lastSeenAt: isSet(object.lastSeenAt) ? fromJsonTimestamp(object.lastSeenAt) : undefined,
    };
  },

  toJSON(message: ParticipantBecameOffline): unknown {
    const obj: any = {};
    message.identifier !== undefined && (obj.identifier = message.identifier);
    message.lastSeenAt !== undefined && (obj.lastSeenAt = message.lastSeenAt.toISOString());
    return obj;
  },

  create<I extends Exact<DeepPartial<ParticipantBecameOffline>, I>>(base?: I): ParticipantBecameOffline {
    return ParticipantBecameOffline.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ParticipantBecameOffline>, I>>(object: I): ParticipantBecameOffline {
    const message = createBaseParticipantBecameOffline();
    message.identifier = object.identifier ?? "";
    message.lastSeenAt = object.lastSeenAt ?? undefined;
    return message;
  },
};

function createBaseLoadParticipantsReq(): LoadParticipantsReq {
  return { channelId: "", pageSize: 0 };
}

export const LoadParticipantsReq = {
  encode(message: LoadParticipantsReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.channelId !== "") {
      writer.uint32(10).string(message.channelId);
    }
    if (message.pageSize !== 0) {
      writer.uint32(16).int32(message.pageSize);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoadParticipantsReq {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoadParticipantsReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.channelId = reader.string();
          break;
        case 2:
          message.pageSize = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LoadParticipantsReq {
    return {
      channelId: isSet(object.channelId) ? String(object.channelId) : "",
      pageSize: isSet(object.pageSize) ? Number(object.pageSize) : 0,
    };
  },

  toJSON(message: LoadParticipantsReq): unknown {
    const obj: any = {};
    message.channelId !== undefined && (obj.channelId = message.channelId);
    message.pageSize !== undefined && (obj.pageSize = Math.round(message.pageSize));
    return obj;
  },

  create<I extends Exact<DeepPartial<LoadParticipantsReq>, I>>(base?: I): LoadParticipantsReq {
    return LoadParticipantsReq.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<LoadParticipantsReq>, I>>(object: I): LoadParticipantsReq {
    const message = createBaseLoadParticipantsReq();
    message.channelId = object.channelId ?? "";
    message.pageSize = object.pageSize ?? 0;
    return message;
  },
};

function createBaseLoadParticipantsRes(): LoadParticipantsRes {
  return { participants: [], pageSize: 0 };
}

export const LoadParticipantsRes = {
  encode(message: LoadParticipantsRes, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.participants) {
      ParticipantShortInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pageSize !== 0) {
      writer.uint32(16).int32(message.pageSize);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoadParticipantsRes {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoadParticipantsRes();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.participants.push(ParticipantShortInfo.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pageSize = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LoadParticipantsRes {
    return {
      participants: Array.isArray(object?.participants)
        ? object.participants.map((e: any) => ParticipantShortInfo.fromJSON(e))
        : [],
      pageSize: isSet(object.pageSize) ? Number(object.pageSize) : 0,
    };
  },

  toJSON(message: LoadParticipantsRes): unknown {
    const obj: any = {};
    if (message.participants) {
      obj.participants = message.participants.map((e) => e ? ParticipantShortInfo.toJSON(e) : undefined);
    } else {
      obj.participants = [];
    }
    message.pageSize !== undefined && (obj.pageSize = Math.round(message.pageSize));
    return obj;
  },

  create<I extends Exact<DeepPartial<LoadParticipantsRes>, I>>(base?: I): LoadParticipantsRes {
    return LoadParticipantsRes.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<LoadParticipantsRes>, I>>(object: I): LoadParticipantsRes {
    const message = createBaseLoadParticipantsRes();
    message.participants = object.participants?.map((e) => ParticipantShortInfo.fromPartial(e)) || [];
    message.pageSize = object.pageSize ?? 0;
    return message;
  },
};

function createBaseLoadChannelsWithMsgReq(): LoadChannelsWithMsgReq {
  return { messagesLimit: 0 };
}

export const LoadChannelsWithMsgReq = {
  encode(message: LoadChannelsWithMsgReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.messagesLimit !== 0) {
      writer.uint32(8).int32(message.messagesLimit);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoadChannelsWithMsgReq {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoadChannelsWithMsgReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.messagesLimit = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LoadChannelsWithMsgReq {
    return { messagesLimit: isSet(object.messagesLimit) ? Number(object.messagesLimit) : 0 };
  },

  toJSON(message: LoadChannelsWithMsgReq): unknown {
    const obj: any = {};
    message.messagesLimit !== undefined && (obj.messagesLimit = Math.round(message.messagesLimit));
    return obj;
  },

  create<I extends Exact<DeepPartial<LoadChannelsWithMsgReq>, I>>(base?: I): LoadChannelsWithMsgReq {
    return LoadChannelsWithMsgReq.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<LoadChannelsWithMsgReq>, I>>(object: I): LoadChannelsWithMsgReq {
    const message = createBaseLoadChannelsWithMsgReq();
    message.messagesLimit = object.messagesLimit ?? 0;
    return message;
  },
};

function createBaseChannelWithMsg(): ChannelWithMsg {
  return { channel: undefined, notSeenMessagesCount: 0, messages: [] };
}

export const ChannelWithMsg = {
  encode(message: ChannelWithMsg, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.channel !== undefined) {
      ShortChannel.encode(message.channel, writer.uint32(10).fork()).ldelim();
    }
    if (message.notSeenMessagesCount !== 0) {
      writer.uint32(16).int64(message.notSeenMessagesCount);
    }
    for (const v of message.messages) {
      Message.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChannelWithMsg {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChannelWithMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.channel = ShortChannel.decode(reader, reader.uint32());
          break;
        case 2:
          message.notSeenMessagesCount = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.messages.push(Message.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ChannelWithMsg {
    return {
      channel: isSet(object.channel) ? ShortChannel.fromJSON(object.channel) : undefined,
      notSeenMessagesCount: isSet(object.notSeenMessagesCount) ? Number(object.notSeenMessagesCount) : 0,
      messages: Array.isArray(object?.messages) ? object.messages.map((e: any) => Message.fromJSON(e)) : [],
    };
  },

  toJSON(message: ChannelWithMsg): unknown {
    const obj: any = {};
    message.channel !== undefined && (obj.channel = message.channel ? ShortChannel.toJSON(message.channel) : undefined);
    message.notSeenMessagesCount !== undefined && (obj.notSeenMessagesCount = Math.round(message.notSeenMessagesCount));
    if (message.messages) {
      obj.messages = message.messages.map((e) => e ? Message.toJSON(e) : undefined);
    } else {
      obj.messages = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChannelWithMsg>, I>>(base?: I): ChannelWithMsg {
    return ChannelWithMsg.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ChannelWithMsg>, I>>(object: I): ChannelWithMsg {
    const message = createBaseChannelWithMsg();
    message.channel = (object.channel !== undefined && object.channel !== null)
      ? ShortChannel.fromPartial(object.channel)
      : undefined;
    message.notSeenMessagesCount = object.notSeenMessagesCount ?? 0;
    message.messages = object.messages?.map((e) => Message.fromPartial(e)) || [];
    return message;
  },
};

function createBaseLoadChannelsWithMsgRes(): LoadChannelsWithMsgRes {
  return { channels: [] };
}

export const LoadChannelsWithMsgRes = {
  encode(message: LoadChannelsWithMsgRes, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.channels) {
      ChannelWithMsg.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoadChannelsWithMsgRes {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoadChannelsWithMsgRes();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.channels.push(ChannelWithMsg.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LoadChannelsWithMsgRes {
    return {
      channels: Array.isArray(object?.channels) ? object.channels.map((e: any) => ChannelWithMsg.fromJSON(e)) : [],
    };
  },

  toJSON(message: LoadChannelsWithMsgRes): unknown {
    const obj: any = {};
    if (message.channels) {
      obj.channels = message.channels.map((e) => e ? ChannelWithMsg.toJSON(e) : undefined);
    } else {
      obj.channels = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LoadChannelsWithMsgRes>, I>>(base?: I): LoadChannelsWithMsgRes {
    return LoadChannelsWithMsgRes.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<LoadChannelsWithMsgRes>, I>>(object: I): LoadChannelsWithMsgRes {
    const message = createBaseLoadChannelsWithMsgRes();
    message.channels = object.channels?.map((e) => ChannelWithMsg.fromPartial(e)) || [];
    return message;
  },
};

function createBaseUpdateLastSeenMessageAtReq(): UpdateLastSeenMessageAtReq {
  return { channelId: "", lastSeenAtUnixMS: 0 };
}

export const UpdateLastSeenMessageAtReq = {
  encode(message: UpdateLastSeenMessageAtReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.channelId !== "") {
      writer.uint32(10).string(message.channelId);
    }
    if (message.lastSeenAtUnixMS !== 0) {
      writer.uint32(16).int64(message.lastSeenAtUnixMS);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateLastSeenMessageAtReq {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateLastSeenMessageAtReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.channelId = reader.string();
          break;
        case 2:
          message.lastSeenAtUnixMS = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateLastSeenMessageAtReq {
    return {
      channelId: isSet(object.channelId) ? String(object.channelId) : "",
      lastSeenAtUnixMS: isSet(object.lastSeenAtUnixMS) ? Number(object.lastSeenAtUnixMS) : 0,
    };
  },

  toJSON(message: UpdateLastSeenMessageAtReq): unknown {
    const obj: any = {};
    message.channelId !== undefined && (obj.channelId = message.channelId);
    message.lastSeenAtUnixMS !== undefined && (obj.lastSeenAtUnixMS = Math.round(message.lastSeenAtUnixMS));
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateLastSeenMessageAtReq>, I>>(base?: I): UpdateLastSeenMessageAtReq {
    return UpdateLastSeenMessageAtReq.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateLastSeenMessageAtReq>, I>>(object: I): UpdateLastSeenMessageAtReq {
    const message = createBaseUpdateLastSeenMessageAtReq();
    message.channelId = object.channelId ?? "";
    message.lastSeenAtUnixMS = object.lastSeenAtUnixMS ?? 0;
    return message;
  },
};

function createBaseUpdateLastSeenMessageAtRes(): UpdateLastSeenMessageAtRes {
  return { channelId: "", lastSeenAt: undefined };
}

export const UpdateLastSeenMessageAtRes = {
  encode(message: UpdateLastSeenMessageAtRes, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.channelId !== "") {
      writer.uint32(10).string(message.channelId);
    }
    if (message.lastSeenAt !== undefined) {
      Timestamp.encode(toTimestamp(message.lastSeenAt), writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateLastSeenMessageAtRes {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateLastSeenMessageAtRes();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.channelId = reader.string();
          break;
        case 2:
          message.lastSeenAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateLastSeenMessageAtRes {
    return {
      channelId: isSet(object.channelId) ? String(object.channelId) : "",
      lastSeenAt: isSet(object.lastSeenAt) ? fromJsonTimestamp(object.lastSeenAt) : undefined,
    };
  },

  toJSON(message: UpdateLastSeenMessageAtRes): unknown {
    const obj: any = {};
    message.channelId !== undefined && (obj.channelId = message.channelId);
    message.lastSeenAt !== undefined && (obj.lastSeenAt = message.lastSeenAt.toISOString());
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateLastSeenMessageAtRes>, I>>(base?: I): UpdateLastSeenMessageAtRes {
    return UpdateLastSeenMessageAtRes.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateLastSeenMessageAtRes>, I>>(object: I): UpdateLastSeenMessageAtRes {
    const message = createBaseUpdateLastSeenMessageAtRes();
    message.channelId = object.channelId ?? "";
    message.lastSeenAt = object.lastSeenAt ?? undefined;
    return message;
  },
};

function createBaseChannelLastSeenMessageUpdated(): ChannelLastSeenMessageUpdated {
  return { channelId: "", lastSeenAt: undefined };
}

export const ChannelLastSeenMessageUpdated = {
  encode(message: ChannelLastSeenMessageUpdated, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.channelId !== "") {
      writer.uint32(10).string(message.channelId);
    }
    if (message.lastSeenAt !== undefined) {
      Timestamp.encode(toTimestamp(message.lastSeenAt), writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChannelLastSeenMessageUpdated {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChannelLastSeenMessageUpdated();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.channelId = reader.string();
          break;
        case 2:
          message.lastSeenAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ChannelLastSeenMessageUpdated {
    return {
      channelId: isSet(object.channelId) ? String(object.channelId) : "",
      lastSeenAt: isSet(object.lastSeenAt) ? fromJsonTimestamp(object.lastSeenAt) : undefined,
    };
  },

  toJSON(message: ChannelLastSeenMessageUpdated): unknown {
    const obj: any = {};
    message.channelId !== undefined && (obj.channelId = message.channelId);
    message.lastSeenAt !== undefined && (obj.lastSeenAt = message.lastSeenAt.toISOString());
    return obj;
  },

  create<I extends Exact<DeepPartial<ChannelLastSeenMessageUpdated>, I>>(base?: I): ChannelLastSeenMessageUpdated {
    return ChannelLastSeenMessageUpdated.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ChannelLastSeenMessageUpdated>, I>>(
    object: I,
  ): ChannelLastSeenMessageUpdated {
    const message = createBaseChannelLastSeenMessageUpdated();
    message.channelId = object.channelId ?? "";
    message.lastSeenAt = object.lastSeenAt ?? undefined;
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
