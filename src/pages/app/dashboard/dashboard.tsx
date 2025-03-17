import { Helmet } from "react-helmet-async";
import MonthRevenueCard from "./month-revenue-card";
import MonthOrderAmountCard from "./month-orders-amount-card";
import DayOrderAmountCard from "./day-orders-amount-card";
import MonthCanceledAmountCard from "./month-canceled-orders-amount";
import RevenueChart from "./revenue-chart";
import PopularProductsChart from "./popular-products-chart";

export function Dashboard() {



    return (
        <div className="flex min-h-screen flex-col antialiased">
        <Helmet title="Dashboard"></Helmet>
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <div className="grid grid-cols-4 gap-4">
               <MonthRevenueCard/>
               <MonthOrderAmountCard/>
               <DayOrderAmountCard/>
               <MonthCanceledAmountCard/>
            </div>
        </div>

        <div className="grid grid-cols-9 gap-4">
            <RevenueChart></RevenueChart>
            <PopularProductsChart></PopularProductsChart>
        </div>
        </div>
    )
}