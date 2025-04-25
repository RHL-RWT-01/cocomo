"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { UseCasePointsResults } from "@/components/use-case-points-results"
import { UseCasePointsChart } from "@/components/use-case-points-chart"

interface ActorType {
  name: string
  description: string
  weight: number
  count: number
}

interface UseCaseType {
  name: string
  description: string
  weight: number
  count: number
}

interface TechnicalFactor {
  id: string
  name: string
  description: string
  weight: number
  value: number
}

interface EnvironmentalFactor {
  id: string
  name: string
  description: string
  weight: number
  value: number
}

interface UCPResults {
  uaw: number
  uucw: number
  tcf: number
  ecf: number
  ucp: number
  effort: number
}

const actorTypes: ActorType[] = [
  {
    name: "Simple",
    description: "External system with defined API",
    weight: 1,
    count: 0,
  },
  {
    name: "Average",
    description: "External system interacting through protocol",
    weight: 2,
    count: 0,
  },
  {
    name: "Complex",
    description: "Human interacting through GUI or web interface",
    weight: 3,
    count: 0,
  },
]

const useCaseTypes: UseCaseType[] = [
  {
    name: "Simple",
    description: "1-3 transactions, simple UI, simple processing logic",
    weight: 5,
    count: 0,
  },
  {
    name: "Average",
    description: "4-7 transactions, moderate UI, moderate processing logic",
    weight: 10,
    count: 0,
  },
  {
    name: "Complex",
    description: "8+ transactions, complex UI, complex processing logic",
    weight: 15,
    count: 0,
  },
]

const technicalFactors: TechnicalFactor[] = [
  { id: "T1", name: "Distributed System", description: "System components are distributed", weight: 2.0, value: 0 },
  {
    id: "T2",
    name: "Performance",
    description: "Response time or throughput performance objectives",
    weight: 1.0,
    value: 0,
  },
  {
    id: "T3",
    name: "End-user Efficiency",
    description: "Focus on making the end user efficient",
    weight: 1.0,
    value: 0,
  },
  { id: "T4", name: "Complex Processing", description: "Complex processing logic", weight: 1.0, value: 0 },
  { id: "T5", name: "Reusability", description: "Code must be reusable in other applications", weight: 1.0, value: 0 },
  { id: "T6", name: "Easy Installation", description: "Ease of installation is important", weight: 0.5, value: 0 },
  { id: "T7", name: "Usability", description: "Ease of use is important", weight: 0.5, value: 0 },
  {
    id: "T8",
    name: "Cross-platform Support",
    description: "Application runs on multiple platforms",
    weight: 2.0,
    value: 0,
  },
  { id: "T9", name: "Easy to Change", description: "System is easy to modify", weight: 1.0, value: 0 },
  { id: "T10", name: "Concurrent Use", description: "Application supports concurrent users", weight: 1.0, value: 0 },
  { id: "T11", name: "Security", description: "Special security features", weight: 1.0, value: 0 },
  {
    id: "T12",
    name: "Direct Access for Third Parties",
    description: "Direct access for third parties",
    weight: 1.0,
    value: 0,
  },
  {
    id: "T13",
    name: "Special Training Required",
    description: "Special user training required",
    weight: 1.0,
    value: 0,
  },
]

const environmentalFactors: EnvironmentalFactor[] = [
  {
    id: "E1",
    name: "Familiar with Development Process",
    description: "Team's familiarity with development process",
    weight: 1.5,
    value: 0,
  },
  {
    id: "E2",
    name: "Application Experience",
    description: "Team's experience with similar applications",
    weight: 0.5,
    value: 0,
  },
  {
    id: "E3",
    name: "Object-Oriented Experience",
    description: "Team's experience with object-oriented approach",
    weight: 1.0,
    value: 0,
  },
  { id: "E4", name: "Lead Analyst Capability", description: "Capability of the lead analyst", weight: 0.5, value: 0 },
  { id: "E5", name: "Motivation", description: "Team's motivation level", weight: 1.0, value: 0 },
  { id: "E6", name: "Stable Requirements", description: "Stability of requirements", weight: 2.0, value: 0 },
  {
    id: "E7",
    name: "Part-time Workers",
    description: "Use of part-time workers (negative factor)",
    weight: -1.0,
    value: 0,
  },
  {
    id: "E8",
    name: "Difficult Programming Language",
    description: "Difficulty of programming language (negative factor)",
    weight: -1.0,
    value: 0,
  },
]

export function UseCasePoints() {
  const [actorTypesState, setActorTypesState] = useState<ActorType[]>(actorTypes)
  const [useCaseTypesState, setUseCaseTypesState] = useState<UseCaseType[]>(useCaseTypes)
  const [technicalFactorsState, setTechnicalFactorsState] = useState<TechnicalFactor[]>(technicalFactors)
  const [environmentalFactorsState, setEnvironmentalFactorsState] =
    useState<EnvironmentalFactor[]>(environmentalFactors)
  const [productivityFactor, setProductivityFactor] = useState<number>(20)
  const [results, setResults] = useState<UCPResults | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("actors-use-cases")

  const handleActorCountChange = (index: number, value: string) => {
    const newValue = Number.parseInt(value) || 0
    if (newValue < 0) return

    const updatedActorTypes = [...actorTypesState]
    updatedActorTypes[index].count = newValue
    setActorTypesState(updatedActorTypes)
  }

  const handleUseCaseCountChange = (index: number, value: string) => {
    const newValue = Number.parseInt(value) || 0
    if (newValue < 0) return

    const updatedUseCaseTypes = [...useCaseTypesState]
    updatedUseCaseTypes[index].count = newValue
    setUseCaseTypesState(updatedUseCaseTypes)
  }

  const handleTechnicalFactorChange = (index: number, value: number[]) => {
    const updatedFactors = [...technicalFactorsState]
    updatedFactors[index].value = value[0]
    setTechnicalFactorsState(updatedFactors)
  }

  const handleEnvironmentalFactorChange = (index: number, value: number[]) => {
    const updatedFactors = [...environmentalFactorsState]
    updatedFactors[index].value = value[0]
    setEnvironmentalFactorsState(updatedFactors)
  }

  const calculateUseCasePoints = () => {
    try {
      // Calculate Unadjusted Actor Weight (UAW)
      const uaw = actorTypesState.reduce((sum, actor) => sum + actor.count * actor.weight, 0)

      // Calculate Unadjusted Use Case Weight (UUCW)
      const uucw = useCaseTypesState.reduce((sum, useCase) => sum + useCase.count * useCase.weight, 0)

      // Calculate Technical Complexity Factor (TCF)
      const tfSum = technicalFactorsState.reduce((sum, factor) => sum + factor.value * factor.weight, 0)
      const tcf = 0.6 + 0.01 * tfSum

      // Calculate Environmental Complexity Factor (ECF)
      const efSum = environmentalFactorsState.reduce((sum, factor) => sum + factor.value * factor.weight, 0)
      const ecf = 1.4 + -0.03 * efSum

      // Calculate Use Case Points (UCP)
      const ucp = (uaw + uucw) * tcf * ecf

      // Calculate Effort in person-hours
      const effort = ucp * productivityFactor

      setResults({
        uaw,
        uucw,
        tcf,
        ecf,
        ucp,
        effort,
      })

      setError(null)
    } catch (err) {
      setError("An error occurred during calculation. Please check your inputs.")
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="actors-use-cases" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="actors-use-cases">Actors & Use Cases</TabsTrigger>
          <TabsTrigger value="technical-factors">Technical Factors</TabsTrigger>
          <TabsTrigger value="environmental-factors">Environmental Factors</TabsTrigger>
        </TabsList>

        <TabsContent value="actors-use-cases">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Actor Types</h3>
                  <div className="space-y-4">
                    {actorTypesState.map((actor, index) => (
                      <div key={actor.name} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div>
                          <h4 className="font-medium">{actor.name}</h4>
                          <p className="text-sm text-muted-foreground">{actor.description}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">Weight: {actor.weight}</div>
                        <div>
                          <Label htmlFor={`actor-${actor.name}`}>Count</Label>
                          <Input
                            id={`actor-${actor.name}`}
                            type="number"
                            min="0"
                            value={actor.count}
                            onChange={(e) => handleActorCountChange(index, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Use Case Types</h3>
                  <div className="space-y-4">
                    {useCaseTypesState.map((useCase, index) => (
                      <div key={useCase.name} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div>
                          <h4 className="font-medium">{useCase.name}</h4>
                          <p className="text-sm text-muted-foreground">{useCase.description}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">Weight: {useCase.weight}</div>
                        <div>
                          <Label htmlFor={`usecase-${useCase.name}`}>Count</Label>
                          <Input
                            id={`usecase-${useCase.name}`}
                            type="number"
                            min="0"
                            value={useCase.count}
                            onChange={(e) => handleUseCaseCountChange(index, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ucp-productivity-factor">Productivity Factor (hours per UCP)</Label>
                  <Input
                    id="ucp-productivity-factor"
                    type="number"
                    min="1"
                    value={productivityFactor}
                    onChange={(e) => setProductivityFactor(Number.parseInt(e.target.value) || 20)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Industry average is 20 hours per UCP. Adjust based on team experience and project complexity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical-factors">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Rate each technical factor from 0 (no influence) to 5 (strong influence) to determine the Technical
                  Complexity Factor (TCF).
                </p>

                {technicalFactorsState.map((factor, index) => (
                  <div key={factor.id} className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor={`tf-${factor.id}`}>{factor.name}</Label>
                      <span className="font-medium">{factor.value}</span>
                    </div>
                    <Slider
                      id={`tf-${factor.id}`}
                      min={0}
                      max={5}
                      step={1}
                      value={[factor.value]}
                      onValueChange={(value) => handleTechnicalFactorChange(index, value)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{factor.description}</span>
                      <span>Weight: {factor.weight}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environmental-factors">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Rate each environmental factor from 0 (no influence) to 5 (strong influence) to determine the
                  Environmental Complexity Factor (ECF).
                </p>

                {environmentalFactorsState.map((factor, index) => (
                  <div key={factor.id} className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor={`ef-${factor.id}`}>{factor.name}</Label>
                      <span className="font-medium">{factor.value}</span>
                    </div>
                    <Slider
                      id={`ef-${factor.id}`}
                      min={0}
                      max={5}
                      step={1}
                      value={[factor.value]}
                      onValueChange={(value) => handleEnvironmentalFactorChange(index, value)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{factor.description}</span>
                      <span>Weight: {factor.weight}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={calculateUseCasePoints}>Calculate Use Case Points</Button>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Use Case Points Results</h2>
              <UseCasePointsResults results={results} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Use Case Points Distribution</h2>
              <UseCasePointsChart results={results} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
