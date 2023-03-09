import { Vote } from "./Vote"

export enum AnalysisStatus {
  Pending,
  Accepted,
  Declined,
}

export class Analysis {
  public readonly id: string
  private readonly _votes: Vote[]
  public readonly status: AnalysisStatus
  public readonly userId: string

  public get votes(): readonly Vote[] {
    return this._votes
  }

  public constructor(
    id: string,
    votes: Vote[],
    userId: string,
    status: AnalysisStatus
  ) {
    this.id = id
    this._votes = votes
    this.userId = userId
    this.status = status
  }

  public vote(vote: Vote): void {
    if (this.isOwner(vote)) {
      throw new Error("cannot vote on your own analysis")
    }

    if (!this.inProgress()) {
      throw new Error("You cannot vote on this analysis since its already done")
    }

    if (this.hasAlreadyVoted(vote)) {
      throw new Error("You already voted")
    }

    this._votes.push(vote)
  }

  private isOwner(vote: Vote): boolean {
    return this.userId === vote.userId
  }

  private hasAlreadyVoted(voter: Vote): boolean {
    return this._votes.some((vote) => vote.isOwner(voter))
  }

  private inProgress(): boolean {
    return this.status === AnalysisStatus.Pending
  }
}
