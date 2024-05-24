import { Application } from '@ubio/framework';
import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';

export class App extends Application {
    @dep() private mongoDb!: MongoDb;

    override createGlobalScope() {
        const mesh = super.createGlobalScope();

        mesh.service(MongoDb);

        return mesh;
    }

    override createHttpRequestScope() {
        const mesh = super.createHttpRequestScope();
        return mesh;
    }

    override async beforeStart() {
        try {
            await this.mongoDb.start();
            this.logger.info(`Created DB: ${this.mongoDb.db.databaseName}`);
        } catch (err) {
            this.logger.error(
                'Failed to create database. Is the container running?'
            );
        }

        await this.httpServer.startServer();
    }

    override async afterStop() {
        await this.httpServer.stopServer();

        await this.mongoDb.db.dropDatabase();

        this.logger.info(`Dropped DB: ${this.mongoDb.db.databaseName}`);
        this.mongoDb.stop();
    }
}
