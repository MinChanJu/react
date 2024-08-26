export type User = {
  id: number,
  name: string,
  userId: string,
  userPw: string,
  phone: string,
  email: string,
  authority: number,
  createdAt: string,
}

export type Contest = {
  id: number,
  userId: string,
  contestName: string,
  contestDescription: string,
  contestPw: string,
  createdAt: string,
}

export type Problem = {
  id: number,
  contestId: number,
  contestName: string;
  userId: string,
  problemName: string,
  problemDescription: string,
  problemInputDescription: string,
  problemOutputDescription: string,
  problemExampleInput: string,
  problemExampleOutput: string,
  createdAt: string,
}