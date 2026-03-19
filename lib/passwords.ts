const TEAM_PASSWORDS: Record<string, string> = {
  'group-1': process.env.NEXT_PUBLIC_PASSWORD_GROUP_1 as string,
  'group-2': process.env.NEXT_PUBLIC_PASSWORD_GROUP_2 as string,
  'group-3': process.env.NEXT_PUBLIC_PASSWORD_GROUP_3 as string,
  'group-4': process.env.NEXT_PUBLIC_PASSWORD_GROUP_4 as string,
  'group-5': process.env.NEXT_PUBLIC_PASSWORD_GROUP_5 as string,
  'group-6': process.env.NEXT_PUBLIC_PASSWORD_GROUP_6 as string,
}

export function checkPassword(teamId: string, input: string): boolean {
  return TEAM_PASSWORDS[teamId] === input
}
