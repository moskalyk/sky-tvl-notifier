// @ts-ignore
import Corestore from "corestore"
const corestore = new Corestore('./db')
const db = corestore.get({name: "numbers", valueEncoding: 'json'})
export { db }