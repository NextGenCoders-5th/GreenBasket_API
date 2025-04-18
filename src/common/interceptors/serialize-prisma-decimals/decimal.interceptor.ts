import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Decimal } from '@prisma/client/runtime/library';

function convertDecimalsAndDates(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertDecimalsAndDates);
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        if (value instanceof Decimal) {
          return [key, value.toNumber()];
        }
        if (value instanceof Date) {
          return [key, value.toISOString()];
        }
        return [key, convertDecimalsAndDates(value)];
      }),
    );
  }
  return obj;
}

@Injectable()
export class DecimalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => convertDecimalsAndDates(data)));
  }
}
