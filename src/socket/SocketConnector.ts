import Config from '../config/Config';
import logger from '../config/logger';

export class SocketConnector {
    public openConnection () {
        logger.info('open connection');
        logger.info(Config.url);
    }
}
