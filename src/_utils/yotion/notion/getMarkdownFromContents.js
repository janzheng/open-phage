/* Turns an array of text, returned by Notion's API, into Markdown */

// const katex = require("katex")
const textArrayToMarkdown = require("./textArrayToMarkdown.js")
const asyncForEach = require("../helpers/asyncForEach.js")
const textArrayToHtml = require("./textArrayToHtml.js")
const collectionToMarkdown = require("./collectionToMarkdown.js")
const getTableFromId = require("./getTableFromId")
const getAssetUrl = require("./getAssetUrl")
// const getPageChunkFromId = require("./getPageChunkFromId")

const call = require("./call")

async function getMarkdownFromContents({contents, recurse=true, depth=0, recordMap=undefined, addIndentation=true, collectionMap={}, record}) {
  const markdown = []
  // forEach isn't async // https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
  await asyncForEach(contents, async block => {
  // contents.forEach(async block => {
    const type = block.type
    let _recurse = recurse // reset block-level recursion


    if(["header", "sub_header", "sub_sub_header", "text"].includes(type)) {
      /* Headers (H1 - H3) and plain text */
      const el = {
        header: "# ",
        sub_header: "## ",
        sub_sub_header: "### ",
        text: ""
      }[type]


      if(!block.properties) {
        // This is an empty text block. 
        markdown.push(`\n\n`)
        return
      }

      if(block.properties.title && block.properties.title[0] && block.properties.title[0][0] === '‣') {
        // this is a page reference, skip
        return
      }

      markdown.push(`${el}${textArrayToMarkdown(block.properties.title)}\n\n`)
    } else if(["numbered_list", "bulleted_list"].includes(type)) {
      /* Numbered and bulleted lists */
      const el = {
        "numbered_list": "1. ",
        "bulleted_list": "- "
      }[type]

      markdown.push(`${el}${textArrayToMarkdown(block.properties && block.properties.title)}\n\n`)
    } else if(["to_do"].includes(type)) {
      /* To do list represented by a list of checkbox inputs */
      // const checked = Boolean(block.properties.checked)
      const checked = block.properties.checked[0][0] === 'Yes'
      markdown.push(`${checked ? "- [x]" : "- [ ]"} ${textArrayToMarkdown(block.properties.title)}\n\n`)
    } else if(["code"].includes(type)) {
      /* Full code blocks with language */
      const language = block.properties.language[0][0].toLowerCase().replace(/ /g, "")
      const text = block.properties.title || [[""]]
      // markdown.push(text.map(clip => clip[0]).join("")) // Ignore styling, just take the text
      markdown.push(`
~~~
${text.map(clip => clip[0]).join("&nbsp;&nbsp;>>")}
~~~\n\n`)

    } else if(["toggle"].includes(type)) {
      let tag, toggleRecurse = true

      // old way of defining a block; realized it's easier to just add the entire tag instead
      // $blockdef .class-1 .class-2 .class_3--1 #identifier attr=something attr2="one two three four five"
      // if (block.properties.title[0] && block.properties.title[0] && block.properties.title[0][0].includes('$blockdef')) {
      //   const blockStr = block.properties.title[0][0].split(' ') // {.class #identifier attr=value attr2="spaced value"}
      //   let clss = blockStr.filter(str => str.substring(0,1) === '.')
      //   const ids = blockStr.filter(str => str.substring(0,1) === '#')
      //   const attrRegex = /\b\w*[=](\w|"(.*?)")*/g
      //   const attrs = []

      //   do {
      //     var match = attrRegex.exec(blockStr); // note, this adds annoying commas to the attr string
      //     if (match != null)
      //       attrs.push(match[0]);
      //   } while (match != null);

      //   clss = clss.reduce((acc,val) => acc + val.substring(1) + ' ','')
      //   let attrstr = attrs.reduce((acc,val) => acc + val.replace(/,/g,' ') + ' ','')

      //   markdown.push(`<div ${ids&&ids.length>0?`id="${ids[0].substring(1)}"`:""} clss="${clss}" ${attrstr}>\n`)
      //   addIndentation = false
      // } 
      if (block.properties.title[0] && block.properties.title[0] && block.properties.title[0][0].includes('$code')) {
        console.log('Code block')
        markdown.push(`<div class="code-block">\n`)
        addIndentation = false
        // execution code still remains as a code block... this could open up more vulns
      } if (block.properties.title[0] && block.properties.title[0] && block.properties.title[0][0].includes('$list')) {
        // list block — creates html wrappers around the objects contained within this toggle
        /*
          > $list {"class": "test-list", "itemContainerClass": "_card _padding", "coverField":"Cover Image", "showFields": "Name, Author, Description, DOI", "linkField":"URL"}
            @link to pages
        */

        try {

          let optionStr = block.properties.title[0][0].substring(5).trim()

          // console.log('OPTIONSTR:::: ', optionStr)
          let options
          if(optionStr) {
            options = JSON.parse(optionStr)
          }

          markdown.push(`<div class="${options.class ? options.class : ''} list-block-container">\n`)
          addIndentation = false
          toggleRecurse = false // don't recurse standard markdown

          console.log('[$list block] >>>> options:', options)


          await asyncForEach(block.content, async contentId => {
            const _content = await getContentFromId({id: contentId, depth, recordMap, collectionMap, addIndentation: false})
            // console.log('[$list block] >>>> properties: ', _content.properties)

            let pageData = await call("getPublicPageData", {
              blockId: contentId,
            })

            let collectionSchema, schema = {}

            if(pageData.collectionSchema) {
              collectionSchema = pageData.collectionSchema

              Object.keys(_content.properties).map(key => {
                if(collectionSchema[key]) {
                  
                  // sometimes links or images will contain the actual link in the second object in the array in a weird nested object
                  if(_content.properties[key][0][1]) {
                    let url = getAssetUrl(_content.properties[key][0][1][0][1], contentId)
                    schema[collectionSchema[key]['name']] = url
                  } else {
                    schema[collectionSchema[key]['name']] = _content.properties[key][0][0]
                  }
                }
              })

              // console.log('[$list block] >>>> schema:', schema)

              // automatically use a Slug field if it exists
              let linkAttr = ''
              if(options['linkField'] && (schema[options['linkField']] || schema['Slug'])) {
                linkAttr = `data-link="${schema[options['linkField']] || schema['Slug']}"`
                markdown.push(`<a class="list-block-link" href="${schema[options['linkField']] || schema['Slug']}">`)
              }

              markdown.push(`<div class="list-block-item-container list-card ${options['itemContainerClass'] ? options['itemContainerClass'] : ''}" ${linkAttr}>`)

              if(options['coverField'] && schema[options['coverField']]) {
                // console.log('Coverfield:?::', options.coverField, schema[options.coverField])
                markdown.push(`<img class="list-block-cover" alt="Cover image" src="${schema[options['coverField']]}">`)
              }

              markdown.push(`<div class="list-block-item ${options['itemClass'] ? options['itemClass'] : ''}" ${linkAttr}>`)

              options['showFields'].split(',').map(fieldKey => {
                fieldKey = fieldKey.trim()
                // console.log('[$list block] >>>> fieldKey:', fieldKey, schema[fieldKey])
                if(schema[fieldKey]) {
                  markdown.push(`<div data-field="${fieldKey}">${schema[fieldKey]}</div>`)
                }
              })
            }

            // there's a weird bug if a $list ends with empty rows, it'll add more </div>s
            
            markdown.push(`</div>`) // end list-block-item
            markdown.push(`</div>`) // end list-block-item-container list-card
            if(options['linkField'] && (schema[options['linkField']] || schema['Slug'])) {
              markdown.push(`</a>`)
            }
          })
        } catch(e) {
          console.error(['Toggle $List block error'], e)
        }

        // execution code still remains as a code block... this could open up more vulns
      } else if (block.properties.title[0] && block.properties.title[0] && block.properties.title[0][0][0] === '<') {
        // treats any toggle that starts with "<" as a tag block toggle
        // this leaves the server open to script injection, so don't leave it open...
        const summary = block.properties.title[0][0]
        tag = summary.split(' ')[0].substring(1)
        addIndentation = false
        console.log('Script tag!', tag, summary, summary.split(' ')[0])
        markdown.push(summary)
      } else {
        markdown.push(`<details>\n`)
        if(block.properties.title[0]) {
          markdown.push(`  <summary>${block.properties.title[0]}</summary>\n\n`)
        }
      }

      // recursively build the toggle
      if (block.content && toggleRecurse) {
        await asyncForEach(block.content, async contentId => {
          const _content = await getContentFromId({id: contentId, depth, recordMap, collectionMap, addIndentation: false})
          _content.markdown.forEach(md => {
            const spaces = addIndentation ? '  ' : ''
            markdown.push(`${spaces.repeat(depth+1)}${md}`) 
          })
        })
      }

      if(block.properties.title[0] && block.properties.title[0] && 
        (block.properties.title[0][0].includes('$code') || block.properties.title[0][0].includes('$list'))) {
        markdown.push(`</div>\n\n`)
      } else if (block.properties.title[0] && block.properties.title[0] && block.properties.title[0][0][0] === '<') {
        markdown.push(`</${tag}>\n\n`)
      } else {
        markdown.push(`</details>\n\n`)
      }
      _recurse = false // don't recurse after this since everything needs to fit within this block
    } else if(["callout"].includes(type)) {
      /* Callout formatted with emoji from emojicdn.elk.sh or just image */
      const icon = block.format.page_icon
      const imageLink = icon.startsWith("http") ? `https://www.notion.so/image/${encodeURIComponent(icon)}?table=block&id=${block.id}` : `https://emojicdn.elk.sh/${icon}`
      const color = block.format.block_color.split("_")[0]
      const isBackground = block.format.block_color.split("_").length > 1
      const text = block.properties.title
      markdown.push(`<div class="callout${isBackground ? " background" : " color"}-${color}"><img src="${imageLink}"><p>${textArrayToHtml(text)}</p></div>`)
    } else if(["quote"].includes(type)) {
      markdown.push(`> ${textArrayToMarkdown(block.properties.title)}\n\n`)
    } else if(["divider"].includes(type)) {
      // markdown.push(`<hr>`)
      markdown.push(`---`)
    } else if(["image"].includes(type)) {
      let url = getAssetUrl(block.format.display_source, block.id)
      // console.log('[image]',block, block.properties.source[0], url)
      // markdown.push(`<img src="https://www.notion.so/image/${encodeURIComponent(block.format.display_source)}">`)
      // markdown.push(`![Generated image](https://www.notion.so/image/${encodeURIComponent(block.format.display_source)})`)
      markdown.push(`![Generated image](${url})`)
    } else if(["equation"].includes(type)) {
      if(!block.properties) {
        // Equation block is empty
        return 
      }
      const equation = block.properties.title[0][0]
      // const equationHtml = katex.renderToString(equation, { throwOnError: false })
      markdown.push(`<div class="equation">${equationHtml}</div>`)
    } else if(["embed"].includes(type)) {
      markdown.push(`<iframe src="${block.properties.source[0][0]}"></iframe>`)
    } else if(["video"].includes(type)) {
      markdown.push(`<iframe src="${block.format.display_source}"></iframe>`)
    } else if(["page"].includes(type)) {
      // console.log('TODO  ::::: EMBEDDED PAGE :::::', block.properties, block.properties.title)
    } else if(["collection_view"].includes(type)) {
      // console.log('getting embedded table')
      const {table} = await getTableFromId({id: block.id, collectionMap, recordMap})
      // console.log('embedded table data: ', table)
      const tableMd = collectionToMarkdown(table)
      markdown.push(tableMd)
      markdown.push('\n') // add an empty row
    } else {
      /* Catch blocks without handler method */
      // console.error('Unhandled block type:', block.properties, block)
      console.log(`Unhandled block type "${block.type}"`, block.properties ? block.properties.title : block, block.id)
    }


    if (_recurse && block.content) {
      // get markdown recursively from children; BUT most markdown will NOT support this out of the box
      // need an extension to add nested content (which doesn't exist...)
      await asyncForEach(block.content, async contentId => {
        const _content = await getContentFromId({id: contentId, depth, recordMap, collectionMap})
        const spaces = addIndentation ? '  ' : ''
        if(_content.markdown) {
          _content.markdown.forEach(md => {
            // console.log('md:', depth+1, md)
            markdown.push(`${spaces.repeat(depth+1)}${md}`) 
          })
        }
      })
    }

  })
  // Only add Katex stylesheet if there's Katex elements. 
  if(markdown.join("").includes(`class="katex"`)) {
    markdown.push(`<link rel="stylesheet" href="https://unpkg.com/katex@0.11.1/dist/katex.min.css">`)
  }

  // console.log('returning markdown:::::', markdown)

  return markdown

}


module.exports = getMarkdownFromContents

// prevents circular dependency trap (markdown <> contents)
const getContentFromId = require("./getContentFromId.js")

