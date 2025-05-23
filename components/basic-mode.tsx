"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ProjectType, Results } from "./cocomo-calculator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Update the BasicModeProps interface to include onCoefficientsChange
interface BasicModeProps {
  onCalculate: (results: Results, kloc: number, projectType: ProjectType) => void
  onCoefficientsChange: (coefficients: { a: number; b: number; c: number; d: number }) => void
}

// Update the component to include coefficient inputs
export function BasicMode({ onCalculate, onCoefficientsChange }: BasicModeProps) {
  const [kloc, setKloc] = useState<string>("")
  const [projectType, setProjectType] = useState<ProjectType>("organic")
  const [error, setError] = useState<string | null>(null)
  const [coefficients, setCoefficients] = useState<{ a: number; b: number; c: number; d: number }>({
    a: 2.4,
    b: 1.05,
    c: 2.5,
    d: 0.38,
  })

  const handleKlocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKloc(e.target.value)
    setError(null)
  }

  const handleProjectTypeChange = (value: string) => {
    setProjectType(value as ProjectType)

    // Set default coefficients based on project type
    let a, b, c, d
    switch (value) {
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

    const newCoefficients = { a, b, c, d }
    setCoefficients(newCoefficients)
    onCoefficientsChange(newCoefficients)
  }

  const handleCoefficientChange = (coefficient: keyof typeof coefficients, value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      const newCoefficients = { ...coefficients, [coefficient]: numValue }
      setCoefficients(newCoefficients)
      onCoefficientsChange(newCoefficients)
    }
  }

  const calculateBasicCocomo = () => {
    const klocValue = Number.parseFloat(kloc)

    if (isNaN(klocValue) || klocValue <= 0) {
      setError("Please enter a valid positive number for KLOC")
      return
    }

    // Use user-defined coefficients
    const { a, b, c, d } = coefficients

    // Calculate effort, time, staff, and productivity
    const effort = a * Math.pow(klocValue, b)
    const time = c * Math.pow(effort, d)
    const staff = effort / time
    const productivity = klocValue / effort

    const results: Results = {
      effort,
      time,
      staff,
      productivity,
    }

    onCalculate(results, klocValue, projectType)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="kloc">KLOC (Thousands of Lines of Code)</Label>
          <Input
            id="kloc"
            type="number"
            min="0.1"
            step="0.1"
            placeholder="Enter KLOC"
            value={kloc}
            onChange={handleKlocChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="project-type">Project Type</Label>
          <Select value={projectType} onValueChange={handleProjectTypeChange}>
            <SelectTrigger id="project-type">
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="organic">Organic</SelectItem>
              <SelectItem value="semi-detached">Semi-Detached</SelectItem>
              <SelectItem value="embedded">Embedded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-md font-medium">COCOMO Coefficients</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coefficient-a">Coefficient a</Label>
              <Input
                id="coefficient-a"
                type="number"
                min="0.1"
                step="0.1"
                value={coefficients.a}
                onChange={(e) => handleCoefficientChange("a", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coefficient-b">Coefficient b</Label>
              <Input
                id="coefficient-b"
                type="number"
                min="0.1"
                step="0.01"
                value={coefficients.b}
                onChange={(e) => handleCoefficientChange("b", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coefficient-c">Coefficient c</Label>
              <Input
                id="coefficient-c"
                type="number"
                min="0.1"
                step="0.1"
                value={coefficients.c}
                onChange={(e) => handleCoefficientChange("c", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coefficient-d">Coefficient d</Label>
              <Input
                id="coefficient-d"
                type="number"
                min="0.1"
                step="0.01"
                value={coefficients.d}
                onChange={(e) => handleCoefficientChange("d", e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Default values are set based on project type. You can customize these coefficients for your specific project
            needs.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button className="w-full" onClick={calculateBasicCocomo}>
          Calculate
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Project Type Description:</h3>
        <div className="text-sm text-muted-foreground">
          {projectType === "organic" && (
            <p>Organic: Small teams with good experience working with less rigid requirements.</p>
          )}
          {projectType === "semi-detached" && (
            <p>
              Semi-Detached: Medium-sized teams with mixed experience working with a mix of rigid and less rigid
              requirements.
            </p>
          )}
          {projectType === "embedded" && (
            <p>
              Embedded: Developed within tight constraints with a combination of hardware, software, and operational
              procedures.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
