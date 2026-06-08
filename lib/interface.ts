/* Pathao Courier Dashboard */

interface CustomerData {
  id: number;
  name: string;
  phone: string;
  customerType?: string;
}

interface AgentData {
  id: number;
  name: string;
  avatar: string | null;
  phone: string | null;
  email: string | null;
}

interface OrderData {
  id: number;
  orderDate: string;
  addressId: number | null;
  shipping_address_street: string | null;
  shipping_address_post: string | null;
  shipping_address_thana: string | null;
  shipping_address_city: string | null;
  shipping_address_division: string | null;
  shipping_address_geo_lat: string | null;
  shipping_address_geo_lng: string | null;
  agent: AgentData;
  quantity: number;
  totalAmount: string;
  agentId?: number;
  customerId: number;
  productId?: number | null;
  packageId?: number | null;
  batchId?: number | null;
}

export interface PathaoCouriarDashboardPrpos {
  id: number;
  invoice?: string;
  courierService?: string;
  consignmentId: string | null;
  trackingCode?: string | null;
  codAmount?: string;
  deliveryCharge?: string;
  commission: string;
  commissionRate: string;
  totalAmount: string;
  status: string;
  note?: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  orderId: number;
  order: OrderData;
  productId?: number;
  quantity: number;
  packageId?: number | null;
  batchId?: number | null;
  customerId: number;
  customer: CustomerData;
  createdAt: string;
  updatedAt: string;
  amountToCollect?: string;
  deliveryType?: number;
  itemDescription?: string;
  itemQuantity?: number;
  itemType?: number;
  itemWeight?: number;
  merchantOrderId?: string;
  storeId?: number;
  specialInstruction?: string;
  recipientCity?: number;
  recipientZone?: number;
}

/* Steadfast Couriar Dashboard */

interface CustomerData {
  id: number;
  name: string;
  phone: string;
}

interface AgentData {
  id: number;
  name: string;
  avatar: string | null;
  phone: string | null;
  email: string | null;
}

interface OrderData {
  id: number;
  orderDate: string;
  addressId: number | null;
  shipping_address_street: string | null;
  shipping_address_post: string | null;
  shipping_address_thana: string | null;
  shipping_address_city: string | null;
  shipping_address_division: string | null;
  shipping_address_geo_lat: string | null;
  shipping_address_geo_lng: string | null;
  agent: AgentData;
  quantity: number;
}

export interface SteadfastCouriarDashboardProps {
  id: number;
  invoice: string;
  courierService: string;
  consignmentId: string | null;
  trackingCode: string | null;
  codAmount: string;
  deliveryCharge: string;
  commission: string;
  commissionRate: string;
  totalAmount: string;
  status: string;
  note: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  orderId: number;
  order: OrderData;
  productId: number;
  quantity: number;
  packageId: number | null;
  batchId: number | null;
  customerId: number;
  customer: CustomerData;
  createdAt: string;
  updatedAt: string;
}
