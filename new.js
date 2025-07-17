// const axios = require('axios');
// const cheerio = require('cheerio');

// async function fetchCollegesNode(url) {
//   const { data: html } = await axios.get(url, {
//     headers: { 'User-Agent': 'Mozilla/5.0' }
//   });
//   const $ = cheerio.load(html);
//   const results = [];
//   $('.tuple-inst-info')
//     .each((i, el) => {
//     //   const rank = $(el).find('div.flt_right.rank_dtl').text().trim();
//       const name = $(el).find('h4').first().text().trim();
//       results.push({  name });
//     });
//     console.log("result",results)
//   return results;
// }

// fetchCollegesNode('https://www.shiksha.com/engineering/ranking/top-engineering-colleges-in-india/44-2-0-0-0?pageNo=4')
//   .then(res => console.log(res));



// const axios = require('axios');  *perfectly working
// const cheerio = require('cheerio');
// const fs = require('fs');

// const url = 'https://www.shiksha.com/engineering/colleges/b-tech-colleges-india?sby=ratingO&isource=RCP';

// async function scrapeCollegeList() {
//   try {
//     const { data: html } = await axios.get(url, {
//       headers: { 'User-Agent': 'Mozilla/5.0' }
//     });

//     const $ = cheerio.load(html);
//     const results = [];

//     $('div._8165').each((i, el) => {
//       const name = $(el).find('h3.f7cc').text().trim();
//       const location = $(el).find('.edfa span span._5588').text().trim();
//       const type = $(el).find('.edfa span').eq(1).text().trim();
//       const courses = $(el).find('.dcfd a._9865').text().trim();
//       const rating = $(el).find('.dcfd a._68c4 span').first().text().trim();
//       const exams = [];
//       $(el).find('ul._0954 li a').each((i, link) => {
//         exams.push($(link).text().trim());
//       });
//       const fees = $(el).find('.abce:contains("Total Tuition Fees")').next('.dcfd').text().trim();
//       const placementRating = $(el).find('.abce:contains("Placement Rating")').next('.dcfd').text().trim();
//       const image = $(el).find('.c43a img').attr('src') || '';
//       const relativeUrl = $(el).find('h3.f7cc').closest('a').attr('href') || '';
//       const fullUrl = relativeUrl ? `https://www.shiksha.com${relativeUrl}` : '';


//       if (name) {
//         results.push({
//           name,
//           location,
//           type,
//           courses,
//           rating,
//           exams,
//           fees,
//           placementRating,
//           image,
//           url: fullUrl
//         });
//       }
//     });

//     fs.writeFileSync('data/college_list.json', JSON.stringify(results, null, 2));
//     console.log(`✅ Scraped ${results.length} colleges.`);
//   } catch (error) {
//     console.error('❌ Error:', error.message);
//   }
// }

// scrapeCollegeList();


// const axios = require("axios");
// const cheerio = require("cheerio");
// const fs = require("fs");

// const BASE = "https://www.shiksha.com";
// const LISTING_URL = `https://www.shiksha.com/engineering/colleges/b-tech-colleges-india-4?uaf[]=base_course&uaf[]=et_dm&sby=ratingO&rf=filters`;
// const API = `${BASE}/college-search-more-colleges`;

// const headers = {
//   "User-Agent": "Mozilla/5.0",
//   Referer: LISTING_URL,
//   "Content-Type": "application/json",
// };

// function parseCollegeBlock($, element) {
//   const name = $(element).find("h3.f7cc").text().trim();
//   const relativeUrl = $(element).find("a.ripple.dark").attr("href");
//   const url = relativeUrl ? BASE + relativeUrl : "N/A";
//   const location = $(element).find("span._5588").text().trim() || "N/A";
//   return name ? { name, url, location } : null;
// }

// async function fetchInitialPage() {
//   const res = await axios.get(LISTING_URL, { headers });
//   const $ = cheerio.load(res.data);
//   const colleges = [];

//   // Initial 15 colleges
//   $("[id^='ctp_tuple_']").each((_, el) => {
//     const data = parseCollegeBlock($, el);
//     if (data) colleges.push(data);
//   });

//   return { colleges, fullHTML: res.data };
// }

// async function fetchPaginated(start) {
//   const res = await axios.post(
//     API,
//     {
//       start,
//       rows: 15,
//       queryParams: {
//         stream: "2",
//         baseEntity: "b-tech",
//         sby: "ratingO",
//         isource: "RCP",
//       },
//       filters: {},
//     },
//     { headers }
//   );
//   return res.data?.data;
// }

// (async () => {
//   let all = [];

//   // Step 1: scrape initial 15 from full page
//   console.log("📄 Fetching initial page...");
//   const { colleges: initialColleges } = await fetchInitialPage();
//   all.push(...initialColleges);

//   // Step 2: paginate via API
//   let start = 15;
//   while (true) {
//     console.log(`📦 Fetching colleges ${start}–${start + 14}...`);
//     const html = await fetchPaginated(start);
//     if (!html) break;

//     const $ = cheerio.load(html);
//     const batch = [];
//     $("[id^='ctp_tuple_']").each((_, el) => {
//       const data = parseCollegeBlock($, el);
//       if (data) batch.push(data);
//     });

//     if (batch.length === 0) break;
//     all.push(...batch);
//     start += 15;
//   }

//   console.log(`✅ Scraped ${all.length} colleges`);
//   fs.writeFileSync("colleges.json", JSON.stringify(all, null, 2));
// })();


// app.js


const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Configuration
const BASE_URL = 'https://collegedunia.com/india-colleges';
const OUTPUT_FILE = 'colleges.json';
const MAX_COLLEGES = 100; // Set to a reasonable number to avoid too many requests
const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds delay to avoid rate limiting

// Store all colleges
let allColleges = [];

async function scrapePage(pageNumber = 1) {
  try {
    console.log(`Scraping page ${pageNumber}...`);
    
    // Make request to the page (simulating scroll behavior)
    const response = await axios.get(BASE_URL, {
      params: {
        page: pageNumber
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    // Find all college rows
    const collegeRows = $('tr.jsx-3698117056.table-row');

    // If no colleges found, we've reached the end
    if (collegeRows.length === 0) {
      console.log('No more colleges found. Ending scrape.');
      return;
    }

    // Extract data from each college row
    collegeRows.each((index, row) => {
      const college = {};
      
      // Rank
      college.rank = $(row).find('td.jsx-3698117056.font-weight-medium.text-lg').text().trim();
      
      // College Info
      const collegeInfo = $(row).find('div.jsx-3698117056.clg-name-address');
      college.name = collegeInfo.find('h3.jsx-3698117056').text().trim();
      
      const locationApproval = collegeInfo.find('div.jsx-3698117056.mt-1').text().trim().split('|');
      college.location = locationApproval[0].trim();
      college.approvals = locationApproval[1] ? locationApproval[1].trim() : '';
      
      // Popular Course
      const popularCourse = collegeInfo.find('button.jsx-3698117056.course');
      if (popularCourse.length) {
        college.popularCourse = {
          name: popularCourse.find('span.jsx-3698117056.course-name').text().trim(),
          cutoff: popularCourse.find('span.jsx-3698117056').last().text().trim()
        };
      }
      
      // Fees
      const feesSection = $(row).find('td.jsx-3698117056.col-fees');
      college.fees = {
        amount: feesSection.find('span.jsx-3698117056.text-lg.text-green').text().trim(),
        description: feesSection.find('span.jsx-3698117056.mb-1').text().trim()
      };
      
      // Placement
      const placementSection = $(row).find('td.jsx-3698117056.col-placement');
      if (placementSection.find('span.jsx-914129990.text-green').length) {
        college.placement = {
          averagePackage: placementSection.find('span.jsx-914129990.text-green').first().text().trim(),
          highestPackage: placementSection.find('span.jsx-914129990.text-green').last().text().trim(),
          placementPercentage: placementSection.find('span.jsx-3698117056.placement-reviews-back').text().trim()
        };
      } else {
        college.placement = '--';
      }
      
      // Reviews
      const reviewsSection = $(row).find('td.jsx-3698117056.col-reviews');
      college.reviews = {
        rating: reviewsSection.find('span.jsx-3698117056.lr-key').text().trim(),
        basedOn: reviewsSection.find('span.jsx-3698117056.lr-value').text().trim(),
        tagline: reviewsSection.find('span.jsx-3698117056.placement-reviews-back').last().text().trim()
      };
      
      // Ranking
      const rankingSection = $(row).find('td.jsx-3698117056.col-ranking');
      college.ranking = {
        mainRank: rankingSection.find('span.jsx-2794970405.rank-span').first().text().trim(),
        agency: rankingSection.find('img.jsx-4197249374').attr('alt') || '',
        year: rankingSection.find('span.jsx-2794970405.rank-span').text().match(/\d{4}/)?.[0] || ''
      };
      
      // CD Score (if available)
      const cdScore = $(row).find('div.jsx-3698117056.common-score');
      if (cdScore.length) {
        college.cdScore = cdScore.text().trim();
      }
      
      allColleges.push(college);
    });

    // Save progress after each page
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allColleges, null, 2));
    console.log(`Saved ${allColleges.length} colleges to ${OUTPUT_FILE}`);
    
    // Continue to next page if we haven't reached the limit
    if (allColleges.length < MAX_COLLEGES) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
      await scrapePage(pageNumber + 1);
    } else {
      console.log(`Reached maximum limit of ${MAX_COLLEGES} colleges. Ending scrape.`);
    }
    
  } catch (error) {
    console.error(`Error scraping page ${pageNumber}:`, error.message);
    // Save what we have so far
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allColleges, null, 2));
    console.log(`Saved ${allColleges.length} colleges to ${OUTPUT_FILE} before error`);
  }
}

// Start scraping
scrapePage().then(() => {
  console.log('Scraping completed!');
});



