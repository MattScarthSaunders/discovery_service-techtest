import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';
import { ReturnDocument } from 'mongodb';

export class ClientAppRepo {
    @dep() mongoDb!: MongoDb;

    protected get collection() {
        return this.mongoDb.db.collection('groups');
    }

    async upsertAppInstance(
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

        const result = await this.collection.findOneAndUpdate(
            query,
            update,
            options
        );

        return result;
    }

    async getGroupSummary() {
        const result = await this.collection
            .aggregate([
                {
                    $group: {
                        _id: '$group',
                        instances: { $sum: 1 },
                        createdAt: { $min: '$createdAt' },
                        latestUpdatedAt: { $max: '$updatedAt' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        group: '$_id',
                        instances: 1,
                        createdAt: 1,
                        latestUpdatedAt: 1,
                    },
                },
            ])
            .toArray();

        return result;
    }

    async getGroup(group: string) {
        const result = this.collection
            .find({ group }, { projection: { _id: 0 } })
            .toArray();
        return result;
    }

    async deleteInstance(group: string, id: string) {
        const res = this.collection.deleteOne({ group, id });
        return res;
    }
}
