const TEAM_PASSWORDS: Record<string, string> = {
  'group-1': import.meta.env.VITE_PASSWORD_GROUP_1,
  'group-2': import.meta.env.VITE_PASSWORD_GROUP_2,
  'group-3': import.meta.env.VITE_PASSWORD_GROUP_3,
  'group-4': import.meta.env.VITE_PASSWORD_GROUP_4,
  'group-5': import.meta.env.VITE_PASSWORD_GROUP_5,
  'group-6': import.meta.env.VITE_PASSWORD_GROUP_6,
};

export function checkPassword(teamId: string, input: string): boolean {
  return TEAM_PASSWORDS[teamId] === input;
}
