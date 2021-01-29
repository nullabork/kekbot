import { Message } from 'discord.js';
import { Command, ICommandParts } from '../models/Command';
import { IEnv } from '../env';
import { Logger } from '../kitchen/Logger';
import { DBI } from '../db';

export const enum Template {
    DefaultHTML = 'default.html',
    MemeHTML = 'meme.html',
}

export const enum FrameType {
    Image = 'IMAGE',
    Text = 'TEXT',
    Static = 'STATIC',
}

export interface FrameInterface {
    type: FrameType;
    x?: number;
    y?: number;
    width: number;
    height: number;
    angle: number;

    background?: string;
    color?: string;
    shadow?: string;
    strokeSize?: string;
    strokeColor?: string;
    css?: string;

    value?: string;
}

export interface IExecuteProps {
    message: Message;
    commands: Map<string, typeof Command>;
    env: IEnv;
    parts: ICommandParts;
    logger: typeof Logger;
    db: DBI;
}

export interface IOnMessageProps extends IExecuteProps {}

export const enum Events {
    onMessage = 'onMessage',
    onUserJoinedChannel = 'onUserJoinedChannel',
    onValidate = 'onValidate',
    onJoinVoice = 'onJoinVoice',
    onLeaveVoice = 'onLeaveVoice',
}

export interface ICommand {
    keyword: string;
    template?: Template;
    frames?: FrameInterface[];
}
