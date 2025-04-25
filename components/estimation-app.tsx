"use client"

import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { CococoCalculator } from "@/components/cocomo-calculator"
import { FunctionPointAnalysis } from "@/components/function-point-analysis"
import { UseCasePoints } from "@/components/use-case-points"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Calculator, FileCode, GitMerge } from "lucide-react"

type EstimationMethod = "cocomo" | "function-points" | "use-case-points"

export function EstimationApp() {
  const [activeMethod, setActiveMethod] = useState<EstimationMethod>("cocomo")

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader className="flex items-center justify-between p-4">
            <h1 className="text-lg font-bold">Estimation Tools</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeMethod === "cocomo"} onClick={() => setActiveMethod("cocomo")}>
                  <Calculator className="h-5 w-5" />
                  <span>COCOMO</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMethod === "function-points"}
                  onClick={() => setActiveMethod("function-points")}
                >
                  <FileCode className="h-5 w-5" />
                  <span>Function Points</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMethod === "use-case-points"}
                  onClick={() => setActiveMethod("use-case-points")}
                >
                  <GitMerge className="h-5 w-5" />
                  <span>Use Case Points</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">v1.0.0</span>
              <ThemeToggle />
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-3xl font-bold">
                  {activeMethod === "cocomo" && "COCOMO Estimation"}
                  {activeMethod === "function-points" && "Function Point Analysis"}
                  {activeMethod === "use-case-points" && "Use Case Points Estimation"}
                </h1>
                <p className="text-muted-foreground">
                  {activeMethod === "cocomo" && "Constructive Cost Model for Software Estimation"}
                  {activeMethod === "function-points" && "Measure software size based on functionality"}
                  {activeMethod === "use-case-points" && "Estimate effort based on use cases"}
                </p>
              </div>
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
            </div>

            {activeMethod === "cocomo" && <CococoCalculator />}
            {activeMethod === "function-points" && <FunctionPointAnalysis />}
            {activeMethod === "use-case-points" && <UseCasePoints />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
