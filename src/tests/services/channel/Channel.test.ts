import {Channel, ConnectionStates, Message, Message as MessagePB, ParticipantShortInfo} from '../../..';
import { FakeWSConnector, IFakeWsConnect } from '../../WsConnector.fake';
import {InBoundWsEvents} from "../../../common/const/SocketEvents";
import {CustomData, MessageSubType, MessageType} from "../../../proto/models";
import {LoadMoreMessagesError, MyLocalParticipantNotExistError} from "../../../services/channel/errors";

const ME_PARTICIPANT_ID = 'meParticipantId';

const FAKE_MESSAGE:MessagePB = {
    id: 'fakeId',
    text: 'text',
    channelIdentifier: 'fakeId',
    type: MessageType.ParticipantCreated,
    subType: MessageSubType.TextMessage,
    localId: 'localId',
}

const FAKE_MY_MESSAGE:MessagePB = {
    id: 'fakeId',
    text: 'text',
    channelIdentifier: 'fakeId',
    sender: {
        identifier: ME_PARTICIPANT_ID,
        isOnline: false,
    },
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

    it('Not seen counter should init in start', () => {
        expect(channel.notSeenCounter).toBeTruthy()
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
                        identifier: ME_PARTICIPANT_ID,
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
                        identifier: ME_PARTICIPANT_ID,
                    },
                    isSuccess: true,
                    channel: {
                        channelId: 'fakeChannelId',
                        totalMessages: CHANNEL_MESSAGES_TOTAL_COUNT,
                        historyMessages: [],
                        notSeenMessagesCount: 2,
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
                        identifier: ME_PARTICIPANT_ID,
                    },
                    isSuccess: true,
                    channel: {
                        channelId: 'fakeChannelId',
                        totalMessages: CHANNEL_MESSAGES_TOTAL_COUNT,
                        historyMessages,
                        notSeenMessagesCount: 2,
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
                        identifier: ME_PARTICIPANT_ID,
                    },
                    isSuccess: true,
                    channel: {
                        channelId: 'fakeChannelId',
                        totalMessages: CHANNEL_MESSAGES_TOTAL_COUNT,
                        historyMessages: [],
                        notSeenMessagesCount: 2,
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
                        identifier: ME_PARTICIPANT_ID,
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
                    me: {
                        identifier: ME_PARTICIPANT_ID,
                    }
                },
            }
        })

        const newMessageData = {
            text: "str2",
            customData: {}
        }

        await channel.publishMessage(newMessageData);

        channel['onNewMessage'](FAKE_MY_MESSAGE);

        const oldMessage = channel['recentMessages'].find((m) => m.message.message.localId === FAKE_MESSAGE.localId)
        expect(oldMessage?.message?.localMeta?.isAck).toBeTruthy();
        expect(channel['recentMessages'].length).toBe(1);
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
                        notSeenMessagesCount: 2,
                    },
                    me: {
                        identifier: ME_PARTICIPANT_ID,
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
                        notSeenMessagesCount: 2,
                    },
                    me: {
                        identifier: ME_PARTICIPANT_ID,
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

    it('should set is loading if total count incremented by foreign message', async () => {
        await wsConnector.sendMessageFake({
            message: {
                $case: "meJoinedToChannel",
                meJoinedToChannel: {
                    isSuccess: true,
                    channel: {
                        channelId: "fakeChannelId",
                        historyMessages: [FAKE_MESSAGE, FAKE_MESSAGE, FAKE_MESSAGE],
                        totalMessages: 4,
                        notSeenMessagesCount: 2,
                    },
                    me: {
                        identifier: ME_PARTICIPANT_ID,
                    }
                },
            }
        });

        await channel['onNewMessage'](FAKE_MESSAGE);

        channel.loadMoreMessages({
            pageSize: 10,
            skipFromFirstLoaded: 0,
        });
        expect(channel['isLoadingMore']).toBeTruthy();
    });
});

describe('Messages total count', () => {
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

    it('should set count from response', async () => {
        const TOTAL_COUNT = 10;

        await wsConnector.sendMessageFake({
            message: {
                $case: "meJoinedToChannel",
                meJoinedToChannel: {
                    isSuccess: true,
                    channel: {
                        channelId: "fakeChannelId",
                        historyMessages: [FAKE_MESSAGE, FAKE_MESSAGE, FAKE_MESSAGE, FAKE_MESSAGE],
                        totalMessages: TOTAL_COUNT,
                        notSeenMessagesCount: 2,
                    },
                    me: {
                        identifier: ME_PARTICIPANT_ID,
                    }
                },
            }
        });

        expect(channel['messagesTotalCount']).toBe(TOTAL_COUNT);
    });

    it('should increment after me message publish (before received response)', async () => {
        const TOTAL_COUNT = 10;

        await wsConnector.sendMessageFake({
            message: {
                $case: "meJoinedToChannel",
                meJoinedToChannel: {
                    isSuccess: true,
                    channel: {
                        channelId: "fakeChannelId",
                        historyMessages: [FAKE_MESSAGE, FAKE_MESSAGE, FAKE_MESSAGE, FAKE_MESSAGE],
                        totalMessages: TOTAL_COUNT,
                        notSeenMessagesCount: 2,
                    },
                    me: {
                        identifier: ME_PARTICIPANT_ID,
                    }
                },
            }
        });

        const newMessageData = {
            text: "str2",
            customData: {}
        }

        await channel.publishMessage(newMessageData);

        expect(channel['messagesTotalCount']).toBe(TOTAL_COUNT + 1);
    });

    it('should increment if foreign message received', async () => {
        await wsConnector.sendMessageFake({
            message: {
                $case: "meJoinedToChannel",
                meJoinedToChannel: {
                    isSuccess: true,
                    me: {
                        identifier: ME_PARTICIPANT_ID,
                    }
                },
            }
        });

        await channel['onNewMessage'](FAKE_MESSAGE);

        expect(channel['messagesTotalCount']).toBe(1)
    });

    it('should not double increment if my message response received', async () => {
        await wsConnector.sendMessageFake({
            message: {
                $case: "meJoinedToChannel",
                meJoinedToChannel: {
                    isSuccess: true,
                    me: {
                        identifier: ME_PARTICIPANT_ID,
                    }
                },
            }
        });

        const newMessageData = {
            text: "str2",
            customData: {}
        }

        await channel.publishMessage(newMessageData);

        const newMessageLocalId = channel['recentMessages'][0].message.message.localId;

        const myFakeMessageWithCurrentLocalId = {
            ...FAKE_MY_MESSAGE,
            localId: newMessageLocalId,
        }
        await channel['onNewMessage'](myFakeMessageWithCurrentLocalId);

        expect(channel['messagesTotalCount']).toBe(1)
    });
});


describe('After load messages response', () => {
    let channel:Channel;
    let wsConnector:IFakeWsConnect;
    const TOTAL_COUNT = 10;

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

        await wsConnector.sendMessageFake({
            message: {
                $case: "meJoinedToChannel",
                meJoinedToChannel: {
                    isSuccess: true,
                    channel: {
                        channelId: "fakeChannelId",
                        historyMessages: [FAKE_MESSAGE, FAKE_MESSAGE, FAKE_MY_MESSAGE, FAKE_MESSAGE, FAKE_MESSAGE],
                        totalMessages: TOTAL_COUNT,
                        notSeenMessagesCount: 2,
                    },
                    me: {
                        identifier: ME_PARTICIPANT_ID,
                    }
                },
            }
        });
    });

    it('should throw error if not success', () => {
        expect(() => channel['onLoadMoreMessagesRes']({
            isSuccess: false,
            totalMessages: 0,
            messages: [],
        })).toThrow(LoadMoreMessagesError)
    });

    it('should set total messages count from response if success', () => {
        const MESSAGES_TOTAL_COUNT = 12;

        channel['onLoadMoreMessagesRes']({
            isSuccess: true,
            totalMessages: MESSAGES_TOTAL_COUNT,
            messages: [],
        });

        expect(channel['messagesTotalCount']).toBe(MESSAGES_TOTAL_COUNT)
    });

    it('should set is loading more to false if success', () => {
        channel['onLoadMoreMessagesRes']({
            isSuccess: true,
            totalMessages: 2,
            messages: [],
        });

        expect(channel['isLoadingMore']).toBe(false)
    });

    it('should push messages to history list', () => {
        const tempHistoryMessagesLength = channel['historyMessages'].length;

        const responseMessages = [FAKE_MESSAGE, FAKE_MESSAGE, FAKE_MY_MESSAGE];

        channel['onLoadMoreMessagesRes']({
            isSuccess: true,
            totalMessages: 2,
            messages: responseMessages,
        });

        expect(channel['historyMessages'].length).toBe(tempHistoryMessagesLength + responseMessages.length)
    });
});