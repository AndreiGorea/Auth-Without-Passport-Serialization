import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role } from '../enums/user-role';
import { PostSerializer } from '../serializers/post.serializer';
import { instanceToInstance } from 'class-transformer';

@Injectable()
export class PostResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const role = user.role || Role.User;

    return next.handle().pipe(
      map((e) => {
        console.log('Serialized data1:', e);
        return new PostSerializer(e);
      }),
      map((e) => {
        console.log('Transformed data2:', e);
        return instanceToInstance(e, {
          groups: (role === Role.Admin ? ['admin'] : ['user']) || ['user'],
          strategy: 'excludeAll',
          excludeExtraneousValues: true,
          exposeUnsetFields: false,
          exposeDefaultValues: false,
        });
      }),
    );
  }
}
