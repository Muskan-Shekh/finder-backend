const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function fetchCollegesCheerio(pageNo = 1) {
  const url = `https://www.shiksha.com/engineering/ranking/top-engineering-colleges-in-india/44-2-0-0-0?pageNo=${pageNo}`;
  console.log(`🔍 Scraping page ${pageNo}...`);

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const $ = cheerio.load(html);
    const colleges = [];

    $('.clear_float.desk-col.source-selected').each((i, el) => {
      const name = $(el).find('h4.f14_bold.link').text().trim();
      const nirfRank = $(el).find('.circleText').first().text().trim();
      const fee = $(el).find('.flex_v.text--secondary').filter((i, e) => $(e).text().includes('Fees')).text().replace('Fees:', '').trim();
      const image = $(el).find('.tuple-inst-img img').attr('src') || '';
      const placementRating = $(el).find('.rating_label').filter((i, e) => $(e).text().includes('Placements')).parent().next().text().trim();
      const reviewCount = $(el).find('.view_rvws').text().match(/\d+/)?.[0] || '';

      if (name) {
        colleges.push({
          name,
          nirfRank,
          fee,
          image,
          placementRating,
          reviewCount,
        });
      }
    });

    console.log(`✅ Page ${pageNo}: ${colleges.length} colleges found`);
    return colleges;
  } catch (err) {
    console.error(`❌ Error scraping page ${pageNo}:`, err.message);
    return [];
  }
}

async function scrapeAllPages(pages = 5) {
  const allColleges = [];

  for (let i = 1; i <= pages; i++) {
    const colleges = await fetchCollegesCheerio(i);
    allColleges.push(...colleges);
  }

  fs.writeFileSync('data/colleges.json', JSON.stringify(allColleges, null, 2));
  console.log(`🎉 Scraping complete. Total colleges: ${allColleges.length}`);
}

scrapeAllPages(5); // You can increase number of pages if needed



// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');

// async function scrapeNIRFTop10() {
//   const url = 'https://en.wikipedia.org/wiki/National_Institutional_Ranking_Framework';
//   try {
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     const colleges = [];

//     // ✅ Select the <span> with the ID, then go to <h3>, then to next table
//     const span = $('span#Engineering_\\(Top_10\\)');
//     const table = span.parent().nextAll('table.wikitable').first();

//     table.find('tbody tr').slice(1).each((i, row) => {
//       const cols = $(row).find('td');
//       if (cols.length >= 3) {
//         const rank = $(cols[0]).text().trim();
//         const name = $(cols[1]).text().trim();
//         const location = $(cols[2]).text().trim();
//         colleges.push({ rank, name, location });
//       }
//     });

//     fs.writeFileSync('data/colleges.json', JSON.stringify(colleges, null, 2));
//     console.log(`✅ Scraped ${colleges.length} top engineering colleges from NIRF Wikipedia.`);
//   } catch (err) {
//     console.error('❌ Error scraping NIRF:', err.message);
//   }
// }

// scrapeNIRFTop10();


