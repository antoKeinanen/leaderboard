"use server";

import type { Gamemode, Entry } from "@prisma/client";
import { db } from "~/server/db";

export async function createEntry(entry: Entry) {
  await db.entry.create({ data: entry });
}

export async function getEntryById(id: string) {
  return db.entry.findFirst({ where: { id } });
}

/**
 * Retrieves the top entries for a specific game mode, with optional pagination.
 *
 * @param gamemode - The game mode for which to retrieve the top entries.
 * @param page - The page number for pagination (optional, defaults to 1).
 * @returns A promise that resolves to an array of entries for the specified game mode.
 */
export async function getTopEntriesByGame(gamemode: Gamemode, page?: number) {
  page ??= 1;
  return await db.entry.findMany({
    where: { gamemode },
    take: 25,
    skip: (page - 1) * 25,
  });
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
