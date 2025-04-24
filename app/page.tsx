import { CococoCalculator } from "@/components/cocomo-calculator"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">COCOMO Effort Estimation</h1>
        <p className="text-muted-foreground text-center mb-8">
          Estimate software development effort using the Constructive Cost Model
        </p>
        <CococoCalculator />
      </div>
    </main>
  )
}
