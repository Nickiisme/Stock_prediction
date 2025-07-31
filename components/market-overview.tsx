"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Globe, DollarSign } from "lucide-react"

export default function MarketOverview() {
  const marketData = {
    indices: [
      { name: "上证指数", value: 3247.89, change: 15.67, changePercent: 0.48 },
      { name: "深证成指", value: 10456.23, change: -23.45, changePercent: -0.22 },
      { name: "创业板指", value: 2134.56, change: 8.9, changePercent: 0.42 },
    ],
    currencies: [
      { name: "USD/CNY", value: 7.2345, change: 0.0123, changePercent: 0.17 },
      { name: "EUR/CNY", value: 7.8901, change: -0.0234, changePercent: -0.3 },
    ],
    commodities: [
      { name: "黄金", value: 2034.56, change: 12.34, changePercent: 0.61 },
      { name: "原油", value: 78.9, change: -1.23, changePercent: -1.53 },
    ],
  }

  const DataItem = ({
    name,
    value,
    change,
    changePercent,
  }: {
    name: string
    value: number
    change: number
    changePercent: number
  }) => (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm font-medium">{name}</span>
      <div className="text-right">
        <div className="text-sm font-semibold">{value.toFixed(2)}</div>
        <div className={`text-xs flex items-center ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
          {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {changePercent.toFixed(2)}%
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4 mt-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Globe className="h-5 w-5" />
            <span>市场概览</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">主要指数</h4>
            <div className="space-y-1">
              {marketData.indices.map((index) => (
                <DataItem key={index.name} {...index} />
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">汇率</h4>
            <div className="space-y-1">
              {marketData.currencies.map((currency) => (
                <DataItem key={currency.name} {...currency} />
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">大宗商品</h4>
            <div className="space-y-1">
              {marketData.commodities.map((commodity) => (
                <DataItem key={commodity.name} {...commodity} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <DollarSign className="h-5 w-5" />
            <span>市场情绪</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">恐慌贪婪指数</span>
              <span className="text-lg font-bold text-green-600">65</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: "65%" }}></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>极度恐慌</span>
              <span>贪婪</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
