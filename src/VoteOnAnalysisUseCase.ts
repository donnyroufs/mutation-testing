import { AnalysisNotFoundException } from "./AnalysisNotFoundException"
import { IAnalysisRepository } from "./IAnalysisRepository"
import { IKataRepository } from "./IKataRepository"
import { VoteFactory } from "./Vote"

export interface IUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>
}

export interface IVoteOnAnalysisRequest {
  id: string
  userId: string
  agreed: boolean
}

export class VoteOnAnalysisUseCase
  implements IUseCase<IVoteOnAnalysisRequest, void>
{
  public constructor(
    private readonly _analysisRepository: IAnalysisRepository,
    private readonly _kataRepository: IKataRepository
  ) {}

  public async execute(input: IVoteOnAnalysisRequest): Promise<void> {
    const analysis = await this._analysisRepository.load(input.id)

    if (analysis === null) {
      throw new AnalysisNotFoundException()
    }

    analysis.vote(
      input.agreed
        ? VoteFactory.agreed(input.userId)
        : VoteFactory.disagreed(input.userId)
    )

    await this._analysisRepository.save(analysis)
  }
}
