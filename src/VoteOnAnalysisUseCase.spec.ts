import { mock } from "jest-mock-extended"
import { Analysis, AnalysisStatus } from "./Analysis"
import { IAnalysisRepository } from "./IAnalysisRepository"
import { IKataRepository } from "./IKataRepository"
import { VoteFactory } from "./Vote"
import { VoteOnAnalysisUseCase } from "./VoteOnAnalysisUseCase"

describe("vote on analysis use case", () => {
  test("adds a vote", async () => {
    const userId = "userId"
    const kataRepository = mock<IKataRepository>()
    const analysisRepository = mock<IAnalysisRepository>()
    const vote = VoteFactory.agreed(userId)
    const analysis = new Analysis("id", [], "john", AnalysisStatus.Pending)
    const sut = new VoteOnAnalysisUseCase(analysisRepository, kataRepository)

    analysisRepository.load.mockResolvedValueOnce(analysis)

    await sut.execute({
      id: analysis.id,
      agreed: true,
      userId,
    })

    expect(analysisRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        votes: [vote],
      })
    )
  })

  test("throws an exception when the analysis does not exist", async () => {
    const userId = "userId"
    const kataRepository = mock<IKataRepository>()
    const analysisRepository = mock<IAnalysisRepository>()
    const sut = new VoteOnAnalysisUseCase(analysisRepository, kataRepository)

    analysisRepository.load.mockResolvedValueOnce(null)

    const act = (): Promise<void> =>
      sut.execute({
        id: "id",
        agreed: true,
        userId,
      })

    expect(act).rejects.toThrowError()
  })

  // test("cannot vote when they are the owner of the analysis", async () => {
  //   const userId = "owner"
  //   const kataRepository = mock<IKataRepository>()
  //   const analysisRepository = mock<IAnalysisRepository>()
  //   const analysis = new Analysis("id", [], "owner", AnalysisStatus.Pending)
  //   const sut = new VoteOnAnalysisUseCase(analysisRepository, kataRepository)

  //   analysisRepository.load.mockResolvedValueOnce(analysis)

  //   const act = (): Promise<void> =>
  //     sut.execute({
  //       id: analysis.id,
  //       agreed: true,
  //       userId,
  //     })

  //   expect(act).rejects.toThrowError()
  // })

  // test("cannot vote when already voted", () => {
  //   const userId = "userId"
  //   const kataRepository = mock<IKataRepository>()
  //   const analysisRepository = mock<IAnalysisRepository>()
  //   const vote = VoteFactory.agreed(userId)
  //   const analysis = new Analysis("id", [vote], "owner", AnalysisStatus.Pending)
  //   const sut = new VoteOnAnalysisUseCase(analysisRepository, kataRepository)

  //   analysisRepository.load.mockResolvedValueOnce(analysis)

  //   const act = (): Promise<void> =>
  //     sut.execute({
  //       id: analysis.id,
  //       agreed: true,
  //       userId,
  //     })

  //   expect(act).rejects.toThrowError()
  // })

  // test.each([[AnalysisStatus.Accepted], [AnalysisStatus.Declined]])(
  //   "cannot vote when the analysis is not in a pending state",
  //   async (status: AnalysisStatus) => {
  //     const userId = "userId"
  //     const kataRepository = mock<IKataRepository>()
  //     const analysisRepository = mock<IAnalysisRepository>()
  //     const analysis = new Analysis("id", [], "owner", status)
  //     const sut = new VoteOnAnalysisUseCase(analysisRepository, kataRepository)

  //     analysisRepository.load.mockResolvedValueOnce(analysis)

  //     const act = (): Promise<void> =>
  //       sut.execute({
  //         id: analysis.id,
  //         agreed: true,
  //         userId,
  //       })

  //     expect(act).rejects.toThrowError()
  //   }
  // )
})
