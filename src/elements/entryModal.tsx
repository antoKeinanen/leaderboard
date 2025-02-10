import { Gamemode } from "@prisma/client";
import { XIcon } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { createEntry } from "~/app/api/entry/actions";
import Modal from "~/components/modal";
import { UploadButton } from "~/util/uploadthing";
import { useAuth } from "~/util/useAuth";

const entryCreationSchema = z.object({
  gamemode: z.enum(
    Object.values(Gamemode).map((g) => g.toString()) as [string, ...string[]],
    { required_error: "Valitse vaikeusaste" },
  ),
  time: z.coerce
    .number({ required_error: "Syötä aika" })
    .positive("Ajan tulee olla positiivinen"),
  fileId: z.string({ required_error: "Lataa kuva" }).cuid2("Lataa kuva"),
  token: z.string({ required_error: "Kirjaudu ensin sisään" }),
});

function EntryModal() {
  const [open, setOpen] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [fileId, setFileId] = useState("");
  const { token } = useAuth();

  async function handleCreateEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const toastId = toast("Julkaistaan aikaa...", {
      autoClose: false,
      isLoading: true,
    });
    const formData = new FormData(event.target as HTMLFormElement);
    const data = entryCreationSchema.safeParse(Object.fromEntries(formData));

    if (!data.success) {
      toast.dismiss(toastId);
      data.error.errors.map((error) => toast.error(error.message));
      return;
    }

    const { token, gamemode, ...entryData } = data.data;
    await createEntry(
      { ...entryData, gamemode: Gamemode[gamemode as keyof typeof Gamemode] },
      token,
    );

    toast.update(toastId, {
      render: "Ajan julkaiseminen onnistui",
      type: "success",
      autoClose: 5000,
      isLoading: false,
    });

    close();
  }

  function close() {
    setOpen(false);
    setFileId("");
    setUploadDone(false);
  }

  return (
    <Modal label="Julkaise aika" open={open} setOpen={setOpen} onClose={close}>
      <section className="relative">
        <button className="absolute right-2 top-2" onClick={() => close()}>
          <XIcon />
        </button>
        <h1 className="text-2xl">Julkaise aika</h1>

        <form
          onSubmit={handleCreateEntry}
          className="flex flex-grow-0 flex-col space-y-2 py-4"
        >
          <label htmlFor="gamemode">Vaikeusaste</label>
          <select
            className="rounded-md bg-emerald-950 px-4 py-2"
            name="gamemode"
            id="gamemode"
          >
            <option value={Gamemode.MINESWEEPER_EASY}>
              Minesweeper - Easy
            </option>
            <option value={Gamemode.MINESWEEPER_MEDIUM}>
              Minesweeper - Medium
            </option>
            <option value={Gamemode.MINESWEEPER_HARD}>
              Minesweeper - Hard
            </option>
          </select>
          <label htmlFor="time">Aika</label>
          <input
            className="bg-emerald-950 px-4 py-2 outline-none ring-0"
            type="number"
            name="time"
            id="time"
            placeholder="90"
            min={0}
          />

          <label htmlFor="upload" className="pt-2">
            Kuva
          </label>
          <div id="upload" className="flex justify-start">
            <UploadButton
              disabled={uploadDone}
              content={{ button: uploadDone ? "Kuva ladattu" : "Lataa kuva" }}
              headers={{
                Authorization: "Bearer " + token,
              }}
              appearance={{
                button: { background: "#022c22" },
                allowedContent: { color: "#a7f3d0" },
              }}
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                console.log("Files: ", res);
                setFileId(res[0]?.serverData.id ?? "");
                setUploadDone(true);
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>
          <input
            hidden
            value={fileId}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onChange={() => {}}
            name="fileId"
            id="fileId"
          />
          <input
            hidden
            value={token ?? ""}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onChange={() => {}}
            name="token"
            id="token"
          />
          <div className="flex justify-end">
            <input
              className="w-fit rounded-md bg-emerald-950 px-4 py-2"
              type="submit"
              value="Lähetä"
            />
          </div>
        </form>
      </section>
    </Modal>
  );
}

export default EntryModal;
