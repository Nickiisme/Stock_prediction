"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Bell, Plus, Trash2, Edit, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface PriceAlert {
  id: string
  symbol: string
  targetPrice: number
  condition: "above" | "below"
  isActive: boolean
  createdAt: Date
  note?: string
  triggered?: boolean
  triggeredAt?: Date
}

interface PriceAlertsProps {
  stock: {
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
  }
}

export default function PriceAlerts({ stock }: PriceAlertsProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAlert, setEditingAlert] = useState<PriceAlert | null>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const { toast } = useToast()

  // 表单状态
  const [formData, setFormData] = useState({
    targetPrice: "",
    condition: "above" as "above" | "below",
    note: "",
  })

  // 检查通知权限
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        setNotificationsEnabled(true)
      } else if (Notification.permission === "default") {
        // 自动请求权限
        Notification.requestPermission().then((permission) => {
          setNotificationsEnabled(permission === "granted")
        })
      }
    }
  }, [])

  // 从本地存储加载提醒
  useEffect(() => {
    const savedAlerts = localStorage.getItem("priceAlerts")
    if (savedAlerts) {
      const parsedAlerts = JSON.parse(savedAlerts).map((alert: any) => ({
        ...alert,
        createdAt: new Date(alert.createdAt),
        triggeredAt: alert.triggeredAt ? new Date(alert.triggeredAt) : undefined,
      }))
      setAlerts(parsedAlerts)
    }
  }, [])

  // 保存提醒到本地存储
  const saveAlertsToStorage = (alertsToSave: PriceAlert[]) => {
    localStorage.setItem("priceAlerts", JSON.stringify(alertsToSave))
  }

  // 模拟价格监控
  useEffect(() => {
    const interval = setInterval(() => {
      // 模拟价格变化（±2%）
      const priceChange = (Math.random() - 0.5) * 0.04
      const newPrice = stock.price * (1 + priceChange)

      // 检查是否有提醒被触发
      const updatedAlerts = alerts.map((alert) => {
        if (
          alert.isActive &&
          !alert.triggered &&
          alert.symbol === stock.symbol &&
          ((alert.condition === "above" && newPrice >= alert.targetPrice) ||
            (alert.condition === "below" && newPrice <= alert.targetPrice))
        ) {
          // 触发提醒
          triggerNotification(alert, newPrice)
          return {
            ...alert,
            triggered: true,
            triggeredAt: new Date(),
          }
        }
        return alert
      })

      if (updatedAlerts.some((alert, index) => alert.triggered !== alerts[index].triggered)) {
        setAlerts(updatedAlerts)
        saveAlertsToStorage(updatedAlerts)
      }
    }, 5000) // 每5秒检查一次

    return () => clearInterval(interval)
  }, [alerts, stock])

  // 触发通知
  const triggerNotification = (alert: PriceAlert, currentPrice: number) => {
    const title = `${alert.symbol} 价格提醒`
    const body = `${alert.symbol} 价格已${alert.condition === "above" ? "突破" : "跌破"} $${alert.targetPrice.toFixed(2)}，当前价格 $${currentPrice.toFixed(2)}`

    // 桌面通知
    if (notificationsEnabled && "Notification" in window) {
      new Notification(title, {
        body,
        icon: "/placeholder.svg?height=64&width=64&text=📈",
        tag: alert.id,
      })
    }

    // Toast 通知
    toast({
      title,
      description: body,
      duration: 10000,
    })
  }

  // 请求通知权限
  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationsEnabled(permission === "granted")

      if (permission === "granted") {
        toast({
          title: "通知权限已开启",
          description: "您将收到价格提醒通知",
        })
      } else {
        toast({
          title: "通知权限被拒绝",
          description: "您将无法收到桌面通知，但仍会显示页面内提醒",
          variant: "destructive",
        })
      }
    }
  }

  // 创建或更新提醒
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.targetPrice || isNaN(Number(formData.targetPrice))) {
      toast({
        title: "输入错误",
        description: "请输入有效的目标价格",
        variant: "destructive",
      })
      return
    }

    const targetPrice = Number(formData.targetPrice)

    if (editingAlert) {
      // 更新现有提醒
      const updatedAlerts = alerts.map((alert) =>
        alert.id === editingAlert.id
          ? {
              ...alert,
              targetPrice,
              condition: formData.condition,
              note: formData.note,
              triggered: false,
              triggeredAt: undefined,
            }
          : alert,
      )
      setAlerts(updatedAlerts)
      saveAlertsToStorage(updatedAlerts)

      toast({
        title: "提醒已更新",
        description: `${stock.symbol} 的价格提醒已更新`,
      })
    } else {
      // 创建新提醒
      const newAlert: PriceAlert = {
        id: Date.now().toString(),
        symbol: stock.symbol,
        targetPrice,
        condition: formData.condition,
        isActive: true,
        createdAt: new Date(),
        note: formData.note,
      }

      const updatedAlerts = [...alerts, newAlert]
      setAlerts(updatedAlerts)
      saveAlertsToStorage(updatedAlerts)

      toast({
        title: "提醒已创建",
        description: `已为 ${stock.symbol} 设置价格提醒`,
      })
    }

    // 重置表单
    setFormData({ targetPrice: "", condition: "above", note: "" })
    setEditingAlert(null)
    setIsDialogOpen(false)
  }

  // 删除提醒
  const deleteAlert = (id: string) => {
    const updatedAlerts = alerts.filter((alert) => alert.id !== id)
    setAlerts(updatedAlerts)
    saveAlertsToStorage(updatedAlerts)

    toast({
      title: "提醒已删除",
      description: "价格提醒已成功删除",
    })
  }

  // 切换提醒状态
  const toggleAlert = (id: string) => {
    const updatedAlerts = alerts.map((alert) => (alert.id === id ? { ...alert, isActive: !alert.isActive } : alert))
    setAlerts(updatedAlerts)
    saveAlertsToStorage(updatedAlerts)
  }

  // 编辑提醒
  const editAlert = (alert: PriceAlert) => {
    setEditingAlert(alert)
    setFormData({
      targetPrice: alert.targetPrice.toString(),
      condition: alert.condition,
      note: alert.note || "",
    })
    setIsDialogOpen(true)
  }

  // 重置已触发的提醒
  const resetTriggeredAlert = (id: string) => {
    const updatedAlerts = alerts.map((alert) =>
      alert.id === id ? { ...alert, triggered: false, triggeredAt: undefined } : alert,
    )
    setAlerts(updatedAlerts)
    saveAlertsToStorage(updatedAlerts)
  }

  const currentStockAlerts = alerts.filter((alert) => alert.symbol === stock.symbol)

  return (
    <div className="space-y-6">
      {/* 通知权限卡片 */}
      {!notificationsEnabled && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">开启通知权限</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">开启浏览器通知权限以接收价格提醒</p>
              </div>
              <Button onClick={requestNotificationPermission} variant="outline" size="sm">
                开启通知
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 当前股票提醒概览 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-6 w-6 text-blue-600" />
              <span>{stock.symbol} 价格提醒</span>
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingAlert(null)
                    setFormData({ targetPrice: "", condition: "above", note: "" })
                  }}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>新建提醒</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingAlert ? "编辑价格提醒" : "创建价格提醒"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetPrice">目标价格</Label>
                    <Input
                      id="targetPrice"
                      type="number"
                      step="0.01"
                      placeholder="输入目标价格"
                      value={formData.targetPrice}
                      onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                      required
                    />
                    <p className="text-sm text-slate-600 dark:text-slate-400">当前价格: ${stock.price.toFixed(2)}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">提醒条件</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value: "above" | "below") => setFormData({ ...formData, condition: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">价格高于目标价格时提醒</SelectItem>
                        <SelectItem value="below">价格低于目标价格时提醒</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">备注 (可选)</Label>
                    <Textarea
                      id="note"
                      placeholder="添加备注信息..."
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      取消
                    </Button>
                    <Button type="submit">{editingAlert ? "更新提醒" : "创建提醒"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {currentStockAlerts.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">暂无价格提醒</h3>
              <p className="text-slate-500 dark:text-slate-500 mb-4">
                为 {stock.symbol} 创建价格提醒，及时获取价格变动通知
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentStockAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`${alert.triggered ? "border-green-200 bg-green-50 dark:bg-green-900/20" : ""}`}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge
                            variant={alert.condition === "above" ? "default" : "destructive"}
                            className="flex items-center space-x-1"
                          >
                            {alert.condition === "above" ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            <span>
                              {alert.condition === "above" ? "突破" : "跌破"} ${alert.targetPrice.toFixed(2)}
                            </span>
                          </Badge>

                          {alert.triggered && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              已触发
                            </Badge>
                          )}

                          <Switch checked={alert.isActive} onCheckedChange={() => toggleAlert(alert.id)} />
                        </div>

                        {alert.note && <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{alert.note}</p>}

                        <div className="text-xs text-slate-500">
                          创建时间: {alert.createdAt.toLocaleString("zh-CN")}
                          {alert.triggeredAt && (
                            <span className="ml-4">触发时间: {alert.triggeredAt.toLocaleString("zh-CN")}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {alert.triggered && (
                          <Button size="sm" variant="outline" onClick={() => resetTriggeredAlert(alert.id)}>
                            重置
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => editAlert(alert)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteAlert(alert.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 所有提醒统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{alerts.length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">总提醒数</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{alerts.filter((alert) => alert.isActive).length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">活跃提醒</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {alerts.filter((alert) => alert.triggered).length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">已触发</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(alerts.map((alert) => alert.symbol)).size}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">监控股票</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">如何设置提醒</h4>
              <ul className="text-sm space-y-1">
                <li>• 点击"新建提醒"按钮</li>
                <li>• 输入目标价格</li>
                <li>• 选择提醒条件（突破或跌破）</li>
                <li>• 添加备注信息（可选）</li>
                <li>• 点击"创建提醒"完成设置</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">通知方式</h4>
              <ul className="text-sm space-y-1">
                <li>• 浏览器桌面通知</li>
                <li>• 页面内Toast提醒</li>
                <li>• 提醒状态实时更新</li>
                <li>• 支持开启/关闭提醒</li>
                <li>• 可重置已触发的提醒</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
