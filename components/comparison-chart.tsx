"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ComparisonChartProps {
  data: {
    name: string
    effort: number
  }[]
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  return (
    <ChartContainer
      config={{
        effort: { label: "Effort (person-hours)", color: "hsl(var(--chart-1))" },
      }}
      className="h-[300px]"
    >
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="effort" fill="var(--color-effort)" />
      </BarChart>
    </ChartContainer>
  )
}
