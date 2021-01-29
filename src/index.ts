import 'reflect-metadata';
import { env, envBoolValue } from './env';
import { Client } from 'discord.js';
import { Command } from './models/Command';
import { Logger } from './kitchen/Logger';
import { discordGenericEvents } from './kitchen/discordGenericEvents';
import { DB } from './db';
import {
    Events as Events,
    IOnMessageProps,
    IExecuteProps,
} from './interfaces/ICommand';

const commands = Command.getCommands();
const events = Command.getEvents();

let client = new Client();
client.on('message', async (message) => {
    const parts = Command.getCommandParts(message.cleanContent);

    const args = {
        message,
        commands,
        env,
        parts,
        logger: Logger,
        db: DB,
    };

    if (!message.author.bot) {
        Command.dispatchEvents(Events.onMessage, args as IOnMessageProps);
    }

    //not a command;
    if (!parts) return;
    //extremely not a command
    if (!commands.has(parts.keyword)) return;

    const CommandAlias = commands.get(parts.keyword);

    //so much not a command i shouldn't event be checking this.
    if (!CommandAlias) return;

    const instance = new CommandAlias();

    //like a command should have a way to execute
    if (!instance.execute) return;

    let bool = await instance.execute(args as IExecuteProps);
});

client.login(env.DISCORD_TOKEN);
discordGenericEvents(client);
