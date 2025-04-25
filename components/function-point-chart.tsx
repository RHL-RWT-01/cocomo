"use client"

import { Cell, Pie, PieChart } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface FunctionPointChartProps {
  results: {
    functionTypeCounts: {
      name: string
      total: number
      fp: number
    }[]
  }
}

export function FunctionPointChart({ results }: FunctionPointChartProps) {
  const data = results.functionTypeCounts.map((item) => ({
    name: item.name.split(" ")[0],
    value: item.fp,
  }))

  const COLORS = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
    "var(--color-chart-5)",
  ]

  return (
    <ChartContainer
      config={{
        chart1: { label: "External Inputs", color: "hsl(var(--chart-1))" },
        chart2: { label: "External Outputs", color: "hsl(var(--chart-2))" },
        chart3: { label: "External Inquiries", color: "hsl(var(--chart-3))" },
        chart4: { label: "Internal Logical Files", color: "hsl(var(--chart-4))" },
        chart5: { label: "External Interface Files", color: "hsl(var(--chart-5))" },
      }}
      className="h-[300px]"
    >
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
