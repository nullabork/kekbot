import { Client } from 'discord.js';
import { Logger } from './Logger';
import * as figlet from 'figlet';
import { env } from '../env';

export const discordGenericEvents = (client: Client) => {
    client.on('ready', () => {
        console.log(
            figlet.textSync(env.BOT_NAME, {
                font: 'Ghost',
                horizontalLayout: 'default',
                verticalLayout: 'default',
                width: 180,
                whitespaceBreak: true,
            })
        );
        Logger.info('Ready');
    });

    client.on('error', Logger.error);
    client.on('guildUnavailable', Logger.warn);
    client.on('rateLimit', Logger.error);
    client.on('reconnecting', Logger.info);
    client.on('resume', Logger.info);
    client.on('warn', Logger.warn);
    client.on('disconnect', Logger.info);
    process.on('uncaughtException', Logger.error);
};
