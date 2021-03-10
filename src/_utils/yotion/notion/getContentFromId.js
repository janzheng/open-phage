

const call = require("./call")
const normalizeId = require("./normalizeId")
const asyncForEach = require("../helpers/asyncForEach.js")

const fetch = require("node-fetch")





async function getContentFromId({id, depth=0, accumulate=true, collectionMap={}, recordMap=undefined, addIndentation=true}) {
  
  try {

    // grab from chunk if it exists, otherwise get from API
    let record, pageChunk

    id = normalizeId(id)  

    console.log('>>> getContentFromId depth:', depth)

    if(!recordMap) {
      pageChunk = await getPageChunkFromId(id)
      if(pageChunk && pageChunk.recordMap && pageChunk.recordMap.block[id]) {
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
      if(records.results) {
        record = records.results[0]
        console.log('----> getContentFromId API call: ', id, 'depth:', depth, record.value.type, 'content:', record.value.content)
      }

      
      // add to recordmap as caching
      if(recordMap && recordMap.block)
        recordMap.block[id] = record
    }

    if(!record || !record.value) {
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
      parent_id: record.value.parent_id,
      parent_table: record.value.parent_table,
      markdown: await getMarkdownFromContents({contents: [record.value], record, recurse:true, depth, recordMap, collectionMap, addIndentation})
    }

    // console.log('BLOCK???', record.value, record.value.properties ? record.value.properties.title[0][0] : '')
    // console.log('BLOCK???', record.value.id, 'type:', record.value.type, 'content:', record.value.content)


    // accumulate all contents
    let contentIds = record.value.content
    let children = []



    if(content.value === '‣') {
      // link to page; do we scrape the linked content? No; this could be very slow 
      // console.log('LINK TO PAGE!!!')
      content['type'] = 'linkToPage'
      content['linkToPageId'] = record.value.properties.title[0][1][0][1] // get the if od the linked page
      contentIds = [record.value.properties.title[0][1][0][1]]
    }


    // to get the page's collection metadata, check out getMarkdownFromContents
    // this is a massive API hit, so it's not included yet
    // let pageData = await call("getPublicPageData", {
    //   blockId: contentId,
    // })
    // 

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

  } catch (e) {
    console.error('[getContentFromId]', e)
  }
}



module.exports = getContentFromId

// prevents circular dependency trap (markdown <> contents)
const getPageChunkFromId = require("./getPageChunkFromId")
const getTableFromId = require("./getTableFromId")
const getMarkdownFromContents = require("./getMarkdownFromContents.js")




