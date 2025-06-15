import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'environment_usage'})
export class EnvironmentUsageSchema {

  @PrimaryGeneratedColumn({ name: 'id'})
  readonly id: number;

  @Column({ type: 'nvarchar', length: 300, nullable: true })
  readonly title: string;

  @Column({ type: 'text', nullable: true })
  readonly description: string;

  @Column({ type: 'int', nullable: true, name: 'job_id_fk' })
  readonly jobId: number;

  @Column({
    type: 'tinyint',
    nullable: false,
    default: 1,
    name: 'is_enable'
  })
  readonly isEnable: boolean;


  constructor(args: EnvironmentUsageSchema) {
    Object.assign(this, args);
  }

}