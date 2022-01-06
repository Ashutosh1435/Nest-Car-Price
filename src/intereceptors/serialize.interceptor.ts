import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass, classToPlain } from 'class-transformer';

// Interface which check the --> Is class is supplied or not?
interface ClassConstructor {
  new (...args: any[]): {};
}
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    // Run something before request is handled by the request handler
    // console.log('I"m running before the handler', context);

    return next.handle().pipe(
      map((data: any) => {
        // Run something beofre the resp is sent
        // console.log("I'm running before the resp is sent", data);
        return plainToClass(this.dto, data, {
          //  this setting inforces to only send back
          // the Exposed fields from DTO not all
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
