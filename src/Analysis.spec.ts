import { Analysis, AnalysisStatus } from "./Analysis"
import { VoteFactory } from "./Vote"

describe("analysis", () => {
  describe("adding a vote", () => {
    test("adds a vote", () => {
      const vote = VoteFactory.agreed("userId")
      const analysis = new Analysis("id", [], "john", AnalysisStatus.Pending)

      analysis.vote(vote)

      expect(analysis.votes).toContain(vote)
    })

    test("cannot vote when owner", () => {
      const vote = VoteFactory.agreed("userId")
      const analysis = new Analysis("id", [], "userId", AnalysisStatus.Pending)

      const act = (): void => analysis.vote(vote)

      expect(act).toThrowError()
    })

    test("cannot vote when already voted", () => {
      const vote = VoteFactory.agreed("userId")
      const analysis = new Analysis(
        "id",
        [vote],
        "john",
        AnalysisStatus.Pending
      )
      const oneMoreVote = VoteFactory.disagreed("userId")

      const act = (): void => analysis.vote(oneMoreVote)

      expect(act).toThrowError()
    })

    test.each([[AnalysisStatus.Accepted], [AnalysisStatus.Declined]])(
      "cannot vote when the analysis is not in a pending state",
      (status: AnalysisStatus) => {
        const vote = VoteFactory.agreed("userId")
        const analysis = new Analysis("id", [], "john", status)

        const act = (): void => analysis.vote(vote)

        expect(act).toThrowError()
      }
    )
  })
})
