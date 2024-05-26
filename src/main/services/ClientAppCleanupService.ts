import { config, Logger } from '@ubio/framework';
import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';

export class ClientAppCleanupService {
    @config({ default: 180000 }) EXPIRY_TIME_MS!: number;
    @dep() private mongoDb!: MongoDb;
    @dep() logger!: Logger;

    protected get collection() {
        return this.mongoDb.db.collection('instances');
    }

    async startTask() {
        // run once immediately at startup to purge any dangling instances
        this.deleteExpiredInstances().catch((err: Error) => {
            throw new Error(`Instance cleanup failed: ${err.message}`);
        });

        setInterval(() => {
            this.deleteExpiredInstances().catch((err: Error) => {
                throw new Error(`Instance cleanup failed: ${err.message}`);
            });
        }, 10 * 1000);
    }

    async deleteExpiredInstances() {
        const cutoff = Date.now() - this.EXPIRY_TIME_MS;

        const result = await this.collection.deleteMany({
            updatedAt: { $lt: cutoff },
        });

        if (result.deletedCount > 0) {
            this.logger.info(`Deleted ${result.deletedCount} old documents.`);
        }
    }
}
