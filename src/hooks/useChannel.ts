import { useState } from 'react';
import { IChannelArgs } from '../hooks/types/channel';

//:TODO move react hooks to separate library
export const useChannel = (args:IChannelArgs) =>  {
    const [socketId, setSocketId] = useState('helloWorldId');
    console.log(args);

    return socketId;
}
