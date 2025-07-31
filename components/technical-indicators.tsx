"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface TechnicalIndicatorsProps {
  stock: {
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
  }
}

export default function TechnicalIndicators({ stock }: TechnicalIndicatorsProps) {
  // 模拟技术指标数据
  const indicators = {
    rsi: {
      value: 65.4,
      signal: "中性",
      description: "相对强弱指标显示股票处于中性区域",
    },
    macd: {
      value: 2.34,
      signal: "买入",
      description: "MACD线上穿信号线，呈现买入信号",
    },
    sma20: {
      value: 172.45,
      signal: "买入",
      description: "价格位于20日移动平均线之上",
    },
    sma50: {
      value: 168.9,
      signal: "买入",
      description: "价格位于50日移动平均线之上",
    },
    bollinger: {
      upper: 180.25,
      middle: 175.43,
      lower: 170.61,
      signal: "中性",
      description: "价格在布林带中轨附近",
    },
    volume: {
      value: 85,
      signal: "强势",
      description: "成交量高于平均水平",
    },
  }

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "买入":
      case "强势":
        return "text-green-600"
      case "卖出":
      case "弱势":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case "买入":
      case "强势":
        return <TrendingUp className="h-4 w-4" />
      case "卖出":
      case "弱势":
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const IndicatorCard = ({
    title,
    value,
    signal,
    description,
    progress,
  }: {
    title: string
    value: string | number
    signal: string
    description: string
    progress?: number
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{value}</span>
          <Badge variant="outline" className={`${getSignalColor(signal)} flex items-center space-x-1`}>
            {getSignalIcon(signal)}
            <span>{signal}</span>
          </Badge>
        </div>
        {progress !== undefined && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-slate-500">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
        )}
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <IndicatorCard
          title="RSI (14)"
          value={indicators.rsi.value.toFixed(1)}
          signal={indicators.rsi.signal}
          description={indicators.rsi.description}
          progress={indicators.rsi.value}
        />

        <IndicatorCard
          title="MACD"
          value={indicators.macd.value.toFixed(2)}
          signal={indicators.macd.signal}
          description={indicators.macd.description}
        />

        <IndicatorCard
          title="20日均线"
          value={`$${indicators.sma20.value.toFixed(2)}`}
          signal={indicators.sma20.signal}
          description={indicators.sma20.description}
        />

        <IndicatorCard
          title="50日均线"
          value={`$${indicators.sma50.value.toFixed(2)}`}
          signal={indicators.sma50.signal}
          description={indicators.sma50.description}
        />

        <IndicatorCard
          title="成交量"
          value={`${indicators.volume.value}%`}
          signal={indicators.volume.signal}
          description={indicators.volume.description}
          progress={indicators.volume.value}
        />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">布林带</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>上轨</span>
                <span className="font-semibold">${indicators.bollinger.upper.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>中轨</span>
                <span className="font-semibold">${indicators.bollinger.middle.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>下轨</span>
                <span className="font-semibold">${indicators.bollinger.lower.toFixed(2)}</span>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`${getSignalColor(indicators.bollinger.signal)} flex items-center space-x-1 w-fit`}
            >
              {getSignalIcon(indicators.bollinger.signal)}
              <span>{indicators.bollinger.signal}</span>
            </Badge>
            <p className="text-sm text-slate-600 dark:text-slate-400">{indicators.bollinger.description}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>综合技术评分</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">75</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">技术评分</div>
              <Progress value={75} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">买入</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">综合建议</div>
              <Badge variant="default" className="mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                积极
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">8/10</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">信号强度</div>
              <div className="flex justify-center mt-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={`w-2 h-2 mx-0.5 rounded-full ${i < 8 ? "bg-purple-600" : "bg-slate-300"}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <h4 className="font-semibold mb-2">技术分析总结</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              基于当前技术指标分析，{stock.symbol} 显示出积极的技术面信号。
              多项指标支持买入观点，包括MACD金叉、价格突破移动平均线等。
              建议投资者可以考虑逢低买入，但需要注意风险管理。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
