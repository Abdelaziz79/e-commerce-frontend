// types/order.ts - ENHANCED VERSION
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
  notes?: string;
  discountCode?: string;
  itemsPrice: number;
  subtotal: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  discountAmount: number;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
  note?: string;
  adminNotes?: string;
  shippingInfo?: {
    carrier?: string;
    trackingNumber?: string;
    estimatedDeliveryDate?: string;
  };
  refund?: {
    amount: number;
    reason: string;
  };
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
  update_time?: string;
  email_address?: string;
  payment_method?: string;
  transaction_fee?: number;
}

// ============ QUERY PARAMS ============

export interface OrdersParams {
  [key: string]: string | number | OrderStatus | boolean | undefined;
  page?: string | number;
  limit?: string | number;
  sort?: string;
  status?: OrderStatus;
  user?: string;
  startDate?: string;
  endDate?: string;
  isPaid?: boolean;
  isDelivered?: boolean;
  keyword?: string;
}

export interface SearchOrdersParams {
  [key: string]: string | number | undefined;
  q: string;
  page?: string | number;
  limit?: string | number;
  sort?: string;
  fields?: string;
}

// ============ RESPONSE TYPES ============

export interface OrderResponse {
  status: string;
  message?: string;
  data: {
    order: Order;
  };
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
    // Overall stats
    totalOrders: number;
    totalSpent: number;
    paidOrdersCount: number;
    averageOrderValue: number;

    // Status breakdown (all statuses with counts)
    statusCounts: Record<OrderStatus, number>;

    // Quick access to common statuses (for backward compatibility)
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number; // NEW: This was missing
    completedOrders: number;
    cancelledOrders: number;

    // Recent orders
    recentOrders: Order[];
  };
}

export interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  compareWithPrevious?: boolean;
  [key: string]: string | boolean | undefined;
}

// ============ ENHANCED ANALYTICS TYPES ============

export interface MonthlyRevenue {
  _id: {
    year: number;
    month: number;
  };
  revenue: number;
  orders: number;
  averageOrderValue: number;
  itemsSold: number;
}

export interface DailyRevenue {
  _id: {
    year: number;
    month: number;
    day: number;
  };
  revenue: number;
  orders: number;
}

export interface TopProduct {
  _id: string; // ✅ Changed from object to string (product ID)
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
  productName: string;
  averagePrice: number;
  uniqueVariations?: Array<{
    sku?: string;
    size?: string;
    color?: string;
    quantity: number;
  }>;
}

export interface CategoryPerformance {
  _id: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
  uniqueProductCount: number;
}

export interface BrandPerformance {
  _id: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
}

export interface CustomerStats {
  uniqueCustomers: number;
  totalOrders: number;
  averageOrdersPerCustomer: number;
}

export interface CustomerLoyalty {
  totalCustomers: number;
  repeatCustomers: number;
  repeatCustomerRate: number;
  averageOrdersPerCustomer: number;
  averageLifetimeValue: number;
}

export interface FulfillmentMetrics {
  averageFulfillmentDays: number;
  minFulfillmentDays: number;
  maxFulfillmentDays: number;
}

export interface StatusBreakdown {
  _id: string;
  count: number;
  totalValue: number;
}

export interface ConversionMetrics {
  totalOrders: number;
  paidOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  failedOrders: number;
  paymentConversionRate: number;
  completionRate: number;
  cancellationRate: number;
  failureRate: number;
}

export interface PaymentMethodStats {
  _id: string;
  count: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface ShippingStats {
  _id: string;
  orders: number;
  revenue: number;
  averageShippingCost: number;
  uniqueCities: number;
}

export interface DiscountUsage {
  _id: string;
  usageCount: number;
  totalDiscountGiven: number;
  totalRevenue: number;
  averageDiscount: number;
}

export interface RefundStats {
  totalRefunds: number;
  totalRefundAmount: number;
  averageRefundAmount: number;
}

export interface TaxStats {
  totalTaxCollected: number;
  averageTaxPerOrder: number;
}

export interface OrderAnalyticsResponse {
  status: string;
  data: {
    overview: {
      totalOrders: number;
      totalRevenue: number;
      totalPaidOrders: number;
      averageOrderValue: number;
    };
    periodAnalysis: {
      current: {
        startDate: string;
        endDate: string;
        orders: number;
        revenue: number;
        averageOrderValue: number;
        totalItems: number;
        totalDiscount: number;
        totalTax: number;
        totalShipping: number;
      };
      previous: {
        startDate: string;
        endDate: string;
        orders: number;
        revenue: number;
        averageOrderValue: number;
      };
      growth: {
        revenue: number;
        orders: number;
        averageOrderValue: number;
      };
    };
    quickStats: {
      last24Hours: {
        orders: number;
        revenue: number;
      };
      last7Days: {
        orders: number;
        revenue: number;
        averageOrderValue: number;
      };
      last30Days: {
        orders: number;
        revenue: number;
        averageOrderValue: number;
      };
    };
    trends: {
      monthly: MonthlyRevenue[];
      daily: DailyRevenue[];
    };
    products: {
      topSelling: TopProduct[];
      byCategory: CategoryPerformance[];
      byBrand: BrandPerformance[];
    };
    customers: {
      stats: CustomerStats;
      loyalty: CustomerLoyalty;
    };
    operations: {
      fulfillment: FulfillmentMetrics;
      statusBreakdown: {
        byStatus: StatusBreakdown[];
        conversionMetrics: ConversionMetrics;
      };
    };
    financial: {
      paymentMethods: PaymentMethodStats[];
      discounts: {
        topCodes: DiscountUsage[];
        summary: {
          totalDiscountGiven: number;
          ordersWithDiscount: number;
        };
      };
      refunds: RefundStats;
      tax: TaxStats;
    };
    geography: {
      topCountries: ShippingStats[];
    };
    statusDistribution: Record<OrderStatus, number>;
  };
}
