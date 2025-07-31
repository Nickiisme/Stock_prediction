"use client"

import { XAxis, YAxis, Area, AreaChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// 生成模拟股票数据
const generateStockData = (symbol: string, days = 30) => {
  const data = []
  let price = 175.43 // 基础价格
  const baseDate = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() - i)

    // 模拟价格波动
    const change = (Math.random() - 0.5) * 10
    price = Math.max(price + change, price * 0.95) // 防止价格过低

    data.push({
      date: date.toISOString().split("T")[0],
      price: Number.parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 500000,
    })
  }

  return data
}

interface StockChartProps {
  stock: {
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
  }
  timeframe: string
}

export default function StockChart({ stock, timeframe }: StockChartProps) {
  const getDays = (timeframe: string) => {
    switch (timeframe) {
      case "1D":
        return 1
      case "1W":
        return 7
      case "1M":
        return 30
      case "3M":
        return 90
      case "1Y":
        return 365
      default:
        return 30
    }
  }

  const chartData = generateStockData(stock.symbol, getDays(timeframe))

  const chartConfig = {
    price: {
      label: "价格",
      color: stock.change >= 0 ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)",
    },
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>价格走势图</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig.price.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartConfig.price.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return timeframe === "1D"
                    ? date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
                    : date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })
                }}
              />
              <YAxis domain={["dataMin - 5", "dataMax + 5"]} tickFormatter={(value) => `$${value.toFixed(2)}`} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("zh-CN")
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "价格"]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartConfig.price.color}
                fillOpacity={1}
                fill="url(#colorPrice)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                ${Math.max(...chartData.map((d) => d.price)).toFixed(2)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">最高价</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                ${Math.min(...chartData.map((d) => d.price)).toFixed(2)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">最低价</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {(chartData.reduce((sum, d) => sum + d.volume, 0) / chartData.length / 1000000).toFixed(2)}M
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">平均成交量</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
