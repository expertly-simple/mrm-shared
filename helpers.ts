import { json } from "mrm-core";

export function addArrayProperty(fileName: string, propertyName: string, element: string) {
    let extendsArray = json(fileName).get(propertyName);
  
    if (!Array.isArray(extendsArray)) {
      extendsArray = [extendsArray];
    }
  
    if (!extendsArray.includes(element)) {
      json(fileName)
        .set(propertyName, extendsArray.concat(element))
        .save();
    }
  }