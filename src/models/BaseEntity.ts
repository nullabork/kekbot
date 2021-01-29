import * as fs from 'fs';
import * as path from 'path';
import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class BaseEntity {
    static _entities: Map<string, typeof BaseEntity>;

    @PrimaryKey()
    id!: number;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
