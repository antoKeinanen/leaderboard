"use server";

import type { Gamemode, Entry } from "@prisma/client";
import { db } from "~/server/db";

export async function createEntry(
  entry: Omit<Entry, "userId" | "createdAt" | "updatedAt" | "id">,
  token: string,
) {
  const user = await db.user.findFirst({ where: { accessToken: token } });

  if (!user) throw new Error("Unauthorized");

  await db.entry.create({ data: { ...entry, userId: user.id } });
}

export async function getEntryById(id: string) {
  return db.entry.findFirst({ where: { id } });
}

export type EntryUserJoin = Entry & {
  User: { username: string };
  file?: { url: string };
};

/**
 * Retrieves the top entries for a specific game mode, with optional pagination.
 *
 * @param gamemode - The game mode for which to retrieve the top entries.
 * @param page - The page number for pagination (optional, defaults to 1).
 * @returns A promise that resolves to an array of entries for the specified game mode.
 */
export async function getTopEntriesByGame(
  gamemode: Gamemode,
  page?: number,
): Promise<{ entries: EntryUserJoin[]; total: number }> {
  page ??= 1;
  const entries = await db.entry.findMany({
    where: { gamemode },
    include: { User: true, file: true },
    take: 25,
    skip: (page - 1) * 25,
  });
  const formattedEntries = entries.map((entry) => ({
    ...entry,
    User: { username: entry.User.username },
    file: entry.file ? { url: entry.file.url } : undefined,
  }));

  // const total = await db.entry.count({ where: { gamemode } });
  const total = 0;

  return { entries: formattedEntries, total };
}

export async function getEntriesByUser(userId: string) {
  return db.entry.findMany({
    where: {
      userId,
    },
    orderBy: {
      gamemode: "asc",
      time: "asc",
    },
  });
}
