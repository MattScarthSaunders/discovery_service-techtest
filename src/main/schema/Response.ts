import { Schema } from '@ubio/framework';

export interface MetaData {
    [key: string]: any;
}

export interface ClientApp {
    id: string;
    group: string;
    createdAt: number;
    updatedAt: number;
    meta: MetaData;
}

export const MetaData = new Schema<MetaData>({
    schema: {
        type: 'object',
        properties: {},
    },
});

export const ClientAppResponse = new Schema<ClientApp>({
    schema: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            group: { type: 'string' },
            createdAt: { type: 'number' },
            updatedAt: { type: 'number' },
            meta: MetaData.schema,
        },
    },
});

export const GroupResponse = new Schema<ClientApp[]>({
    schema: {
        type: 'array',
        items: {
            type: 'object',
            properties: ClientAppResponse.schema.properties,
        },
    },
});

export interface GroupSummary {
    group: string;
    instances: number;
    createdAt: number;
    lastUpdatedAt: number;
}

export const GroupSummaryResponse = new Schema<GroupSummary[]>({
    schema: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                group: { type: 'string' },
                instances: { type: 'number' },
                createdAt: { type: 'number' },
                lastUpdatedAt: { type: 'number' },
            },
        },
    },
});
