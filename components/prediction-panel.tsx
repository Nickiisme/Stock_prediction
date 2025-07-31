"use client"

import { useState } from "react"
import { Brain, TrendingUp, TrendingDown, Zap, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PredictionPanelProps {
  stock: {
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
  }
}

export default function PredictionPanel({ stock }: PredictionPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [predictions, setPredictions] = useState({
    shortTerm: {
      direction: "up" as "up" | "down",
      confidence: 78,
      targetPrice: stock.price * 1.05,
      timeframe: "1周内",
    },
    mediumTerm: {
      direction: "up" as "up" | "down",
      confidence: 65,
      targetPrice: stock.price * 1.12,
      timeframe: "1个月内",
    },
    longTerm: {
      direction: "up" as "up" | "down",
      confidence: 72,
      targetPrice: stock.price * 1.25,
      timeframe: "3个月内",
    },
  })

  const runPrediction = () => {
    setIsAnalyzing(true)

    // 模拟AI分析过程
    setTimeout(() => {
      const newPredictions = {
        shortTerm: {
          direction: Math.random() > 0.4 ? "up" : ("down" as "up" | "down"),
          confidence: Math.floor(Math.random() * 30) + 60,
          targetPrice: stock.price * (0.95 + Math.random() * 0.1),
          timeframe: "1周内",
        },
        mediumTerm: {
          direction: Math.random() > 0.3 ? "up" : ("down" as "up" | "down"),
          confidence: Math.floor(Math.random() * 25) + 55,
          targetPrice: stock.price * (0.9 + Math.random() * 0.2),
          timeframe: "1个月内",
        },
        longTerm: {
          direction: Math.random() > 0.25 ? "up" : ("down" as "up" | "down"),
          confidence: Math.floor(Math.random() * 20) + 60,
          targetPrice: stock.price * (0.85 + Math.random() * 0.3),
          timeframe: "3个月内",
        },
      }

      setPredictions(newPredictions)
      setIsAnalyzing(false)
    }, 3000)
  }

  const PredictionCard = ({
    title,
    prediction,
    icon: Icon,
  }: {
    title: string
    prediction: typeof predictions.shortTerm
    icon: any
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Icon className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">预测方向</span>
          <Badge variant={prediction.direction === "up" ? "default" : "destructive"}>
            {prediction.direction === "up" ? (
              <>
                <TrendingUp className="h-3 w-3 mr-1" />
                上涨
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 mr-1" />
                下跌
              </>
            )}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>置信度</span>
            <span>{prediction.confidence}%</span>
          </div>
          <Progress value={prediction.confidence} className="h-2" />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">目标价格</span>
          <span className="font-semibold">${prediction.targetPrice.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">时间框架</span>
          <span className="text-sm">{prediction.timeframe}</span>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span>潜在收益</span>
            <span
              className={`font-semibold ${prediction.targetPrice > stock.price ? "text-green-600" : "text-red-600"}`}
            >
              {(((prediction.targetPrice - stock.price) / stock.price) * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <span>AI智能预测</span>
            </CardTitle>
            <Button onClick={runPrediction} disabled={isAnalyzing} className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>{isAnalyzing ? "分析中..." : "重新分析"}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">AI正在分析市场数据...</p>
              <div className="mt-4 space-y-2">
                <Progress value={33} className="h-2" />
                <p className="text-sm text-slate-500">分析技术指标、市场情绪和历史数据</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PredictionCard title="短期预测" prediction={predictions.shortTerm} icon={Zap} />
              <PredictionCard title="中期预测" prediction={predictions.mediumTerm} icon={TrendingUp} />
              <PredictionCard title="长期预测" prediction={predictions.longTerm} icon={Target} />
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="methodology" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="methodology">预测方法</TabsTrigger>
          <TabsTrigger value="factors">影响因素</TabsTrigger>
          <TabsTrigger value="disclaimer">免责声明</TabsTrigger>
        </TabsList>

        <TabsContent value="methodology">
          <Card>
            <CardHeader>
              <CardTitle>AI预测方法论</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">技术分析</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• 移动平均线分析</li>
                    <li>• RSI相对强弱指标</li>
                    <li>• MACD指标分析</li>
                    <li>• 布林带分析</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">机器学习模型</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• LSTM神经网络</li>
                    <li>• 随机森林算法</li>
                    <li>• 支持向量机</li>
                    <li>• 集成学习方法</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="factors">
          <Card>
            <CardHeader>
              <CardTitle>关键影响因素</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600">积极因素</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">技术指标呈现买入信号</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">成交量持续增长</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">市场情绪积极</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-red-600">风险因素</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm">市场波动性较高</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm">宏观经济不确定性</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm">行业竞争加剧</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disclaimer">
          <Card>
            <CardHeader>
              <CardTitle>重要免责声明</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                本平台提供的股票预测和分析仅供参考，不构成投资建议。股票投资存在风险，
                过往表现不代表未来结果。投资者应该：
              </p>
              <ul className="text-sm text-slate-600 dark:text-slate-400">
                <li>根据自身风险承受能力做出投资决策</li>
                <li>进行充分的研究和尽职调查</li>
                <li>考虑分散投资以降低风险</li>
                <li>咨询专业的财务顾问</li>
              </ul>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                AI预测基于历史数据和算法模型，无法保证准确性。市场条件可能快速变化， 影响预测结果的有效性。
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
