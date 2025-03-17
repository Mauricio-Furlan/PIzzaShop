import { api } from "@/lib/axios";


export interface GetDailyRevenueInPeriodQuery {
    from?: Date,
    to?: Date
}

// type é usado pq é a unica forma de retornar um array
export type GetDailyRevenueInPeriodResponse = {
    date: number
    receipt: number
}[]

export default async function getDailyRevenueInPeriod({from, to}: GetDailyRevenueInPeriodQuery) {
    const response = await api.get<GetDailyRevenueInPeriodResponse>('/metrics/daily-receipt-in-period', {
        params: {
            from,
            to
        }
    });

    return response.data;
}