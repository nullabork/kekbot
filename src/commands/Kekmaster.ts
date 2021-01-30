import { IExecuteProps, IOnMessageProps, Events } from '../interfaces/ICommand';
import { Command } from '../models/Command';
import { KekMasterEntity } from '../entities/KekMasterEntity';
import { env } from './../env';

export default class Kekmaster extends Command {
    async execute({ message, parts, db }: IExecuteProps): Promise<boolean> {
        const { mentions } = message;

        if (mentions === null || mentions == null) return false;

        const who = mentions.members.first();
        if (!who) return false;

        let kekee = await db.em.findOne(KekMasterEntity, {
            member_id: who.id,
        });

        if (kekee && kekee.track) {
            await message.channel.send(
                `${who.displayName} is already being keked`
            );

            return false;
        }

        if (!kekee) {
            kekee = new KekMasterEntity(who.id);
            kekee.count = 0;
        }

        await message.channel.send(`${who.displayName} will now be keked`);
        kekee.track = true;
        await db.em.persistAndFlush([kekee]);

        return true;
    }
}
