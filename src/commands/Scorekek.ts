import { IExecuteProps, IOnMessageProps, Events } from '../interfaces/ICommand';
import { Command } from '../models/Command';
import { KekeeEntity } from '../entities/KekeeEntity';
import { env } from './../env';

export default class Scorekek extends Command {
    async execute({ message, parts, db }: IExecuteProps): Promise<boolean> {
        const { mentions } = message;

        if (mentions === null || mentions.members == null) return false;

        const who = mentions.members.first();
        if (!who) return false;

        let kekee = await db.em.findOne(KekeeEntity, {
            member_id: who.id,
        });

        if (kekee && kekee.keepscore) {
            await message.channel.send(
                `${who.displayName}'s score is already being kept`
            );

            return false;
        }

        if (!kekee) {
            kekee = new KekeeEntity(who.id);
            kekee.score = 0;
        }

        await message.channel.send(`${who.displayName} kek score will now be kept`);
        kekee.keepscore = true;
        await db.em.persistAndFlush([kekee]);

        return true;
    }
}
