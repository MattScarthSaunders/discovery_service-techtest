import { Application } from '@ubio/framework';
import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';

import { InstanceRepo } from './repositories/InstanceRepo.js';
import { ClientAppRouter } from './routes/ClientAppRouter.js';
import { ClientAppCleanupService } from './services/ClientAppCleanupService.js';

export class App extends Application {
    @dep() private mongoDb!: MongoDb;

    override createGlobalScope() {
        const mesh = super.createGlobalScope();
        mesh.service(MongoDb);
        mesh.service(ClientAppCleanupService);
        return mesh;
    }

    override createHttpRequestScope() {
        const mesh = super.createHttpRequestScope();
        mesh.service(ClientAppRouter);
        mesh.service(InstanceRepo);
        return mesh;
    }

    override async beforeStart() {
        try {
            await this.mongoDb.start();
            this.logger.info(`Created DB: ${this.mongoDb.db.databaseName}`);
        } catch (err) {
            if (err instanceof Error) { throw new Error(err.message); }
        }

        await this.httpServer.startServer();
    }

    override async afterStop() {
        await this.httpServer.stopServer();

        await this.mongoDb.stop();
    }
}
