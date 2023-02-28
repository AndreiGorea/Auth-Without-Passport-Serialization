import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ApproveUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'null', name: 'approve_code' })
  approveCode: string;
}
