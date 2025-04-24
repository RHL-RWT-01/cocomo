"use client"

import type { Results } from "./cocomo-calculator"

interface ResultsDisplayProps {
  basicResults: Results | null
  intermediateResults: Results | null
  activeTab: string
}

export function ResultsDisplay({ basicResults, intermediateResults, activeTab }: ResultsDisplayProps) {
  const results = activeTab === "basic" ? basicResults : intermediateResults

  if (!results) {
    return <p>No results to display. Please calculate first.</p>
  }

  const formatNumber = (num: number) => {
    return num.toFixed(2)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Effort:</p>
          <p className="text-lg font-medium">{formatNumber(results.effort)} person-months</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Development Time:</p>
          <p className="text-lg font-medium">{formatNumber(results.time)} months</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Average Staff:</p>
          <p className="text-lg font-medium">{formatNumber(results.staff)} persons</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Productivity:</p>
          <p className="text-lg font-medium">{formatNumber(results.productivity)} KLOC/person-month</p>
        </div>
      </div>

      {results.eaf && (
        <div className="pt-2 border-t">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Effort Adjustment Factor (EAF):</p>
            <p className="text-lg font-medium">{formatNumber(results.eaf)}</p>
          </div>
        </div>
      )}

      {activeTab === "intermediate" && basicResults && (
        <div className="pt-2 border-t">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Comparison with Basic COCOMO:</p>
            <p className="text-sm">
              Effort difference: {formatNumber(results.effort - basicResults.effort)} person-months (
              {formatNumber((results.effort / basicResults.effort - 1) * 100)}%)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
