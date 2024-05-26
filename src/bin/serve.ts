#!/usr/bin/env node
// eslint-disable-next-line simple-import-sort/imports
import 'reflect-metadata';
import { App } from '../main/app.js';
import { InstanceCleanupService } from '../main/services/InstanceCleanupService.js';

const app = new App();

try {
    await app.start();

    const cleanupService = app.mesh.resolve(InstanceCleanupService);

    // purge any dangling instances from previous runs
    await cleanupService.deleteExpiredInstances();
    await cleanupService.startTask();
} catch (error: any) {
    app.logger.error('Failed to start', { error });
    process.exit(1);
}
