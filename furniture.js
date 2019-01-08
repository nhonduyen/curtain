const cheerio = require('cheerio');
const Crawler = require('js-crawler');
const excel = require('excel4node');

let data = [];
let row = 2;
const crawler = new Crawler().configure({ ignoreRelative: false, depth: 2 });

for (let i = 1; i <= 22; i++) {
    crawler.crawl({
        url: `https://trangvangvietnam.com/srch/vi%E1%BB%87t_nam/n%E1%BB%99i_th%E1%BA%A5t.html?page=${i}`,
        success: function (page) {
            let $ = cheerio.load(page.content);

            $('.boxlistings').each(function (i, elem) {
                let detail = $(this).find('.buttonMoreDetails').attr('href');
                let name = $(this).find('h2').text();
                let address = $(this).find('.diachisection').last().text();
                
                if (address.indexOf('TPHCM') > 0 || address.indexOf('Đồng Nai') > 0 || 
                address.indexOf('Bình Dương') > 0 || address.indexOf('Bình Phước') > 0 ) {
                    data.push({name: name, address: address, url: detail});
                }
            });
        },
        failure: function (page) {
            console.log(page.status);
        },
        finished: function (crawledUrls) {
            console.log("===================================="+data.length);
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet('Sheet 1');
            worksheet.cell(1, 1).string('Name');
            worksheet.cell(1, 2).string('Address');            
            for (let i = 0; i < data.length; i++) {
                crawler.crawl({
                    url: data[i].url,
                    success: function(page1) {
                      console.log("aaaa"+page1.url);
                      let $ = cheerio.load(page1.content);
                    },
                    failure: function(page) {
                      console.log(page1.status);
                    },
                    finished: function() {
                      console.log('done');
                    }
                  });
                worksheet.cell(i+2, 1).string(data[i].name);
                worksheet.cell(i+2, 2).string(data[i].address);
                workbook.write('Furniture.xlsx');
                console.log(`Writing ${data[i].name} ${data[i].address}`);
            }
            console.log(crawledUrls.length);
        }
    });
}

