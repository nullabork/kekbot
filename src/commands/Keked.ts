import { IExecuteProps, IOnMessageProps, Events } from '../interfaces/ICommand';
import { Command } from '../models/Command';
import { KekeeEntity } from '../entities/KekeeEntity';
import { env } from './../env';

export default class Keked extends Command {
    async execute({ message, parts, db }: IExecuteProps): Promise<boolean> {
        const { mentions } = message;

        if (mentions === null || mentions.members == null) return false;

        const who = mentions.members.first();
        if (!who) return false;

        let kekee = await db.em.findOne(KekeeEntity, {
            member_id: who.id,
        });

        message.channel.send(
            `${who.displayName} has been keked ${kekee?.count || 0} times`
        );

        return true;
    }

    async onMessage({ message, db }: IOnMessageProps) {
        const { member, author, guild } = message;

        if (member === null) return false;

        let kekee = await db.em.findOne(KekeeEntity, {
            member_id: member.id,
        });

        if (!kekee || !kekee.track) {
            return false;
        }

        kekee.count += 1;
        await message.react(env.KEK_EMOJI);
        await db.em.persistAndFlush([kekee]);
        return true;
    }

    static get subscribe() {
        return [Events.onMessage];
    }
}
