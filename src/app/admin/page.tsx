import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";

type SalesData = {
  amount: number;
  numberOfSales: number;
  error: string;
};

type CustomerData = {
  userCount: number;
  averageValuePerUser: number;
  error: string;
};

type ProductData = {
  activeCount: number;
  inactiveCount: number;
  error: string;
};

export default async function AdminDashboard() {
  const results = await Promise.allSettled([
    getSalesData(),
    getCustomerData(),
    getProductData(),
  ]);

  const [salesData, customerData, productData] = results.map(
    (result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        // Handle errors here
        console.error("Error fetching data:", result.reason);
        if (index === 0) {
          return {
            amount: 0,
            numberOfSales: 0,
            error: result.reason,
          };
        }
        if (index === 1) {
          return {
            userCount: 0,
            averageValuePerUser: 0,
            error: result.reason,
          };
        }
        if (index === 2) {
          return {
            activeCount: 0,
            inactiveCount: 0,
            error: result.reason,
          };
        }
      }
    }
  ) as [SalesData, CustomerData, ProductData];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subTitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurrency(salesData.amount)}
        error={salesData.error}
      />
      <DashboardCard
        title="Customers"
        subTitle={`${formatNumber(
          customerData.averageValuePerUser
        )} Average Value`}
        body={formatCurrency(customerData.userCount)}
        error={customerData.error}
      />
      <DashboardCard
        title="Active Products"
        subTitle={`${formatNumber(productData.inactiveCount)} Inactive`}
        body={formatCurrency(productData.activeCount)}
        error={productData.error}
      />
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  subTitle: string;
  body: string;
  error: string;
};

function DashboardCard({ title, subTitle, body, error }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{error ? error : subTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  });
  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  };
}

async function getCustomerData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  };
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ]);

  return {
    activeCount,
    inactiveCount,
  };
}
