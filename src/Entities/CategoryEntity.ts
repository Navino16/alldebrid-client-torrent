import {
  BaseEntity, Column, Entity, PrimaryColumn,
} from 'typeorm';
import { logger } from '../Utils';

export interface CategoryJSON {
  category: string;
  savePath: string;
}

@Entity('Categories')
export class CategoryEntity extends BaseEntity {
  @PrimaryColumn({ unique: true })
  public category!: string;

  @Column({ nullable: true })
  public savePath!: string;

  public static fromJSON(json: CategoryJSON): CategoryEntity {
    logger.debug('[Entities/CategoryEntity.ts - fromJSON]: Transform JSON object into category entity');
    const category = new CategoryEntity();

    category.category = json.category;
    category.savePath = json.savePath;
    return category;
  }
}
