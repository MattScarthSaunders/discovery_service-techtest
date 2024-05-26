#!/usr/bin/env node
// eslint-disable-next-line simple-import-sort/imports
import 'reflect-metadata';
import { App } from '../main/app.js';
import { ClientAppCleanupService } from '../main/services/ClientAppCleanupService.js';

const app = new App();

try {
    await app.start();

    const cleanupService = app.mesh.resolve(ClientAppCleanupService);
    await cleanupService.startTask();
} catch (error: any) {
    app.logger.error('Failed to start', { error });
    process.exit(1);
}
