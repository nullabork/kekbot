import { Cascade, Collection, Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../models/BaseEntity';

@Entity()
export class KekeeEntity extends BaseEntity {
    @Property()
    member_id: string;

    @Property()
    count: number = 0;

    @Property()
    track: boolean = false;

    constructor(member_id: string) {
        super();
        this.member_id = member_id;
    }
}
