import { Cascade, Collection, Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../models/BaseEntity';

@Entity()
export class KekMasterEntity extends BaseEntity {
    @Property()
    role_id: string;

    constructor(role_id: string) {
        super();
        this.role_id = role_id;
    }
}
