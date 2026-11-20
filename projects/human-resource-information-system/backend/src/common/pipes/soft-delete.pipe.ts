import { PipeTransform } from '@nestjs/common';

// SoftDeletePipe (MVP stub):
// In production this would inject `deleted_at IS NULL` into all
// repository query options for entities that extend SoftDeletableEntity,
// ensuring that soft-deleted rows are never returned by default queries.
// Currently this is a pass-through placeholder.
export class SoftDeletePipe implements PipeTransform {
  transform<T>(value: T): T {
    return value;
  }
}
