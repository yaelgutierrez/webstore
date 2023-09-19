const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
    "732901007499-4h40tloevcprt0kikstr6l6r2he5unj8.apps.googleusercontent.com",
    "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",
    "http://localhost "
);

oAuth2Client.setCredentials({
    type: "authorized_user",
    client_id: "732901007499-4h40tloevcprt0kikstr6l6r2he5unj8.apps.googleusercontent.com",
    client_secret: "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",
    refresh_token: "1//01DBxlq8N_tYGCgYIARAAGAESNwF-L9Irn8hlCRKINMdAFhSynihTQXOjsALNnz5qXxFRGk2HdHdUczBqnqpqfiF-1kclPrdntkI"
});

const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });

async function read() {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: "1VYG92rfO-002NMyCqU7j8iF2ZCoLhadPSLdY1xWDVpc",
        range: "Products!A2:E",
    });

    const rows = response.data.values; // Corrección: usa "response" en lugar de "res"
    const products = rows.map((row) => ({
        id: +row[0],
        name: row[1],
        price: +row[2],
        Image: row[3],
        stock: +row[4],
    }));


    return products;
}

async function write(products) {
    let values = products.map(p => [p.id, p.name, p.price, p.Image, p.stock])

    const resource = {
        values,
    };
    const result = await sheets.spreadsheets.values.update({
        spreadsheetId: "1VYG92rfO-002NMyCqU7j8iF2ZCoLhadPSLdY1xWDVpc",
        range: "Products!A2:E",
        valueInputOption: "RAW",
        resource,
    });
    console.log(result.updatedCells);


}
//async function readAndWrite() {
//   const products = await read();
// products[0].stock = 3;
//await write(products);
//}

//readAndWrite();


module.exports = {
    read,
    write,
};