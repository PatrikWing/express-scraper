/** DOT ENV */
require("dotenv").config()

/** EXPRESS */
const express = require("express")
const expressApp = express()
expressApp.use(express.json())
const port = process.env.PORT

/* CORS */
const cors = require("cors")
expressApp.use(cors())

/**PUPPETEER */
const puppeteer = require('puppeteer')

async function scrapeBlocket(location, searchString) {
  console.log("Scraping Blocket...")
  let result = []
  const browser = await puppeteer.launch({})
  const page = await browser.newPage()
  await page.goto(`https://www.blocket.se/annonser/${location}?q=${searchString}&f=p`)

  await page.waitForSelector("article")
  
  let articleElements = await page.$$("article")
  
    for(index in articleElements){
      try{
        if(index >50) break
        let item = {}
        let article = articleElements[index]
        let title = await article.$eval("h2 span", title => title.textContent)
        let price = await article.$eval(".Price__StyledPrice-sc-1v2maoc-1", price => price.textContent)
        let img = await article.$eval("picture img", img => img.src)
        let link = await article.$eval("h2 a", link => link.href)
        item.title = title
        item.price = price
        item.img = img
        item.link = link
        result.push(item)
        console.log(result)
      }catch(error){
        console.error("Error getting blocket items:",error)
      }
    }
    
  browser.close()
  return result
}

/** Get and serve blocket items */
expressApp.post("/blocket", async (req, res) => {
  const searchString = req.body.searchString
  const location = req.body.location
  if(!searchString || !location) res.status(404).json("Did not get searchString or location.")

  const blocketItems = await scrapeBlocket(location, searchString)
  res.status(200).json(blocketItems)
})

expressApp.listen(port, () => {
  console.log(`scraper listening on port ${port}!`)
});
