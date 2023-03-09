enum VoteType {
  Agreed,
  Disagreed,
}

export class Vote {
  public constructor(
    public readonly type: VoteType,
    public readonly userId: string
  ) {}

  public isOwner(vote: Vote): boolean {
    return this.userId === vote.userId
  }
}

export class VoteFactory {
  public static agreed(userId: string): Vote {
    return new Vote(VoteType.Agreed, userId)
  }

  public static disagreed(userId: string): Vote {
    return new Vote(VoteType.Disagreed, userId)
  }
}
