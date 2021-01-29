import * as dotenv from 'dotenv';
import { DotenvParseOutput } from 'dotenv/types';
import * as kindOf from 'kind-of';

export const enum EnvBool {
    ON = 'ON',
    OFF = 'OFF',
    //bah just to account for lower casing
    //who cares about off if its not ON|on, it's off
    on = 'on',
}

export const envBoolValue = (bool: props): boolean => {
    if (kindOf(bool) == 'function') {
        bool = (bool as FuncType)(env);
    }
    return bool === EnvBool.ON || bool === EnvBool.on;
};

export interface IEnv extends DotenvParseOutput {
    BOT_NAME: string;
    DISCORD_TOKEN: string;
    CHAR: string;
    LOG_INFO: EnvBool;
    LOG_WARN: EnvBool;
    LOG_ERROR: EnvBool;
    DB: EnvBool;
    DB_NAME: string;
    DB_DEBUG: EnvBool;
    KEK_EMOJI: string;
}

export const env = dotenv.config().parsed as IEnv;

type FuncType = (env: IEnv) => EnvBool;
type props = EnvBool | FuncType;
