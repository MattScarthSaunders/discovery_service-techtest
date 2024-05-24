import {
    BodyParam,
    Delete,
    Get,
    PathParam,
    Post,
    Router,
} from '@ubio/framework';
import { dep } from 'mesh-ioc';

import { ClientAppsRepo } from '../repositories/ClientAppsRepo.js';
import {
    ClientAppResponse,
    GroupResponse,
    GroupSummaryResponse,
} from '../schema/Response.js';

export class ClientAppRouter extends Router {
    @dep() groups!: ClientAppsRepo;

    @Post({
        path: '/{group}/{id}',
        responses: {
            201: {
                schema: ClientAppResponse.schema,
            },
        },
    })
    async postInstance(
        @PathParam('group', { schema: { type: 'string' } }) group: string,
        @PathParam('id', { schema: { type: 'string', format: 'uuid' } })
        id: string,
        @BodyParam('meta', { schema: { type: 'object' } })
        meta: { [key: string]: any }
    ) {
        const res = await this.groups.upsertAppInstance(group, id, meta);
        this.ctx.status = 201;
        return res;
    }

    @Get({
        path: '/',
        responses: {
            200: {
                schema: GroupSummaryResponse.schema,
            },
        },
    })
    async getGroupSummary() {
        return this.groups.getGroupSummary();
    }

    @Get({
        path: '/{group}',
        responses: {
            200: {
                schema: GroupResponse.schema,
            },
        },
    })
    async getGroup(
        @PathParam('group', { schema: { type: 'string' } }) group: string
    ) {
        return this.groups.getGroup(group);
    }

    @Delete({ path: '/{group}/{id}' })
    async deleteInstance(
        @PathParam('group', { schema: { type: 'string' } }) group: string,
        @PathParam('id', { schema: { type: 'string', format: 'uuid' } })
        id: string
    ) {
        const res = await this.groups.deleteInstance(group, id);

        if (res.deletedCount === 0) {
            this.ctx.status = 404;
        } else {
            this.ctx.status = 204;
        }
    }
}
