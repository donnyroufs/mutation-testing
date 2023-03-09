import { Analysis } from "./Analysis"

export interface IAnalysisRepository {
  save(analysis: Analysis): Promise<void>
  load(id: string): Promise<Analysis | null>
}
