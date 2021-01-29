import {
    ICommand,
    IExecuteProps,
    IOnMessageProps,
    Events,
} from '../interfaces/ICommand';
import * as fs from 'fs';
import * as path from 'path';
import { env, EnvBool } from '../env';
import { Sink } from '../kitchen/Sink';

type Constructor = Function & {
    keyword: string;
};

type dispatch = IOnMessageProps | IExecuteProps;

export interface ICommandParts {
    keyword: string;
    char: string;
    rest: string;
    message: string;
}

export class Command implements ICommand {
    async onMessage(props: IOnMessageProps): Promise<boolean> {
        return true;
    }

    onUserJoinedChannel?: () => boolean;
    onValidate?: () => boolean;
    onJoinVoice?: () => boolean;
    onLeaveVoice?: () => boolean;

    static get COMMAND_REGEXP_PATTERN(): RegExp {
        return new RegExp(`^(${Sink.escapeRegExp(env.CHAR)})([\\S\\d]+)(.*)`);
    }

    static _commands: Map<string, typeof Command>;
    static _events: Map<Events, typeof Command[]>;

    constructor() {
        return this;
    }

    async execute(props: IExecuteProps): Promise<boolean> {
        return true;
    }

    static get command(): Command {
        return new this();
    }

    get hidden(): boolean {
        return false;
    }

    get keyword(): string {
        const constructor = this.constructor as Constructor;
        return constructor.keyword;
    }

    static get keyword(): string {
        return this.name.toLowerCase();
    }

    static getCommands(): Map<string, typeof Command> {
        if (Command._commands) {
            return Command._commands;
        }

        Command._commands = new Map<string, typeof Command>();

        let commandDir = path.join(__dirname, '..', 'commands');
        const files = fs.readdirSync(commandDir);

        files.forEach((file) => {
            let filename = path.join(commandDir, file);
            let CommandAlias = require(filename).default as typeof Command;
            Command._commands.set(CommandAlias.keyword, CommandAlias);
        });

        return Command._commands;
    }

    static getEvents(): Map<Events, typeof Command[]> {
        if (!Command._commands) {
            Command.getCommands();
        }

        if (Command._events) {
            return Command._events;
        }

        Command._events = new Map<Events, typeof Command[]>();

        Command?._commands?.forEach((CommandAlias) => {
            CommandAlias?.subscribe?.forEach((event) => {
                if (!Command._events.has(event)) {
                    Command._events.set(event, []);
                }

                Command._events.get(event)?.push(CommandAlias);
            });
        });

        return Command._events;
    }

    static dispatchEvents(event: Events, props) {
        Command._events.get(event)?.forEach(async (CommandAlias) => {
            const cmd = new CommandAlias();
            await cmd[event]?.(props);
        });
    }

    static getCommandParts(message: string) {
        let returnParts: ICommandParts | void;
        const match = message.match(Command.COMMAND_REGEXP_PATTERN);

        if (match) {
            returnParts = {
                message: match[0],
                char: match[1].trim(),
                keyword: match[2].trim(),
                rest: match[3].trim(),
            };
        }

        return returnParts;
    }

    static get subscribe() {
        return [] as Events[];
    }
}
