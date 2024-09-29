import fs from "fs";

export const RandomStringGenerator = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

export const removeFile = (filename: string): Promise<boolean> => {
  if (
    filename === null ||
    filename === undefined ||
    filename === "" ||
    filename === "default.png"
  ) {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  return new Promise((resolve, reject) => {
    fs.unlink(`./assets/${filename}`, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};
