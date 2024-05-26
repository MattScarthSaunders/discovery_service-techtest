import { faker } from '@faker-js/faker';
import { MongoDb } from '@ubio/framework/modules/mongodb';
import { randomUUID } from 'crypto';
import { dep } from 'mesh-ioc';
import { ReturnDocument } from 'mongodb';

export class ClientAppSeed {
    private seedDate;
    @dep() private mongoDb!: MongoDb;

    constructor(dateMs: number = new Date('2020-01-01T12:00:00Z').getTime()) {
        this.seedDate = dateMs;
    }

    protected get collection() {
        return this.mongoDb.db.collection('instances');
    }

    private generateItems() {
        const controls = ['particle-accelerator', 'diplodocus-combinators'].map(
            (group: string) => ({
                group,
                id: randomUUID(),
                createdAt: this.seedDate,
                updatedAt: this.seedDate,
                meta: {},
            })
        );

        const randoms = Array.from({ length: 2 }, () => ({
            group: faker.internet.domainWord(),
            id: randomUUID(),
            createdAt: this.seedDate,
            updatedAt: this.seedDate,
            meta: {
                contact: faker.phone.number(),
            },
        }));

        return [...controls, ...randoms];
    }

    async run() {
        const firstSet = this.generateItems();
        const secondSet = this.generateItems();
        await this.collection.insertMany([...firstSet, ...secondSet]);
    }

    async clear() {
        await this.collection.drop();
    }

    async upsertSingle(
        group: string,
        id: string,
        additionalData: { [key: string]: any }
    ) {
        const query = { group, id };

        const update = {
            $set: {
                id,
                group,
                meta: additionalData,
                updatedAt: Date.now(),
            },
            $setOnInsert: { createdAt: Date.now() },
        };

        const options = {
            upsert: true,
            returnOriginal: false,
            returnDocument: ReturnDocument.AFTER,
            projection: { _id: 0 },
        };

        await this.collection.findOneAndUpdate(query, update, options);
    }
}
