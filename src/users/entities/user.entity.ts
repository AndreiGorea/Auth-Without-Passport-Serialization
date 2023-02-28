import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsString } from 'class-validator';
import { ApproveUser } from '../../auth/entities/approve-user.entity';
import { Posts } from '../../posts/entities/post.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @IsString()
  @Column({ nullable: false })
  password: string;

  @Column({ length: 50 })
  username: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({
    type: Boolean,
    default: false,
    name: 'is_approved',
  })
  isApproved: boolean;

  @OneToOne(() => ApproveUser, { cascade: true })
  @JoinColumn({ name: 'approve_user' })
  approveUser: ApproveUser;

  @OneToOne(() => Posts, { cascade: true })
  @JoinColumn({ name: 'posts' })
  post: Posts;
}
