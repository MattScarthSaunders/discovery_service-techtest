import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';
import { ReturnDocument } from 'mongodb';

export class InstanceRepo {
    @dep() mongoDb!: MongoDb;

    protected get collection() {
        return this.mongoDb.db.collection('instances');
    }

    async upsertInstance(
        group: string,
        id: string,
        additionalData: { [key: string]: any }
    ) {
        const result = await this.collection.findOneAndUpdate(
            { group, id },
            {
                $set: {
                    id,
                    group,
                    meta: additionalData,
                    updatedAt: Date.now(),
                },
                $setOnInsert: { createdAt: Date.now() },
            },
            {
                upsert: true,
                returnDocument: ReturnDocument.AFTER,
                projection: { _id: 0 },
            }
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

    async getInstancesByGroup(group: string) {
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
