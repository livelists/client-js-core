import { ListLoader } from '../../../services/channel/ListLoader';
import { FakeEmitter } from '../../fakes/EventEmitter.fake';

describe('', () => {
    let listLoader:ListLoader;

    beforeEach(() => {
        listLoader = new ListLoader(new FakeEmitter());
    })
})