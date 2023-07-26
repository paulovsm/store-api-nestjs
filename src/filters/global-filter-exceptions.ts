import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Response } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class GlobalFilterExceptions implements ExceptionFilter {
    constructor(private adapterHost: HttpAdapterHost) { }

    catch(exception: unknown, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();
        const { httpAdapter } = this.adapterHost;

        const { status, body } = exception instanceof HttpException
            ? {
                status: exception.getStatus(),
                body: exception.getResponse(),
            }
            : {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                body: {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    timestamp: new Date().toISOString(),
                    path: httpAdapter.getRequestUrl(request),
                },
            };

        httpAdapter.reply(response, body, status);
    }
}