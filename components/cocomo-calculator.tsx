"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { BasicMode } from "@/components/basic-mode"
import { IntermediateMode } from "@/components/intermediate-mode"
import { ResultsDisplay } from "@/components/results-display"
import { EffortChart } from "@/components/effort-chart"
import { ThemeToggle } from "@/components/theme-toggle"

export type ProjectType = "organic" | "semi-detached" | "embedded"
export type CostDriverRating = "very-low" | "low" | "nominal" | "high" | "very-high" | "extra-high"

export interface CostDrivers {
  RELY: CostDriverRating
  DATA: CostDriverRating
  CPLX: CostDriverRating
  TIME: CostDriverRating
  STOR: CostDriverRating
  VIRT: CostDriverRating
  TURN: CostDriverRating
  ACAP: CostDriverRating
  AEXP: CostDriverRating
  PCAP: CostDriverRating
  VEXP: CostDriverRating
  LEXP: CostDriverRating
  MODP: CostDriverRating
  TOOL: CostDriverRating
  SCED: CostDriverRating
}

export interface Results {
  effort: number
  time: number
  staff: number
  productivity: number
  eaf?: number
}

export function CococoCalculator() {
  const [activeTab, setActiveTab] = useState<string>("basic")
  const [basicResults, setBasicResults] = useState<Results | null>(null)
  const [intermediateResults, setIntermediateResults] = useState<Results | null>(null)
  const [kloc, setKloc] = useState<number>(0)
  const [projectType, setProjectType] = useState<ProjectType>("organic")

  const handleBasicCalculation = (results: Results, klocValue: number, type: ProjectType) => {
    setBasicResults(results)
    setKloc(klocValue)
    setProjectType(type)
  }

  const handleIntermediateCalculation = (results: Results, klocValue: number, type: ProjectType) => {
    setIntermediateResults(results)
    setKloc(klocValue)
    setProjectType(type)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>

      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Mode</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate Mode</TabsTrigger>
        </TabsList>
        <TabsContent value="basic">
          <Card>
            <CardContent className="pt-6">
              <BasicMode onCalculate={handleBasicCalculation} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="intermediate">
          <Card>
            <CardContent className="pt-6">
              <IntermediateMode onCalculate={handleIntermediateCalculation} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {(basicResults || intermediateResults) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Results</h2>
              <ResultsDisplay
                basicResults={basicResults}
                intermediateResults={intermediateResults}
                activeTab={activeTab}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Effort Visualization</h2>
              <EffortChart
                basicResults={basicResults}
                intermediateResults={intermediateResults}
                kloc={kloc}
                projectType={projectType}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
