import * as fs from "fs";
import csvParser from "csv-parser";
import path from "path";

export async function readObjectsFromCsv(fileName: string): Promise<any[]> {
  const dataSet: any[] = [];
  return new Promise<any[]>((resolve, reject) => {
    const filePath = path.join(__dirname, fileName);
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => {
        dataSet.push(data);
      })
      .on("end", () => {
        console.info(`${dataSet.length} objects found in csv`);
        resolve(dataSet);
      })
      .on("error", (error)=>{
        reject(error)
      });
  });
}
