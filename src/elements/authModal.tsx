import { type FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { signin, signup } from "~/app/api/auth/actions";
import Modal from "~/components/modal";
import { XIcon } from "lucide-react";
import { useAuth } from "~/util/useAuth";

const credentialsSchema = z.object({
  username: z.string().nonempty("Käyttäjänimen tulee olla vähintään 1 merkki"),
  password: z.string().min(8, "Salasanan tulee olla vähintään 8 merkkiä"),
});

function AuthModal() {
  const [open, setOpen] = useState(false);
  const { setToken } = useAuth();

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const toastId = toast("Kirjaudutaan sisään...", {
      autoClose: false,
      isLoading: true,
    });
    const formData = new FormData(event.target as HTMLFormElement);
    const data = credentialsSchema.safeParse(Object.fromEntries(formData));

    if (!data.success) {
      toast.dismiss(toastId);
      data.error.errors.map((error) => toast.error(error.message));
      return;
    }

    const auth = await signin(data.data.username, data.data.password);

    if (typeof auth === "string") {
      window.localStorage.setItem("token", auth);
      setOpen(false);
      setToken(auth);
      toast.update(toastId, {
        render: "Kirjautuminen onnistui",
        type: "success",
        autoClose: 5000,
        isLoading: false,
      });
      return;
    }

    toast.update(toastId, {
      render: auth.reason,
      type: "error",
      autoClose: 5000,
      isLoading: false,
    });
    console.error("Failed to login:", auth);
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const toastId = toast("Rekisteröidytään...", {
      autoClose: false,
      isLoading: true,
    });

    const formData = new FormData(event.target as HTMLFormElement);
    const data = credentialsSchema.safeParse(Object.fromEntries(formData));

    if (!data.success) {
      toast.dismiss(toastId);
      data.error.errors.map((error) => toast.error(error.message));
      return;
    }

    const auth = await signup(data.data.username, data.data.password);

    if (typeof auth === "string") {
      window.localStorage.setItem("token", auth);
      setOpen(false);
      setToken(auth);
      toast.update(toastId, {
        render: "Rekisteröityminen onnistui",
        type: "success",
        autoClose: 5000,
        isLoading: false,
      });
      return;
    }

    toast.update(toastId, {
      render: auth.reason,
      type: "error",
      autoClose: 5000,
      isLoading: false,
    });
    console.error("Failed to signup:", auth);
  }

  return (
    <Modal open={open} setOpen={setOpen} label="Kirjaudu sisään">
      <section className="relative flex gap-8">
        <button
          className="absolute right-2 top-2"
          onClick={() => setOpen(false)}
        >
          <XIcon />
        </button>
        <form onSubmit={handleLogin} className="flex w-1/2 flex-col space-y-2">
          <h1 className="text-2xl">Kirjaudu sisään</h1>

          <div className="flex flex-col">
            <label htmlFor="username">Käyttäjänimi</label>
            <input
              className="rounded-md bg-emerald-950 px-4 py-2"
              type="text"
              name="username"
              id="username"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Salasana</label>
            <input
              className="rounded-md bg-emerald-950 px-4 py-2"
              type="password"
              name="password"
              id="password"
            />
          </div>
          <input
            className="rounded-md bg-emerald-950 px-4 py-2"
            type="submit"
            value="Login"
          />
        </form>

        <form onSubmit={handleSignup} className="flex w-1/2 flex-col space-y-2">
          <h1 className="text-2xl">Rekisteröidy</h1>

          <div className="flex flex-col">
            <label htmlFor="username">Käyttäjänimi</label>
            <input
              className="rounded-md bg-emerald-950 px-4 py-2"
              type="text"
              name="username"
              id="username"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Salasana</label>
            <input
              className="rounded-md bg-emerald-950 px-4 py-2"
              type="password"
              name="password"
              id="password"
            />
          </div>
          <input
            className="rounded-md bg-emerald-950 px-4 py-2"
            type="submit"
            value="Rekisteröidy"
          />
        </form>
      </section>
    </Modal>
  );
}

export default AuthModal;
