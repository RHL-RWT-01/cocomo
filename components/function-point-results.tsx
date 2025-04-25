"use client"

interface FunctionPointResultsProps {
  results: {
    unadjustedFP: number
    vaf: number
    adjustedFP: number
    effort: number
    functionTypeCounts: {
      name: string
      total: number
      fp: number
    }[]
  }
}

export function FunctionPointResults({ results }: FunctionPointResultsProps) {
  const formatNumber = (num: number) => {
    return num.toFixed(2)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Unadjusted Function Points:</p>
          <p className="text-lg font-medium">{formatNumber(results.unadjustedFP)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Value Adjustment Factor:</p>
          <p className="text-lg font-medium">{formatNumber(results.vaf)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Adjusted Function Points:</p>
          <p className="text-lg font-medium">{formatNumber(results.adjustedFP)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Estimated Effort:</p>
          <p className="text-lg font-medium">{formatNumber(results.effort)} person-hours</p>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-md font-medium mb-2">Function Type Breakdown</h3>
        <div className="space-y-2">
          {results.functionTypeCounts.map((item) => (
            <div key={item.name} className="grid grid-cols-3 text-sm">
              <div className="truncate">
                {item.name.split(" ")[0]} {item.name.split(" ")[1]}
              </div>
              <div className="text-center">{item.total} count(s)</div>
              <div className="text-right">{item.fp} FP</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
