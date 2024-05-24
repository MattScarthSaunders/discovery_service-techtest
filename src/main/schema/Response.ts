import { Schema } from '@ubio/framework';

export interface ClientApp {
    id: string;
    group: string;
    createdAt: number;
    updatedAt: number;
    meta: {
        [key: string]: any;
    };
}

export const ClientAppResponse = new Schema<ClientApp>({
    schema: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            group: { type: 'string' },
            createdAt: { type: 'number' },
            updatedAt: { type: 'number' },
            meta: { type: 'object', properties: {} },
        },
        required: ['id', 'group'],
    },
});
