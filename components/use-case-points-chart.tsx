"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface UseCasePointsChartProps {
  results: {
    uaw: number
    uucw: number
    tcf: number
    ecf: number
    ucp: number
  }
}

export function UseCasePointsChart({ results }: UseCasePointsChartProps) {
  const data = [
    {
      name: "UAW",
      value: results.uaw,
    },
    {
      name: "UUCW",
      value: results.uucw,
    },
    {
      name: "UCP",
      value: results.ucp,
    },
  ]

  return (
    <ChartContainer
      config={{
        uaw: { label: "Unadjusted Actor Weight", color: "hsl(var(--chart-1))" },
        uucw: { label: "Unadjusted Use Case Weight", color: "hsl(var(--chart-2))" },
        ucp: { label: "Use Case Points", color: "hsl(var(--chart-3))" },
      }}
      className="h-[300px]"
    >
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-uaw)" />
      </BarChart>
    </ChartContainer>
  )
}
