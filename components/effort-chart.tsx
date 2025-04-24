"use client"

import type { ProjectType, Results } from "./cocomo-calculator"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface EffortChartProps {
  basicResults: Results | null
  intermediateResults: Results | null
  kloc: number
  projectType: ProjectType
}

export function EffortChart({ basicResults, intermediateResults, kloc, projectType }: EffortChartProps) {
  if (!basicResults && !intermediateResults) {
    return <p>No data to display. Please calculate first.</p>
  }

  // Generate data points for the chart
  const generateChartData = () => {
    const data = []
    const maxKloc = kloc * 2
    const step = maxKloc / 10

    // Coefficients based on project type
    let a, b, c, d

    switch (projectType) {
      case "organic":
        a = 2.4
        b = 1.05
        c = 2.5
        d = 0.38
        break
      case "semi-detached":
        a = 3.0
        b = 1.12
        c = 2.5
        d = 0.35
        break
      case "embedded":
        a = 3.6
        b = 1.2
        c = 2.5
        d = 0.32
        break
      default:
        a = 2.4
        b = 1.05
        c = 2.5
        d = 0.38
    }

    // Calculate EAF for intermediate mode
    const eaf = intermediateResults?.eaf || 1

    for (let i = step; i <= maxKloc; i += step) {
      const basicEffort = a * Math.pow(i, b)
      const intermediateEffort = a * Math.pow(i, b) * eaf

      data.push({
        kloc: i.toFixed(1),
        basic: basicEffort,
        intermediate: intermediateEffort,
      })
    }

    return data
  }

  const chartData = generateChartData()

  // Add current point to the chart data
  if (basicResults || intermediateResults) {
    const currentPoint = {
      kloc: kloc.toFixed(1),
      basic: basicResults?.effort || 0,
      intermediate: intermediateResults?.effort || 0,
      current: true,
    }

    // Find if we already have this KLOC value
    const existingIndex = chartData.findIndex((item) => item.kloc === currentPoint.kloc)

    if (existingIndex >= 0) {
      chartData[existingIndex] = { ...chartData[existingIndex], ...currentPoint }
    } else {
      // Insert at the right position
      let insertIndex = 0
      while (insertIndex < chartData.length && Number.parseFloat(chartData[insertIndex].kloc) < kloc) {
        insertIndex++
      }
      chartData.splice(insertIndex, 0, currentPoint)
    }
  }

  return (
    <ChartContainer
      config={{
        basic: {
          label: "Basic COCOMO",
          color: "hsl(var(--chart-1))",
        },
        intermediate: {
          label: "Intermediate COCOMO",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="kloc" label={{ value: "KLOC", position: "insideBottomRight", offset: -5 }} />
        <YAxis label={{ value: "Effort (person-months)", angle: -90, position: "insideLeft" }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="basic" stroke="var(--color-basic)" strokeWidth={2} activeDot={{ r: 8 }} />
        {intermediateResults && (
          <Line
            type="monotone"
            dataKey="intermediate"
            stroke="var(--color-intermediate)"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        )}
      </LineChart>
    </ChartContainer>
  )
}
