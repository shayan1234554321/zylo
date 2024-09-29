import multer from "multer";

const storage = multer.diskStorage({
  destination: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, "./assets");
  },
  filename: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const ext = file.mimetype.split("/")[1];
    const name = `${Date.now()}-${Math.round(Math.random() * 30)}.${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage: storage,
});

export default upload;
