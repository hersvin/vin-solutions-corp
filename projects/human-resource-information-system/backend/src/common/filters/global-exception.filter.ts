import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();

    const correlationId =
      (request.headers['x-correlation-id'] as string | undefined) ?? undefined;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();

      response.status(status).json({
        code: status,
        message:
          typeof body === 'object' && body !== null
            ? ((body as Record<string, unknown>).message as string) ?? exception.message
            : exception.message,
        status,
        correlationId,
      });
      return;
    }

    this.logger.error(
      'Unhandled exception',
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(500).json({
      code: 'internal_error',
      message: 'Internal server error',
      status: 500,
      correlationId,
    });
  }
}
