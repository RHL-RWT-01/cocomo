"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { FunctionPointResults } from "@/components/function-point-results"
import { FunctionPointChart } from "@/components/function-point-chart"

type Complexity = "low" | "average" | "high"

interface FunctionType {
  name: string
  description: string
  counts: {
    low: number
    average: number
    high: number
  }
  weights: {
    low: number
    average: number
    high: number
  }
}

interface GSC {
  id: number
  name: string
  description: string
  value: number
}

interface FPAResults {
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

const functionTypes: FunctionType[] = [
  {
    name: "External Inputs (EI)",
    description: "Data or control information that enters the application from outside its boundary",
    counts: { low: 0, average: 0, high: 0 },
    weights: { low: 3, average: 4, high: 6 },
  },
  {
    name: "External Outputs (EO)",
    description: "Data or control information that leaves the application boundary",
    counts: { low: 0, average: 0, high: 0 },
    weights: { low: 4, average: 5, high: 7 },
  },
  {
    name: "External Inquiries (EQ)",
    description: "Input-output combinations where input causes immediate output",
    counts: { low: 0, average: 0, high: 0 },
    weights: { low: 3, average: 4, high: 6 },
  },
  {
    name: "Internal Logical Files (ILF)",
    description: "User identifiable groups of logically related data maintained within the application boundary",
    counts: { low: 0, average: 0, high: 0 },
    weights: { low: 7, average: 10, high: 15 },
  },
  {
    name: "External Interface Files (EIF)",
    description:
      "User identifiable groups of logically related data referenced by the application but maintained by another application",
    counts: { low: 0, average: 0, high: 0 },
    weights: { low: 5, average: 7, high: 10 },
  },
]

const generalSystemCharacteristics: GSC[] = [
  {
    id: 1,
    name: "Data Communications",
    description: "The degree to which the application communicates directly with the processor",
    value: 0,
  },
  {
    id: 2,
    name: "Distributed Data Processing",
    description: "The degree to which the application transfers data among components",
    value: 0,
  },
  { id: 3, name: "Performance", description: "The performance requirements of the user", value: 0 },
  {
    id: 4,
    name: "Heavily Used Configuration",
    description: "The degree to which computer resource restrictions influence development",
    value: 0,
  },
  { id: 5, name: "Transaction Rate", description: "The rate of business transactions", value: 0 },
  { id: 6, name: "Online Data Entry", description: "The percentage of information that is entered online", value: 0 },
  {
    id: 7,
    name: "End-User Efficiency",
    description: "The degree to which the application was designed for end-user efficiency",
    value: 0,
  },
  {
    id: 8,
    name: "Online Update",
    description: "The degree to which internal logical files are updated online",
    value: 0,
  },
  {
    id: 9,
    name: "Complex Processing",
    description: "The degree to which processing logic influences development",
    value: 0,
  },
  {
    id: 10,
    name: "Reusability",
    description: "The degree to which the application and its code can be reused",
    value: 0,
  },
  {
    id: 11,
    name: "Installation Ease",
    description: "The degree to which conversion from previous environments influenced development",
    value: 0,
  },
  {
    id: 12,
    name: "Operational Ease",
    description: "The degree to which operational aspects influence development",
    value: 0,
  },
  {
    id: 13,
    name: "Multiple Sites",
    description: "The degree to which the application is designed for multiple installations",
    value: 0,
  },
  {
    id: 14,
    name: "Facilitate Change",
    description: "The degree to which the application facilitates change",
    value: 0,
  },
]

export function FunctionPointAnalysis() {
  const [functionTypesState, setFunctionTypesState] = useState<FunctionType[]>(functionTypes)
  const [gscState, setGscState] = useState<GSC[]>(generalSystemCharacteristics)
  const [productivityFactor, setProductivityFactor] = useState<number>(20)
  const [results, setResults] = useState<FPAResults | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("function-counts")

  const handleFunctionTypeChange = (index: number, complexity: Complexity, value: string) => {
    const newValue = Number.parseInt(value) || 0
    if (newValue < 0) return

    const updatedFunctionTypes = [...functionTypesState]
    updatedFunctionTypes[index].counts[complexity] = newValue
    setFunctionTypesState(updatedFunctionTypes)
  }

  const handleGscChange = (index: number, value: number[]) => {
    const updatedGsc = [...gscState]
    updatedGsc[index].value = value[0]
    setGscState(updatedGsc)
  }

  const calculateFunctionPoints = () => {
    try {
      // Calculate unadjusted function points
      let unadjustedFP = 0
      const functionTypeCounts = functionTypesState.map((type) => {
        const typeFP =
          type.counts.low * type.weights.low +
          type.counts.average * type.weights.average +
          type.counts.high * type.weights.high

        unadjustedFP += typeFP

        return {
          name: type.name,
          total: type.counts.low + type.counts.average + type.counts.high,
          fp: typeFP,
        }
      })

      // Calculate Value Adjustment Factor (VAF)
      const totalGSC = gscState.reduce((sum, gsc) => sum + gsc.value, 0)
      const vaf = 0.65 + 0.01 * totalGSC

      // Calculate adjusted function points
      const adjustedFP = unadjustedFP * vaf

      // Calculate effort in person-hours
      const effort = adjustedFP * productivityFactor

      setResults({
        unadjustedFP,
        vaf,
        adjustedFP,
        effort,
        functionTypeCounts,
      })

      setError(null)
    } catch (err) {
      setError("An error occurred during calculation. Please check your inputs.")
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="function-counts" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="function-counts">Function Counts</TabsTrigger>
          <TabsTrigger value="system-characteristics">System Characteristics</TabsTrigger>
        </TabsList>

        <TabsContent value="function-counts">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {functionTypesState.map((type, index) => (
                  <div key={type.name} className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">{type.name}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${type.name}-low`}>Low Complexity</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id={`${type.name}-low`}
                            type="number"
                            min="0"
                            value={type.counts.low}
                            onChange={(e) => handleFunctionTypeChange(index, "low", e.target.value)}
                          />
                          <span className="text-sm text-muted-foreground">× {type.weights.low}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${type.name}-average`}>Average Complexity</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id={`${type.name}-average`}
                            type="number"
                            min="0"
                            value={type.counts.average}
                            onChange={(e) => handleFunctionTypeChange(index, "average", e.target.value)}
                          />
                          <span className="text-sm text-muted-foreground">× {type.weights.average}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${type.name}-high`}>High Complexity</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id={`${type.name}-high`}
                            type="number"
                            min="0"
                            value={type.counts.high}
                            onChange={(e) => handleFunctionTypeChange(index, "high", e.target.value)}
                          />
                          <span className="text-sm text-muted-foreground">× {type.weights.high}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="space-y-2">
                  <Label htmlFor="productivity-factor">Productivity Factor (hours per function point)</Label>
                  <Input
                    id="productivity-factor"
                    type="number"
                    min="1"
                    value={productivityFactor}
                    onChange={(e) => setProductivityFactor(Number.parseInt(e.target.value) || 20)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Industry average is 20 hours per function point. Adjust based on team experience and project
                    complexity.
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-characteristics">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Rate each characteristic from 0 (no influence) to 5 (strong influence) to determine the Value
                  Adjustment Factor (VAF).
                </p>

                {gscState.map((gsc, index) => (
                  <div key={gsc.id} className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor={`gsc-${gsc.id}`}>{gsc.name}</Label>
                      <span className="font-medium">{gsc.value}</span>
                    </div>
                    <Slider
                      id={`gsc-${gsc.id}`}
                      min={0}
                      max={5}
                      step={1}
                      value={[gsc.value]}
                      onValueChange={(value) => handleGscChange(index, value)}
                    />
                    <p className="text-xs text-muted-foreground">{gsc.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={calculateFunctionPoints}>Calculate Function Points</Button>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Function Point Results</h2>
              <FunctionPointResults results={results} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Function Point Distribution</h2>
              <FunctionPointChart results={results} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
