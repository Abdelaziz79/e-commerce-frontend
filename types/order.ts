export interface OrderHistoryReference {
  order: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "on-hold"
  | "failed"
  | "completed";

export interface OrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: string;
  variation?: {
    size?: string;
    color?: string;
    material?: string;
    style?: string;
    sku?: string;
  };
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
  paymentMethod?: string;
  transactionFee?: number;
}

export interface Discount {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  description?: string;
}

export interface StatusHistory {
  status: OrderStatus;
  date: string;
  note?: string;
}

export interface ShippingInfo {
  carrier?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  shippedAt?: string;
}

export interface Refund {
  amount: number;
  reason: string;
  date: string;
  status: "pending" | "processed" | "rejected";
}

export interface Order {
  _id: string;
  user:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
  orderNumber: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult;
  itemsPrice: number;
  subtotal: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  discount?: Discount;
  discountAmount: number;
  status: OrderStatus;
  statusHistory: StatusHistory[];
  notes?: string;
  adminNotes?: string;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  shipping: ShippingInfo;
  refund?: Refund;
  invoiceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ REQUEST DATA TYPES ============

export interface CreateOrderData {
  orderItems: {
    name: string;
    quantity: number;
    price: number;
    product: string;
    image: string;
    variation?: {
      size?: string;
      color?: string;
      material?: string;
      style?: string;
      sku?: string;
    };
  }[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber?: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  discount?: {
    code: string;
    type: "percentage" | "fixed";
    value: number;
    description?: string;
  };
  notes?: string;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
  note?: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  refundAmount?: number;
  refundReason?: string;
  adminNotes?: string;
}

export interface AddTrackingInfoData {
  carrier: string;
  trackingNumber: string;
  estimatedDeliveryDate?: string;
}

export interface CancelOrderData {
  reason?: string;
}

export interface UpdateToPaidData {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
  payment_method?: string;
  transaction_fee?: number;
}

// ============ QUERY PARAMS ============

export interface OrdersParams {
  // ADD THIS LINE: It tells TypeScript this object can have any string key
  [key: string]: string | number | OrderStatus | undefined;

  page?: string | number;
  limit?: string | number;
  sort?: string;
  status?: OrderStatus;
  user?: string;
  startDate?: string;
  endDate?: string;
}

export interface SearchOrdersParams {
  // ADD THIS LINE: It tells TypeScript this object can have any string key
  [key: string]: string | number | undefined;

  query: string;
  page?: string | number;
  limit?: string | number;
}
// ============ RESPONSE TYPES ============

export interface OrderResponse {
  status: string;
  message?: string;
  data: Order;
}

export interface PaginatedOrdersResponse {
  status: string;
  data: {
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface OrderHistoryResponse {
  status: string;
  data: {
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface OrderStatsResponse {
  status: string;
  data: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    ordersByStatus: {
      status: OrderStatus;
      count: number;
    }[];
    recentOrders: Order[];
  };
}

export interface OrderAnalyticsResponse {
  status: string;
  data: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    ordersByStatus: {
      status: OrderStatus;
      count: number;
      percentage: number;
    }[];
    revenueByMonth: {
      month: string;
      revenue: number;
      orders: number;
    }[];
    topProducts: {
      product: {
        _id: string;
        name: string;
      };
      totalSold: number;
      totalRevenue: number;
    }[];
    topCustomers: {
      user: {
        _id: string;
        name: string;
        email: string;
      };
      totalOrders: number;
      totalSpent: number;
    }[];
  };
}
