import * as chalk from 'chalk';
import { env, envBoolValue as envBool } from '../env';
import * as kindOf from 'kind-of';

const log = console?.log;

export const enum LoggingLevel {
    NONE = 'NONE',
    ALL = 'ALL',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

export class Logger {
    static info(...message: any[]) {
        Logger.log(message, LoggingLevel.INFO);
    }

    static warn(...message: any[]) {
        Logger.log(message, LoggingLevel.WARN);
    }

    static error(...message: any[]) {
        Logger.log(message, LoggingLevel.ERROR);
    }

    static log(message: any | any[], logLevel: LoggingLevel) {
        if (env.LOGGING_LEVEL === LoggingLevel.NONE) {
            return;
        }

        const noLogging =
            (!envBool((e) => e.LOG_INFO) && logLevel == LoggingLevel.INFO) ||
            (!envBool((e) => e.LOG_WARN) && logLevel == LoggingLevel.WARN) ||
            (!envBool((e) => e.LOG_ERROR) && logLevel == LoggingLevel.ERROR);

        if (noLogging) return;

        Logger.color(message, logLevel);
    }

    static colors = {
        //prefixColor, timeColor, messageColor
        [LoggingLevel.INFO]: [chalk.black.bgCyan, chalk.cyan, chalk.white],
        [LoggingLevel.WARN]: [chalk.black.bgYellow, chalk.yellow, chalk.white],
        [LoggingLevel.ERROR]: [chalk.black.bgRed, chalk.red, chalk.white],
    };

    static color(message: any | any[], level: LoggingLevel) {
        if (!log) return;

        message = Logger.getString(message);

        let colorFuncs: chalk.Chalk[] = Logger.colors[level];

        let prefixStr = level ? colorFuncs[0](` ${level} `) : '';
        let timeStr = colorFuncs[1](`${new Date().toUTCString()}`);

        let prefixJoiner = level && timeStr ? ' :: ' : '';
        let messageStr = colorFuncs[2](message.trim());
        let divider = colorFuncs[2]('—————————————————————————————————————');

        log(
            `${prefixStr}${prefixJoiner}${timeStr}\n${divider}\n${messageStr}\n`
        );
    }

    static getString(obj: any) {
        if (kindOf(obj) === 'number') return obj.toString();
        if (kindOf(obj) === 'string') return obj;
        if (kindOf(obj) === 'object' && obj.stack) return obj.stack;
        if (
            kindOf(obj) === 'object' &&
            obj.toString &&
            /\[[\S\d]+\s[\S\d]+\]/.test(obj.toString())
        )
            return obj.toString();

        if (kindOf(obj) === 'object') return JSON.stringify(obj);
        if (kindOf(obj) === 'array') {
            const ary = obj as any[];

            return ary.reduce((acc: string, curr: any) => {
                return `${acc}\n${Logger.getString(curr)}`;
            }, '');
        }

        return obj;
    }
}
