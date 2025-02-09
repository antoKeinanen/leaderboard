import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "~/server/db";

const f = createUploadthing();

const auth = async (req: Request) => {
  const authorization = req.headers.get("Authorization");
  if (!authorization) return null;

  const accessToken = authorization.split(" ")[1];
  if (!accessToken) return null;

  const user = await db.user.findFirst({
    where: {
      accessToken,
    },
  });
  if (!user) return null;

  return { user };
};

export const ourFileRouter = {
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "1MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const data = await auth(req);

      // If you throw, the user will not be able to upload
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!data) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const created = await db.file.create({
        data: { url: file.url },
      });

      return { id: created.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
