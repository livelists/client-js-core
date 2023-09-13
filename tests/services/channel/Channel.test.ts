import {Channel, ConnectionStates, Message as MessagePB, ParticipantShortInfo} from '../../../src';
import { FakeWSConnector, IFakeWsConnect } from '../../WsConnector.fake';
import {InBoundWsEvents} from "../../../src/common/const/SocketEvents";
import {CustomData, MessageSubType, MessageType} from "../../../src/proto/models";
import {MyLocalParticipantNotExistError} from "../../../src/services/channel/errors";


const FAKE_MESSAGE:MessagePB = {
    id: 'fakeId',
    text: 'text',
    channelIdentifier: 'fakeId',
    type: MessageType.ParticipantCreated,
    subType: MessageSubType.TextMessage,
    localId: 'localId',
}


describe('Channel connection state', () => {
    let channel:Channel;
    let wsConnector:IFakeWsConnect;

    beforeEach(() => {
        wsConnector = new FakeWSConnector();
        channel = new Channel({
            initialOffset: 1,
            initialPageSize: 1,
            socket: wsConnector,
            channelId: 'channelId',
        });
    });
    
    it('should be initial disconnected if ws disconnected', () => {
        wsConnector.isConnected = false;
        expect(channel.connectionState).toBe(ConnectionStates.Disconnected);
    });

    it('should be initial disconnected if ws connected', () => {
        wsConnector.isConnected = true;
        expect(channel.connectionState).toBe(ConnectionStates.Disconnected);
    });

    it('should be connection error after join if ws disconnected', () => {
        wsConnector.isConnected = false;
        channel.join();
        expect(channel.connectionState).toBe(ConnectionStates.ConnectionError);
    });

    it('should be connecting after join if ws connected', () => {
        wsConnector.isConnected = true;
        channel.join();
        expect(channel.connectionState).toBe(ConnectionStates.Connecting);
    });
});

describe('Channel children initialization', () => {
    let channel:Channel;
    let wsConnector:IFakeWsConnect;

    beforeEach(() => {
        wsConnector = new FakeWSConnector();
        channel = new Channel({
            initialOffset: 1,
            initialPageSize: 1,
            socket: wsConnector,
            channelId: 'channelId',
        });
    });

    it('customEvents should init after success join', () => {
        wsConnector.isConnected = true;
        channel.join();
        expect(channel.customEvents).toBeTruthy();
    });

    it('channel participants should init after success join', () => {
        wsConnector.isConnected = true;
        channel.join();
        expect(channel.channelParticipants).toBeTruthy();
    });

    it('channel participants should not init after failed join', () => {
        wsConnector.isConnected = false;
        channel.join();
        expect(channel.channelParticipants).toBeUndefined();
    });

    it('custom events should not init after failed join', () => {
        wsConnector.isConnected = false;
        channel.join();
        expect(channel.customEvents).toBeUndefined();
    });
});


describe('Join channel', () => {
    let channel:Channel;
    let wsConnector:IFakeWsConnect;

    beforeEach(() => {
        wsConnector = new FakeWSConnector();
        wsConnector.isConnected = true;
        channel = new Channel({
            initialOffset: 1,
            initialPageSize: 1,
            socket: wsConnector,
            channelId: 'channelId',
        });
        channel.join();
    });

    it('after it, subscribe to New Messages', () => {
        expect(wsConnector.subscriptions[InBoundWsEvents.NewMessage].length).toBe(1);
    });

    it('after it, subscribe to MeJoinedToChannel events', () => {
        expect(wsConnector.subscriptions[InBoundWsEvents.MeJoinedToChannel].length).toBe(1);
    });

    it('after it, subscribe to Load more messages events', () => {
        expect(wsConnector.subscriptions[InBoundWsEvents.LoadMoreMessagesRes].length).toBe(1);
    });


});


describe('After join channel response', () => {
    let channel:Channel;
    let wsConnector:IFakeWsConnect;

    beforeEach(() => {
        wsConnector = new FakeWSConnector();
        wsConnector.isConnected = true;
        channel = new Channel({
            initialOffset: 1,
            initialPageSize: 1,
            socket: wsConnector,
            channelId: 'channelId',
        });
        channel.join();
    });

    it ('should be connection error is not success', () => {
        wsConnector.sendMessageFake({
            message: {
                $case: "meJoinedToChannel",
                meJoinedToChannel: {
                    isSuccess: false,
                }
            }
        })
        expect(channel.connectionState).toBe(ConnectionStates.ConnectionError)
    });

    it('should create me local participant if success', () => {
        wsConnector.sendMessageFake({
            message: {
                $case: "meJoinedToChannel",
                meJoinedToChannel: {
                    me: {
                        identifier: 'fakeId',
                    },
                    isSuccess: true,
                }
            }
        })

        expect(channel['localParticipant']).toBeTruthy();
    });

    it('should set messagesTotalCount', () => {
        const CHANNEL_MESSAGES_TOTAL_COUNT = 123;

        wsConnector.sendMessageFake({
            message: {
                $case: "meJoinedToChannel",
                meJoinedToChannel: {
                    me: {
                        identifier: 'fakeId',
                    },
                    isSuccess: true,
                    channel: {
                        channelId: 'fakeChannelId',
                        totalMessages: CHANNEL_MESSAGES_TOTAL_COUNT,
                        historyMessages: [],
                    }
                }
            }
        })

        expect(channel['messagesTotalCount']).toBe(CHANNEL_MESSAGES_TOTAL_COUNT);
    })


    it('should push messages to history list', () => {
        const CHANNEL_MESSAGES_TOTAL_COUNT = 123;

        const historyMessages = [FAKE_MESSAGE, {
            id: 'fakeId2',
            text: 'text2',
            channelIdentifier: 'fakeId2',
            type: MessageType.System,
            subType: MessageSubType.TextMessage,
            localId: 'localId2',
        }];

        wsConnector.sendMessageFake({
            message: {
                $case: "meJoinedToChannel",
                meJoinedToChannel: {
                    me: {
                        identifier: 'fakeId',
                    },
                    isSuccess: true,
                    channel: {
                        channelId: 'fakeChannelId',
                        totalMessages: CHANNEL_MESSAGES_TOTAL_COUNT,
                        historyMessages,
                    }
                }
            }
        })

        expect(channel['historyMessages'].length).toBe(historyMessages.length);
    });

    it('should set state to connected', () => {
        const CHANNEL_MESSAGES_TOTAL_COUNT = 123;

        wsConnector.sendMessageFake({
            message: {
                $case: "meJoinedToChannel",
                meJoinedToChannel: {
                    me: {
                        identifier: 'fakeId',
                    },
                    isSuccess: true,
                    channel: {
                        channelId: 'fakeChannelId',
                        totalMessages: CHANNEL_MESSAGES_TOTAL_COUNT,
                        historyMessages: [],
                    }
                }
            }
        })

        expect(channel['connectionState']).toBe(ConnectionStates.Connected);
    })
});

describe('After message publish', () => {
    let channel:Channel;
    let wsConnector:IFakeWsConnect;

    beforeAll(() => {
        wsConnector = new FakeWSConnector();
        wsConnector.isConnected = true;
        channel = new Channel({
            initialOffset: 1,
            initialPageSize: 1,
            socket: wsConnector,
            channelId: 'channelId',
        });
        channel.join();
    });

    it('should throw myLocalParticipantNotExistError if local participant not exist', async () => {
        expect.assertions(1);

        try {
            await channel.publishMessage({
                text: 'fakeText',
                customData: {},
            });
        } catch (e) {
            expect(e).toEqual(new MyLocalParticipantNotExistError());
        }
    });

    it ('should push new message to recent list if participant exist', async () => {
        wsConnector.sendMessageFake({
            message: {
                $case: "meJoinedToChannel",
                meJoinedToChannel: {
                    me: {
                        identifier: 'fakeId',
                    },
                    isSuccess: true,
                }
            }
        })

        const newMessageData = {
            text: "str2",
            customData: {}
        }

        await channel.publishMessage(newMessageData);

        expect(channel['recentMessages'].find((m) => m.message.message.text == newMessageData.text)).toBeTruthy()
    })
});

describe('After message publish response', () => {
    let channel:Channel;
    let wsConnector:IFakeWsConnect;

    beforeEach(() => {
        wsConnector = new FakeWSConnector();
        wsConnector.isConnected = true;
        channel = new Channel({
            initialOffset: 1,
            initialPageSize: 1,
            socket: wsConnector,
            channelId: 'channelId',
        });
        channel.join();
    });

    it('should throw myLocalParticipantNotExistError if local participant not exist', async () => {
        expect.assertions(1);

        try {
            await channel['onNewMessage'](FAKE_MESSAGE);
        } catch (e) {
            expect(e).toEqual(new MyLocalParticipantNotExistError());
        }
    });

    it('should ack my message in list', async () => {
       await wsConnector.sendMessageFake({
            message: {
                $case: "meJoinedToChannel",
                meJoinedToChannel: {
                    isSuccess: true,
                }
            }
        })

        const newMessageData = {
            text: "str2",
            customData: {}
        }

        await channel.publishMessage(newMessageData);

        await channel['onNewMessage'](FAKE_MESSAGE);

        const oldMessage = channel['recentMessages'].find((m) => m.message.message.id === FAKE_MESSAGE.id)
        expect(oldMessage?.message?.localMeta?.isAck).toBeTruthy()
    });
});

describe('After call load more messages', () => {
    let channel:Channel;
    let wsConnector:IFakeWsConnect;

    beforeEach(async () => {
        wsConnector = new FakeWSConnector();
        wsConnector.isConnected = true;
        channel = new Channel({
            initialOffset: 1,
            initialPageSize: 1,
            socket: wsConnector,
            channelId: 'channelId',
        });
        channel.join();
    });

    it('should set is loading to true if have more messages', async () => {
        await wsConnector.sendMessageFake({
            message: {
                $case: "meJoinedToChannel",
                meJoinedToChannel: {
                    isSuccess: true,
                    channel: {
                        channelId: "fakeChannelId",
                        historyMessages: [FAKE_MESSAGE, FAKE_MESSAGE, FAKE_MESSAGE, FAKE_MESSAGE],
                        totalMessages: 10,
                    }
                },
            }
        })

        channel.loadMoreMessages({
            pageSize: 10,
            skipFromFirstLoaded: 0,
        });
        expect(channel['isLoadingMore']).toBeTruthy();
    });

    it('should not set is loading if already all loaded in history', async () => {
        await wsConnector.sendMessageFake({
            message: {
                $case: "meJoinedToChannel",
                meJoinedToChannel: {
                    isSuccess: true,
                    channel: {
                        channelId: "fakeChannelId",
                        historyMessages: [FAKE_MESSAGE, FAKE_MESSAGE, FAKE_MESSAGE, FAKE_MESSAGE],
                        totalMessages: 4,
                    }
                },
            }
        });

        channel.loadMoreMessages({
            pageSize: 10,
            skipFromFirstLoaded: 0,
        });
        expect(channel['isLoadingMore']).toBeFalsy();
    })

    it('should not set is loading if already all loaded from history and recent', async () => {
        await wsConnector.sendMessageFake({
            message: {
                $case: "meJoinedToChannel",
                meJoinedToChannel: {
                    isSuccess: true,
                    channel: {
                        channelId: "fakeChannelId",
                        historyMessages: [FAKE_MESSAGE, FAKE_MESSAGE, FAKE_MESSAGE],
                        totalMessages: 4,
                    }
                },
            }
        });

        await channel['onNewMessage'](FAKE_MESSAGE);

        channel.loadMoreMessages({
            pageSize: 10,
            skipFromFirstLoaded: 0,
        });
        expect(channel['isLoadingMore']).toBeFalsy();
    });
});