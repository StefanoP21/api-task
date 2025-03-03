import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../../task/entities/task.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @OneToMany(() => Task, (task) => task.user, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  tasks: Task[];

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
