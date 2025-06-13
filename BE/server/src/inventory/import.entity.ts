import { Product } from 'src/products/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('inventory_imports')
export class InventoryImport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number; // Số lượng nhập

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost: number; // Giá nhập

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  importDate: Date; // Ngày nhập

  @Column({ nullable: true })
  brandName: string; // Tên nhà cung cấp (có thể nullable)

  @Column({ nullable: true })
  note: string; // Ghi chú (tùy chọn)

  @ManyToOne(() => Product, (product) => product.inventoryImports)
  @JoinColumn({ name: 'productId' })
  product: Product; // Liên kết với sản phẩm

  @Column()
  productId: string; // Khóa ngoại tới Product
}
