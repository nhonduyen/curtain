const request = require('request');
const cheerio = require('cheerio');
const excel = require('excel4node');

let data = [];
let row = 2;
let workbook = new excel.Workbook();
let worksheet = workbook.addWorksheet('Sheet 1');
worksheet.cell(1, 1).string('Name');
worksheet.cell(1, 2).string('Address');     
worksheet.cell(1, 3).string('URL');   
worksheet.cell(1, 4).string('Tax Number');   
worksheet.column(1).setWidth(50);
worksheet.column(2).setWidth(100);
worksheet.column(3).setWidth(100);
for (let i = 1; i <= 7; i++) {
    request(
        {
            method: 'GET',
            url: `http://api.scraperapi.com/?key=078ce04524dee4c07619efb2a5e134b4&url=${encodeURIComponent("https://trangvangvietnam.com/tagclass/30074810/rem-cua.html?page="+i)}`,
            headers: {
                Accept: 'application/json',
            },
        },
        function (error, response, body) {
            console.log('Status:', response.statusCode);

            let $ = cheerio.load(body);
            $('.boxlistings').each(function (i, elem) {
                let detail = $(this).find('.buttonMoreDetails').attr('href');
                let name = $(this).find('h2').text();
                let address = $(this).find('.diachisection').last().text();
                if (address.indexOf('TPHCM') > 0 || address.indexOf('Đồng Nai') > 0 ||
                    address.indexOf('Bình Dương') > 0 || address.indexOf('Bình Phước') > 0) {
                    data.push({ name: name, address: address, url: detail });
                    worksheet.cell(row, 1).string(name);
                    worksheet.cell(row, 2).string(address);
                    worksheet.cell(row, 3).string(detail);
                    row++;
                    workbook.write('Curtain.xlsx');
                console.log(name);
                }
            });
        }
    );
}
console.log(data);