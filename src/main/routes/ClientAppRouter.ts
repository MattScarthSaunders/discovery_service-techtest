import {
    BodyParam,
    Delete,
    Get,
    PathParam,
    Post,
    Router,
} from '@ubio/framework';
import { dep } from 'mesh-ioc';

import { ClientAppRepo } from '../repositories/ClientAppRepo.js';
import {
    ClientAppResponse,
    GroupResponse,
    GroupSummaryResponse,
    MetaData,
} from '../schema/Response.js';

export class ClientAppRouter extends Router {
    @dep() groups!: ClientAppRepo;

    @Post({
        path: '/{group}/{id}',
        summary: 'Upsert a client app instance',
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
        meta: MetaData
    ) {
        const res = await this.groups.upsertAppInstance(group, id, meta);
        this.ctx.status = 201;
        return res;
    }

    @Get({
        path: '/',
        summary: 'Get a summary list of all instance groups.',
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
        summary: 'Get a list of all instances in a group.',
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

    @Delete({
        path: '/{group}/{id}',
        summary: 'Delete a given instance from a group.',
    })
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
