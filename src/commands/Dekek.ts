import { IExecuteProps, IOnMessageProps, Events } from '../interfaces/ICommand';
import { Command } from '../models/Command';
import { KekeeEntity } from '../entities/KekeeEntity';
import { env } from './../env';

export default class Dekek extends Command {
    async execute({ message, parts, db }: IExecuteProps): Promise<boolean> {
        const { mentions } = message;

        if (mentions === null || mentions.members == null) return false;

        const who = mentions.members.first();
        if (!who) return false;

        let kekee = await db.em.findOne(KekeeEntity, {
            member_id: who.id,
        });

        if (kekee && kekee.track) {
            await message.channel.send(
                `${who.displayName} will not be keked anymore!`
            );
            kekee.track = false;
            await db.em.persistAndFlush([kekee]);
        } else {
            await message.channel.send(`${who.displayName} is not being keked`);
        }

        return true;
    }
}
