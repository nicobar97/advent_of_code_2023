import { promises as fs } from "fs";

export const readFile = async (filePath: string): Promise<string> =>
  fs
    .readFile(filePath, "utf8")
    .then((data) => data)
    .catch((error) => {
      console.error(`Got an error trying to read the file: ${error.message}`);
      throw error;
    });
