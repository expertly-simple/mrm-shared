import { json } from 'mrm-core'

export function addArrayProperty(
  fileName: string,
  propertyName: string,
  element: string
) {
  let extendsArray = json(fileName).get(propertyName)

  if (!Array.isArray(extendsArray)) {
    extendsArray = [extendsArray]
  }

  if (!extendsArray.includes(element)) {
    json(fileName)
      .set(propertyName, extendsArray.concat(element))
      .save()
  }
}

export function setScript(pkg: PackageJson, name: string, script: string) {
  pkg.setScript(name, script).save()
}

export function setScripts(pkg: PackageJson, scripts: object) {
  for (let [key, value] of Object.entries(scripts)) {
    pkg.setScript(key, value)
  }
  pkg.save()
}
