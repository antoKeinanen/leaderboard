import { type FormEvent, useState } from "react";
import { z } from "zod";
import { signin, signup } from "~/app/api/auth/actions";
import Modal from "~/components/modal";

const credentialsSchema = z.object({
  username: z.string(),
  password: z.string(),
});

function AuthModal({ setToken }: { setToken: (token: string) => void }) {
  const [open, setOpen] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = credentialsSchema.parse(Object.fromEntries(formData));

    const auth = await signin(data.username, data.password);

    if (typeof auth === "string") {
      window.localStorage.setItem("token", auth);
      setOpen(false);
      setToken(auth);
      return;
    }

    console.error("Failed to login:", auth);
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const data = credentialsSchema.parse(Object.fromEntries(formData));

    const auth = await signup(data.username, data.password);

    if (typeof auth === "string") {
      window.localStorage.setItem("token", auth);
      setOpen(false);
      setToken(auth);
      return;
    }

    console.error("Failed to login:", auth);
  }

  return (
    <Modal open={open} setOpen={setOpen} label="Login">
      <section className="flex gap-8">
        <form onSubmit={handleLogin} className="flex w-1/2 flex-col space-y-2">
          <h1 className="text-2xl">Login</h1>

          <div className="flex flex-col">
            <label htmlFor="username">Username</label>
            <input
              className="rounded-md bg-emerald-950 px-4 py-2"
              type="text"
              name="username"
              id="username"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
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
          <h1 className="text-2xl">Sign up</h1>

          <div className="flex flex-col">
            <label htmlFor="username">Username</label>
            <input
              className="rounded-md bg-emerald-950 px-4 py-2"
              type="text"
              name="username"
              id="username"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
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
            value="Sign up"
          />
        </form>
      </section>
    </Modal>
  );
}

export default AuthModal;
