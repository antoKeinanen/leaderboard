"use server";

import argon2 from "argon2";
import { db } from "~/server/db";
import type { Error } from "~/util/error";
import crypto from "crypto";
import { env } from "~/env";

/**
 * Registers a new user with the provided username and password.
 *
 * @param {string} username - The username of the new user.
 * @param {string} password - The password of the new user. Must be at least 8 characters long.
 * @returns {Promise<string | Error>} A promise that resolves to the access token of the new user if successful,
 * or an error object with a reason property if the password is too short.
 */
export async function signup(
  username: string,
  password: string,
): Promise<string | Error> {
  if (password.length < 8) {
    return { reason: "Salasanan tulee olla 8 merkkiä tai pidempi" };
  }

  const passwordHash = await argon2.hash(password + env.PEPPER);
  const accessToken = crypto.randomBytes(64).toString("hex");

  await db.user.create({
    data: {
      username,
      passwordHash,
      accessToken,
    },
  });

  return accessToken;
}

/**
 * Signs in a user with the provided username and password.
 *
 * @param {string} username - The username of the user attempting to sign in.
 * @param {string} password - The password of the user attempting to sign in.
 * @returns {Promise<string | Error>} - A promise that resolves to the user's access token if the credentials are valid, or an error object if the credentials are invalid.
 */
export async function signin(
  username: string,
  password: string,
): Promise<string | Error> {
  const user = await db.user.findFirst({
    where: { username },
  });

  if (!user) return { reason: "Virheellinen käyttäjänimi ja/tai salasana" };

  const hashMatch = await argon2.verify(user.passwordHash, password + env.PEPPER);

  if (!hashMatch)
    return { reason: "Virheellinen käyttäjänimi ja/tai salasana" };

  return user.accessToken;
}
