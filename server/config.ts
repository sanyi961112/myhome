import * as env from 'good-env';

export const config = {
    port: env.getNumber('PORT', 3000),
};
