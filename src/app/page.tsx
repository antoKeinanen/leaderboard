"use client";

import { Gamemode } from "@prisma/client";
import { useEffect, useState } from "react";
import { cn } from "~/util/cn";
import { type EntryUserJoin, getAllEntries } from "./api/entry/actions";
import EntryModal from "~/elements/entryModal";
import AuthModal from "~/elements/authModal";
import { useAuth } from "~/util/useAuth";

function GamemodeButton({
  gamemode,
  setGamemode,
  ownGamemode,
  label,
}: {
  gamemode: Gamemode;
  setGamemode: (gamemode: Gamemode) => void;
  ownGamemode: Gamemode;
  label: string;
}) {
  return (
    <button
      className={cn("rounded-md px-2 py-1", {
        "bg-emerald-700": gamemode == ownGamemode,
      })}
      onClick={() => setGamemode(ownGamemode)}
    >
      {label}
    </button>
  );
}

export default function HomePage() {
  const [gamemode, setGamemode] = useState<Gamemode>(
    Gamemode.MINESWEEPER_MEDIUM,
  );
  const [entries, setEntries] = useState<Record<Gamemode, EntryUserJoin[]>>(
    {} as Record<Gamemode, EntryUserJoin[]>,
  );
  const { logout, token } = useAuth();

  useEffect(() => {
    (async () => {
      const newEntries = await getAllEntries();
      setEntries(newEntries);
    })().catch((ex) => console.error("Error getting entries", ex));
  }, [gamemode]);

  return (
    <main className="pattern-rectangles flex min-h-screen w-screen flex-col p-32 text-emerald-100 pattern-bg-minesweeper-light-green pattern-minesweeper-dark-green pattern-opacity-100 pattern-size-16">
      <section className="rounded-lg border-2 border-emerald-950 bg-emerald-900 px-8 py-4">
        <h1 className="text-4xl">Kumpulan miinaharava leaderboard</h1>

        <div className="flex items-end justify-between">
          <div className="mt-8 w-fit space-x-2 rounded-md bg-emerald-600">
            <GamemodeButton
              gamemode={gamemode}
              ownGamemode="MINESWEEPER_EASY"
              label="Easy"
              setGamemode={setGamemode}
            />
            <GamemodeButton
              gamemode={gamemode}
              ownGamemode="MINESWEEPER_MEDIUM"
              label="Medium"
              setGamemode={setGamemode}
            />
            <GamemodeButton
              gamemode={gamemode}
              ownGamemode="MINESWEEPER_HARD"
              label="Hard"
              setGamemode={setGamemode}
            />
          </div>
          <div className="flex gap-2">
            {token ? (
              <>
                <EntryModal />
                <button
                  onClick={() => logout()}
                  className="h-fit w-fit rounded-md bg-emerald-600 px-4 py-2"
                >
                  Kirjaudu ulos
                </button>
              </>
            ) : (
              <AuthModal />
            )}
          </div>
        </div>
      </section>
      <section className="mt-6 rounded-lg border-2 border-emerald-950 bg-emerald-900 px-8 py-4">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th>#</th>
              <th>Aika</th>
              <th>Nimi</th>
              <th>Pvm.</th>
              <th>Kuva</th>
            </tr>
          </thead>
          <tbody>
            {(entries[gamemode] ?? []).map((entry, i) => (
              <tr className="text-center even:bg-emerald-800" key={i}>
                <td className="font-bold">{i + 1}</td>
                <td>{entry.time} sec</td>
                <td>{entry.User.username}</td>
                <td>{Intl.DateTimeFormat("fi").format(entry.createdAt)}</td>
                <td className="flex justify-center">
                  <a href={entry.file?.url ?? "#"} target="_blank">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-32 object-contain"
                      src={entry.file?.url}
                      alt={entry.file?.url ? "User submission proof image" : ""}
                    />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
