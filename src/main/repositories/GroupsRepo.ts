import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';
import { ReturnDocument } from 'mongodb';

export class GroupsRepo {
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
}
