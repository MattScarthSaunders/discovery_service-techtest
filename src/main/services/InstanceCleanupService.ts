import { config, Logger } from '@ubio/framework';
import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';

export class InstanceCleanupService {
    @config({ default: 180000 }) EXPIRY_TIME_MS!: number;
    @dep() private mongoDb!: MongoDb;
    @dep() logger!: Logger;

    protected get collection() {
        return this.mongoDb.db.collection('instances');
    }

    private cleanupIntervalId: NodeJS.Timeout | null = null;

    async startTask() {
        this.cleanupIntervalId = setInterval(async () => {
            await this.deleteExpiredInstances();
        }, 10 * 1000);
    }

    stopTask() {
        if (this.cleanupIntervalId) {
            clearInterval(this.cleanupIntervalId);
            this.cleanupIntervalId = null;
        }
    }

    async deleteExpiredInstances() {
        try {
            const cutoff = Date.now() - this.EXPIRY_TIME_MS;

            const result = await this.collection.deleteMany({
                updatedAt: { $lt: cutoff },
            });

            if (result.deletedCount > 0) {
                this.logger.info(
                    `Deleted ${result.deletedCount} old documents.`
                );
            }
        } catch (err) {
            if (err instanceof Error) {
                this.logger.error(`Instance cleanup failed: ${err.message}`);
            }
        }
    }
}
