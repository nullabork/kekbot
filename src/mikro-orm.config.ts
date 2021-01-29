import { Options } from '@mikro-orm/core';
import { env, envBoolValue as envBool } from './env';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import * as entities from './entities';

const config: Options = {
    type: 'sqlite',
    dbName: env.DB_NAME,
    // as we are using class references here, we don't need to specify `entitiesTs` option
    entities: Object.values(entities),
    highlighter: new SqlHighlighter(),
    debug: envBool((e) => e.DB_DEBUG),
};

export default config;
