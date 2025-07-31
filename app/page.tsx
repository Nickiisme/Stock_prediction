"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Search, BarChart3, Brain, Target, Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

import StockChart from "@/components/stock-chart"
import PredictionPanel from "@/components/prediction-panel"
import TechnicalIndicators from "@/components/technical-indicators"
import MarketOverview from "@/components/market-overview"
import PriceAlerts from "@/components/price-alerts"

// 模拟股票数据
const mockStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 175.43, change: 2.34, changePercent: 1.35 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 2847.63, change: -15.23, changePercent: -0.53 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 378.85, change: 4.12, changePercent: 1.1 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.5, change: -8.75, changePercent: -3.4 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 3127.45, change: 18.9, changePercent: 0.61 },
]

export default function StockPredictionPlatform() {
  const [selectedStock, setSelectedStock] = useState(mockStocks[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [timeframe, setTimeframe] = useState("1D")

  const filteredStocks = mockStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">智能股票预测平台</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="搜索股票代码或公司名称..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1D">1天</SelectItem>
                  <SelectItem value="1W">1周</SelectItem>
                  <SelectItem value="1M">1月</SelectItem>
                  <SelectItem value="3M">3月</SelectItem>
                  <SelectItem value="1Y">1年</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 股票列表 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>热门股票</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {filteredStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedStock.symbol === stock.symbol
                        ? "bg-blue-50 border-2 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700"
                        : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                    }`}
                    onClick={() => setSelectedStock(stock)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{stock.symbol}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 truncate">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-900 dark:text-white">${stock.price.toFixed(2)}</div>
                        <div
                          className={`text-sm flex items-center ${
                            stock.change >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {stock.change >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <MarketOverview />
          </div>

          {/* 主要内容区域 */}
          <div className="lg:col-span-3">
            {/* 股票信息卡片 */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      {selectedStock.symbol} - {selectedStock.name}
                    </CardTitle>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">
                        ${selectedStock.price.toFixed(2)}
                      </span>
                      <Badge
                        variant={selectedStock.change >= 0 ? "default" : "destructive"}
                        className="flex items-center space-x-1"
                      >
                        {selectedStock.change >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>
                          {selectedStock.change >= 0 ? "+" : ""}
                          {selectedStock.change.toFixed(2)}({selectedStock.changePercent.toFixed(2)}%)
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-slate-600 dark:text-slate-400">
                    <div>最后更新</div>
                    <div>{new Date().toLocaleString("zh-CN")}</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* 标签页内容 */}
            <Tabs defaultValue="chart" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="chart" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>价格图表</span>
                </TabsTrigger>
                <TabsTrigger value="prediction" className="flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>AI预测</span>
                </TabsTrigger>
                <TabsTrigger value="technical" className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>技术指标</span>
                </TabsTrigger>
                <TabsTrigger value="alerts" className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>价格提醒</span>
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>分析报告</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chart">
                <StockChart stock={selectedStock} timeframe={timeframe} />
              </TabsContent>

              <TabsContent value="prediction">
                <PredictionPanel stock={selectedStock} />
              </TabsContent>

              <TabsContent value="technical">
                <TechnicalIndicators stock={selectedStock} />
              </TabsContent>

              <TabsContent value="alerts">
                <PriceAlerts stock={selectedStock} />
              </TabsContent>

              <TabsContent value="analysis">
                <Card>
                  <CardHeader>
                    <CardTitle>分析报告</CardTitle>
                    <CardDescription>基于技术分析和市场数据的综合评估</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">买入</div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">技术面建议</div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">75%</div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">上涨概率</div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">$185</div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">目标价位</div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="prose dark:prose-invert max-w-none">
                        <h3>市场分析</h3>
                        <p>
                          基于当前技术指标分析，{selectedStock.symbol} 显示出积极的上涨趋势。
                          RSI指标显示股票未进入超买区域，MACD呈现金叉信号，
                          移动平均线支撑位良好。建议投资者可以考虑逢低买入。
                        </p>

                        <h3>风险提示</h3>
                        <p>
                          股票投资存在风险，预测结果仅供参考。请投资者根据自身风险承受能力
                          和投资目标做出决策，并建议分散投资以降低风险。
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
