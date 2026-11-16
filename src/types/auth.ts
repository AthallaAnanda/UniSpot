export type Profile = { name: string; role: "Student" | "Community"; campus: string; bio: string; joinedAt?: string };
export const emptyProfile: Profile = { name: "", role: "Student", campus: "", bio: "" };
