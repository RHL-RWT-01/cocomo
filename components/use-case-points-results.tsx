"use client"

interface UseCasePointsResultsProps {
  results: {
    uaw: number
    uucw: number
    tcf: number
    ecf: number
    ucp: number
    effort: number
  }
}

export function UseCasePointsResults({ results }: UseCasePointsResultsProps) {
  const formatNumber = (num: number) => {
    return num.toFixed(2)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Unadjusted Actor Weight (UAW):</p>
          <p className="text-lg font-medium">{formatNumber(results.uaw)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Unadjusted Use Case Weight (UUCW):</p>
          <p className="text-lg font-medium">{formatNumber(results.uucw)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Technical Complexity Factor (TCF):</p>
          <p className="text-lg font-medium">{formatNumber(results.tcf)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Environmental Complexity Factor (ECF):</p>
          <p className="text-lg font-medium">{formatNumber(results.ecf)}</p>
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Use Case Points (UCP):</p>
            <p className="text-lg font-medium">{formatNumber(results.ucp)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Estimated Effort:</p>
            <p className="text-lg font-medium">{formatNumber(results.effort)} person-hours</p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-md font-medium mb-2">Calculation Formula</h3>
        <div className="space-y-1 text-sm">
          <p>UCP = (UAW + UUCW) × TCF × ECF</p>
          <p>Effort = UCP × Productivity Factor</p>
        </div>
      </div>
    </div>
  )
}
