import { Expose } from 'class-transformer';

export class PostSerializer {
  @Expose({ groups: ['user', 'admin'] })
  id: number;

  @Expose({ groups: ['user', 'admin'] })
  title: string;

  @Expose({ groups: ['admin'] })
  views: string[];

  constructor(partial: Partial<PostSerializer>) {
    Object.assign(this, partial);
  }
}
