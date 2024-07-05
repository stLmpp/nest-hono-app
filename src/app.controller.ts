import {
  Controller,
  Delete,
  Get,
  Head,
  Options,
  Patch,
  Post,
  Put,
  Headers,
  Ip,
  Query,
  Param,
} from '@nestjs/common';
import { ParamIntSchema, ZBody, ZParams, ZQuery, ZRes } from '@st-api/core';
import { z } from 'zod';

const ResponseSchema = z.object({
  params: z.record(z.string(), z.unknown()),
  query: z.record(z.string(), z.unknown()),
  headers: z.record(z.string(), z.unknown()),
  body: z.record(z.string(), z.unknown()).optional(),
  ip: z.string().optional(),
});
type ResponseType = z.input<typeof ResponseSchema>;

const ParamsSchema = z.object({
  id: ParamIntSchema.openapi({
    example: 1,
  }),
});
type ParamsType = z.output<typeof ParamsSchema>;

const BodySchema = z.object({
  name: z.string().optional(),
});
type BodyType = z.output<typeof BodySchema>;

const QuerySchema = z.object({
  filter: z.string().optional(),
});
type QueryType = z.output<typeof QuerySchema>;

@Controller()
export class AppController {
  @ZRes(ResponseSchema)
  @Get('/:id')
  async get(
    @Param() params: ParamsType,
    @ZQuery(QuerySchema) query: QueryType,
    @Headers() headers: Record<string, unknown>,
    @Ip() ip: string,
  ): Promise<ResponseType> {
    return {
      params,
      query,
      headers,
      ip,
    };
  }

  @ZRes(ResponseSchema)
  @Options('/:id')
  async options(
    @ZParams(ParamsSchema) params: ParamsType,
    @ZQuery(QuerySchema) query: QueryType,
    @Headers() headers: Record<string, unknown>,
  ): Promise<ResponseType> {
    return {
      params,
      query,
      headers,
    };
  }

  @ZRes(ResponseSchema)
  @Head('/:id')
  async head(
    @ZParams(ParamsSchema) params: ParamsType,
    @ZQuery(QuerySchema) query: QueryType,
    @Headers() headers: Record<string, unknown>,
  ): Promise<ResponseType> {
    return {
      params,
      query,
      headers,
    };
  }

  @ZRes(ResponseSchema)
  @Post('/:id')
  async post(
    @ZParams(ParamsSchema) params: ParamsType,
    @ZQuery(QuerySchema) query: QueryType,
    @ZBody(BodySchema) body: BodyType,
    @Headers() headers: Record<string, unknown>,
  ): Promise<ResponseType> {
    return {
      params,
      query,
      body,
      headers,
    };
  }

  @ZRes(ResponseSchema)
  @Patch('/:id')
  async patch(
    @ZParams(ParamsSchema) params: ParamsType,
    @ZQuery(QuerySchema) query: QueryType,
    @ZBody(BodySchema) body: BodyType,
    @Headers() headers: Record<string, unknown>,
  ): Promise<ResponseType> {
    return {
      params,
      query,
      body,
      headers,
    };
  }

  @ZRes(ResponseSchema)
  @Put('/:id')
  async put(
    @ZParams(ParamsSchema) params: ParamsType,
    @ZQuery(QuerySchema) query: QueryType,
    @ZBody(BodySchema) body: BodyType,
    @Headers() headers: Record<string, unknown>,
  ): Promise<ResponseType> {
    return {
      params,
      query,
      body,
      headers,
    };
  }

  @ZRes(ResponseSchema)
  @Delete('/:id')
  async delete(
    @ZParams(ParamsSchema) params: ParamsType,
    @ZQuery(QuerySchema) query: QueryType,
    @Headers() headers: Record<string, unknown>,
  ): Promise<ResponseType> {
    return {
      params,
      query,
      headers,
    };
  }
}
