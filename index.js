let cheerio = require('cheerio');
let Crawler = require('js-crawler');
const excel = require('excel4node');


var crawler = new Crawler().configure({ ignoreRelative: false, depth: 1 });
let data = [];


for (let i = 1; i <= 7; i++) {
    crawler.crawl({
        url: `https://trangvangvietnam.com/tagclass/30074810/rem-cua.html?page=${i}`,
        success: function (page) {
            var $ = cheerio.load(page.content);

            $('.noidungchinh').each(function (i, elem) {
                let name = $(this).children('h2').text();
                let address = $(this).find('.diachisection').last().text();
                data.push({name: name, address: address});

            });
        },
        failure: function (page) {
            console.log(page.status);
        },
        finished: function (crawledUrls) {
            
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet('Sheet 1');
            worksheet.cell(1, 1).string('Name');
            worksheet.cell(1, 2).string('Address');
            for (let i = 0; i < data.length; i++) {
                worksheet.cell(i+2, 1).string(data[i].name);
                worksheet.cell(i+2, 2).string(data[i].address);
                workbook.write('Excel.xlsx');
                console.log(`Writing ${data[i].name} ${data[i].address}`);
            }
        }
    });
}




console.log('hello');