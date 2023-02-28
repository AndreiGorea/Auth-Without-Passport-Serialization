import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsString } from 'class-validator';

@Entity('posts')
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ nullable: false })
  title: string;

  @Column('simple-array')
  views: string[];
}
