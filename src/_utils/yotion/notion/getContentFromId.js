

const call = require("./call")
const normalizeId = require("./normalizeId")
const asyncForEach = require("../helpers/asyncForEach.js")

const fetch = require("node-fetch")





async function getContentFromId({id, depth=0, accumulate=true, collectionMap={}, recordMap=undefined, addIndentation=true}) {
  
  try {

    // grab from chunk if it exists, otherwise get from API
    let record, pageChunk

    id = normalizeId(id)

    console.log('>>> getContentFromId depth:', depth, id)

    if(!recordMap) {
      pageChunk = await getPageChunkFromId(id)
      if(pageChunk && pageChunk.recordMap.block[id]) {
        recordMap = pageChunk.recordMap
      }
    }

    if(pageChunk) {
      // console.log('page chunk: ', pageChunk)
      // collectionMap[id] = pageChunk
    }

    // sometimes recordmap is nested
    if(recordMap && recordMap.recordMap) {
      recordMap = recordMap.recordMap
    }

    // console.log('getContentFromId recordMap block:', recordMap.block)
    if(recordMap && recordMap.block) {
      record = recordMap.block[id]
    }

    // console.log('getting Content from id:', id, 'chunk:', pageChunk)
    if(!record) {
      // usually required for nested content; these won't exist in pageChunk
      let records = await call("getRecordValues", {
        requests: [
          {
            id,
            table: "block"
          }
        ]
      })
      record = records.results[0]
      console.log('----> getContentFromId API call: ', id, 'depth:', depth, record.value.type, 'content:', record.value.content)

      // add to recordmap as caching
      recordMap.block[id] = record
    }

    if(!record.value) {
      // throw new Error("could not read Notion doc with this ID - make sure public access is enabled")
      return {
        'type': false,
        'message': 'could not read Notion doc with this ID - make sure public access is enabled'
      }
    }


    const type = record.value.type


    const content = {
      id,
      type,
      value: record.value.properties && record.value.properties.title ? record.value.properties.title[0][0] : undefined,
      properties: record.value.properties,
      markdown: await getMarkdownFromContents({contents: [record.value], recurse:true, depth, recordMap, collectionMap, addIndentation})
    }

    // console.log('BLOCK???', record.value, record.value.properties ? record.value.properties.title[0][0] : '')
    // console.log('BLOCK???', record.value.id, 'type:', record.value.type, 'content:', record.value.content)
    


    // accumulate all contents
    const contentIds = record.value.content
    let children = []

    // this is a helper for front-end
    if(type === 'collection_view')
      content['collectionId'] = record.value.id

    if(contentIds)
      children = [...children, ...contentIds]

    if(children.length > 0)
      content.children = children

    if(accumulate && type === 'collection_view') {
      let tableData = await getTableFromId({id: record.value.id, getContent:true, recordMap, collectionMap})
      content.table = tableData.table
      content.value = tableData.value
      content.data = tableData.data
    }

    if(accumulate && type !== 'collection_view' && contentIds) {
      const contents = []
      await asyncForEach(contentIds, async (id) => {
        const content = await getContentFromId({id, depth: ++depth, recordMap, collectionMap})
        contents.push(content)
      })
      content.content = contents
    }

    // console.log('>>>>> ____Contents', content)

    return content
  } catch(e) {
    console.log('[getContentFromId] error:', e)
  }
}



module.exports = getContentFromId

// prevents circular dependency trap (markdown <> contents)
const getPageChunkFromId = require("./getPageChunkFromId")
const getTableFromId = require("./getTableFromId")
const getMarkdownFromContents = require("./getMarkdownFromContents.js")




