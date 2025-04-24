"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CostDriverRating, CostDrivers, ProjectType, Results } from "./cocomo-calculator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface IntermediateModeProps {
  onCalculate: (results: Results, kloc: number, projectType: ProjectType) => void
}

// Cost driver multipliers
const costDriverMultipliers = {
  RELY: { "very-low": 0.75, low: 0.88, nominal: 1.0, high: 1.15, "very-high": 1.4, "extra-high": null },
  DATA: { "very-low": null, low: 0.94, nominal: 1.0, high: 1.08, "very-high": 1.16, "extra-high": null },
  CPLX: { "very-low": 0.7, low: 0.85, nominal: 1.0, high: 1.15, "very-high": 1.3, "extra-high": 1.65 },
  TIME: { "very-low": null, low: null, nominal: 1.0, high: 1.11, "very-high": 1.3, "extra-high": 1.66 },
  STOR: { "very-low": null, low: null, nominal: 1.0, high: 1.06, "very-high": 1.21, "extra-high": 1.56 },
  VIRT: { "very-low": null, low: 0.87, nominal: 1.0, high: 1.15, "very-high": 1.3, "extra-high": null },
  TURN: { "very-low": null, low: 0.87, nominal: 1.0, high: 1.07, "very-high": 1.15, "extra-high": null },
  ACAP: { "very-low": 1.46, low: 1.19, nominal: 1.0, high: 0.86, "very-high": 0.71, "extra-high": null },
  AEXP: { "very-low": 1.29, low: 1.13, nominal: 1.0, high: 0.91, "very-high": 0.82, "extra-high": null },
  PCAP: { "very-low": 1.42, low: 1.17, nominal: 1.0, high: 0.86, "very-high": 0.7, "extra-high": null },
  VEXP: { "very-low": 1.21, low: 1.1, nominal: 1.0, high: 0.9, "very-high": null, "extra-high": null },
  LEXP: { "very-low": 1.14, low: 1.07, nominal: 1.0, high: 0.95, "very-high": null, "extra-high": null },
  MODP: { "very-low": 1.24, low: 1.1, nominal: 1.0, high: 0.91, "very-high": 0.82, "extra-high": null },
  TOOL: { "very-low": 1.24, low: 1.1, nominal: 1.0, high: 0.91, "very-high": 0.83, "extra-high": null },
  SCED: { "very-low": 1.23, low: 1.08, nominal: 1.0, high: 1.04, "very-high": 1.1, "extra-high": null },
}

// Cost driver descriptions
const costDriverDescriptions = {
  RELY: "Required Software Reliability",
  DATA: "Size of Application Database",
  CPLX: "Complexity of the Product",
  TIME: "Runtime Performance Constraints",
  STOR: "Memory Constraints",
  VIRT: "Volatility of the Virtual Machine Environment",
  TURN: "Required Turnaround Time",
  ACAP: "Analyst Capability",
  AEXP: "Applications Experience",
  PCAP: "Programmer Capability",
  VEXP: "Virtual Machine Experience",
  LEXP: "Programming Language Experience",
  MODP: "Use of Modern Programming Practices",
  TOOL: "Use of Software Tools",
  SCED: "Required Development Schedule",
}

// Group cost drivers by category
const costDriverGroups = {
  "Product Attributes": ["RELY", "DATA", "CPLX", "TIME", "STOR", "VIRT", "TURN"],
  "Personnel Attributes": ["ACAP", "AEXP", "PCAP", "VEXP", "LEXP"],
  "Project Attributes": ["MODP", "TOOL", "SCED"],
}

export function IntermediateMode({ onCalculate }: IntermediateModeProps) {
  const [kloc, setKloc] = useState<string>("")
  const [projectType, setProjectType] = useState<ProjectType>("organic")
  const [costDrivers, setCostDrivers] = useState<CostDrivers>({
    RELY: "nominal",
    DATA: "nominal",
    CPLX: "nominal",
    TIME: "nominal",
    STOR: "nominal",
    VIRT: "nominal",
    TURN: "nominal",
    ACAP: "nominal",
    AEXP: "nominal",
    PCAP: "nominal",
    VEXP: "nominal",
    LEXP: "nominal",
    MODP: "nominal",
    TOOL: "nominal",
    SCED: "nominal",
  })
  const [error, setError] = useState<string | null>(null)

  const handleKlocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKloc(e.target.value)
    setError(null)
  }

  const handleProjectTypeChange = (value: string) => {
    setProjectType(value as ProjectType)
  }

  const handleCostDriverChange = (driver: keyof CostDrivers, value: string) => {
    setCostDrivers((prev) => ({
      ...prev,
      [driver]: value as CostDriverRating,
    }))
  }

  const calculateEAF = () => {
    let eaf = 1.0

    // Multiply all cost driver values
    Object.entries(costDrivers).forEach(([driver, rating]) => {
      const driverKey = driver as keyof typeof costDriverMultipliers
      const ratingKey = rating as keyof (typeof costDriverMultipliers)[typeof driverKey]
      const multiplier = costDriverMultipliers[driverKey][ratingKey]

      if (multiplier !== null) {
        eaf *= multiplier
      }
    })

    return eaf
  }

  const calculateIntermediateCocomo = () => {
    const klocValue = Number.parseFloat(kloc)

    if (isNaN(klocValue) || klocValue <= 0) {
      setError("Please enter a valid positive number for KLOC")
      return
    }

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

    // Calculate EAF
    const eaf = calculateEAF()

    // Calculate effort, time, staff, and productivity with EAF
    const effort = a * Math.pow(klocValue, b) * eaf
    const time = c * Math.pow(effort, d)
    const staff = effort / time
    const productivity = klocValue / effort

    const results: Results = {
      effort,
      time,
      staff,
      productivity,
      eaf,
    }

    onCalculate(results, klocValue, projectType)
  }

  // Helper function to render available ratings for a cost driver
  const renderRatingOptions = (driver: keyof CostDrivers) => {
    const driverMultipliers = costDriverMultipliers[driver]
    return Object.entries(driverMultipliers)
      .map(([rating, value]) => {
        if (value === null) return null
        return (
          <SelectItem key={rating} value={rating}>
            {rating
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </SelectItem>
        )
      })
      .filter(Boolean)
  }

  // Render cost driver selects by group
  const renderCostDriverGroups = () => {
    return Object.entries(costDriverGroups).map(([groupName, drivers]) => (
      <AccordionItem key={groupName} value={groupName}>
        <AccordionTrigger>{groupName}</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drivers.map((driver) => {
              const driverKey = driver as keyof CostDrivers
              return (
                <div key={driver} className="space-y-2">
                  <Label htmlFor={driver}>{costDriverDescriptions[driverKey]}</Label>
                  <Select
                    value={costDrivers[driverKey]}
                    onValueChange={(value) => handleCostDriverChange(driverKey, value)}
                  >
                    <SelectTrigger id={driver}>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>{renderRatingOptions(driverKey)}</SelectContent>
                  </Select>
                </div>
              )
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    ))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="kloc-intermediate">KLOC (Thousands of Lines of Code)</Label>
            <Input
              id="kloc-intermediate"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="Enter KLOC"
              value={kloc}
              onChange={handleKlocChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-type-intermediate">Project Type</Label>
            <Select value={projectType} onValueChange={handleProjectTypeChange}>
              <SelectTrigger id="project-type-intermediate">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="organic">Organic</SelectItem>
                <SelectItem value="semi-detached">Semi-Detached</SelectItem>
                <SelectItem value="embedded">Embedded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Accordion type="multiple" defaultValue={["Product Attributes"]}>
          {renderCostDriverGroups()}
        </Accordion>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button className="w-full" onClick={calculateIntermediateCocomo}>
          Calculate
        </Button>
      </div>
    </div>
  )
}
