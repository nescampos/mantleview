var covalentAPI = "https://api.covalenthq.com/v1";
var covalentAPIKey = "cqt_rQkVvQXRbvkPqtFmFXP8fkMtM6Rf";
var chainName = "mantle-testnet";

function getBalances() {
    var walletAddress = $("#walletAddress").val();

    var tokenCounter = 0;

    $('.balances-data-loading').css("display", "block");

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": covalentAPI+"/"+chainName+"/address/"+walletAddress+"/balances_v2/?key=" + covalentAPIKey,
        "method": "GET"
    };
    $.ajax(settings).done(function (response) {
        var bitToken = response.data.items.find(x => x.contract_address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        var bitBalance = Web3.utils.fromWei(bitToken.balance);
        $('#bitBalanceAccount').text(bitBalance);
        var list = document.querySelector('.balances-data');
        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');

        var theadTr = document.createElement('tr');
        var contractNameHeader = document.createElement('th');
        contractNameHeader.innerHTML = 'Token';
        theadTr.appendChild(contractNameHeader);
        var contractTickerHeader = document.createElement('th');
        contractTickerHeader.innerHTML = 'Ticker';
        theadTr.appendChild(contractTickerHeader);
        var balanceHeader = document.createElement('th');
        balanceHeader.innerHTML = 'Balance';
        theadTr.appendChild(balanceHeader);
        var usdHeader = document.createElement('th');
        usdHeader.innerHTML = 'USD';
        theadTr.appendChild(usdHeader);

        var usdHeader2 = document.createElement('th');
        usdHeader2.innerHTML = 'Is Spam';
        theadTr.appendChild(usdHeader2);

        thead.appendChild(theadTr)
        var urlTokenURL = "https://explorer.testnet.mantle.xyz/token/";

        table.className = 'table table-striped';
        table.appendChild(thead);
        for (j = 0; j < response.data.items.length; j++) {
            var tbodyTr = document.createElement('tr');
            var contractTd = document.createElement('td');
            var urlToken = urlTokenURL + response.data.items[j].contract_address;
            contractTd.innerHTML = "<b> <a href='" + urlToken + "' target='_blank''>" + response.data.items[j].contract_name + "</a></b>";
            tbodyTr.appendChild(contractTd);
            var contractTickerTd = document.createElement('td');
            contractTickerTd.innerHTML = '<b>' + response.data.items[j].contract_ticker_symbol + '</b>';
            tbodyTr.appendChild(contractTickerTd);
            //balances.push(contractTickerTd);
            var balanceTd = document.createElement('td');
            balanceTd.innerHTML = '<b>' + (response.data.items[j].balance / Math.pow(10,response.data.items[j].contract_decimals)) + '</b>';
            tbodyTr.appendChild(balanceTd);
            var balanceUSDTd = document.createElement('td');
            balanceUSDTd.innerHTML = '<b>' + response.data.items[j].quote + '</b>';
            tbodyTr.appendChild(balanceUSDTd);
            var balanceUSDTd2 = document.createElement('td');
            balanceUSDTd2.innerHTML = '<b>' + (response.data.items[j].is_spam != null && response.data.items[j].is_spam? "Yes":"No") + '</b>';
            tbodyTr.appendChild(balanceUSDTd2);
            tbody.appendChild(tbodyTr);
            tokenCounter++;
        }
        table.appendChild(tbody);

        list.appendChild(table);
        $('#tokenCount').text(tokenCounter);
        $('.balances-data-loading').css("display", "none");
        $('.balances-data').css("display", "block");
    });
    
    
}


async function getHistoricalBalances() {
    var walletAddress = $("#walletAddress").val();
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": covalentAPI+"/"+chainName+"/address/"+walletAddress+"/portfolio_v2/?key="+covalentAPIKey,
        "method": "GET"
    };

    $('.bitportfolio-data-loading').css("display", "block");

    var labels_data = [];
    var balance_close = [];
    var balance_open = [];
    var balance_high = [];
    var balance_low = [];

    $.ajax(settings).done(function (response) {
        if(response != null && response.data != null) {
            //console.log(response.data.items);
            if(response.data.items != null && response.data.items.length > 0) {
                var firstItem = response.data.items.find(x => x.contract_address === "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000");

                for (j = 0; j < firstItem.holdings.length; j++) {
                    labels_data.push(firstItem.holdings[j].timestamp.substring(0, 10));
                    balance_close.push(Web3.utils.fromWei(firstItem.holdings[j].close.balance));
                    balance_open.push(Web3.utils.fromWei(firstItem.holdings[j].open.balance));
                    balance_high.push(Web3.utils.fromWei(firstItem.holdings[j].high.balance));
                    balance_low.push(Web3.utils.fromWei(firstItem.holdings[j].low.balance));
                }
                        var canvas = document.getElementById('bitPorfolioChart').getContext('2d');
                        var data = {
                            labels: labels_data,
                            datasets: [{
                              label: 'Balance (close)',
                              data: balance_close,
                              backgroundColor: 'rgba(0, 123, 255, 0.5)', // Color de fondo de la línea
                              borderColor: 'rgba(0, 123, 255, 1)', // Color de borde de la línea
                              borderWidth: 1, // Ancho del borde de la línea
                              fill: false // Relleno de la línea desactivado
                            },{
                                label: 'Balance (open)',
                                data: balance_open,
                                backgroundColor: 'rgba(41, 210, 230, 0.5)', // Color de fondo de la línea
                                borderColor: 'rgba(41, 210, 230, 1)', // Color de borde de la línea
                                borderWidth: 1, // Ancho del borde de la línea
                                fill: false // Relleno de la línea desactivado
                              },{
                                label: 'Balance (high)',
                                data: balance_high,
                                backgroundColor: 'rgba(136, 175, 196, 0.5)', // Color de fondo de la línea
                                borderColor: 'rgba(136, 175, 196, 1)', // Color de borde de la línea
                                borderWidth: 1, // Ancho del borde de la línea
                                fill: false // Relleno de la línea desactivado
                              },{
                                label: 'Balance (low)',
                                data: balance_low,
                                backgroundColor: 'rgba(230, 42, 36, 0.5)', // Color de fondo de la línea
                                borderColor: 'rgba(230, 42, 36, 1)', // Color de borde de la línea
                                borderWidth: 1, // Ancho del borde de la línea
                                fill: false // Relleno de la línea desactivado
                              }]
                          };
                          var options = {
                            responsive: true, // El gráfico se ajustará al tamaño del contenedor
                            scales: {
                              x: {
                                type: 'time', // Eje x será de tipo tiempo
                                time: {
                                  parser: 'yyyy-MM-dd', // Formato de las fechas
                                  //tooltipFormat: 'll' // Formato del tooltip de las fechas
                                },
                                ticks: {
                                  autoSkip: true, // Saltar automáticamente las etiquetas si hay demasiadas
                                  maxTicksLimit: 10 // Límite máximo de etiquetas en el eje x
                                }
                              },
                              y: {
                                beginAtZero: true // El eje y comienza en cero
                              }
                            }
                          };
                          
                          // Crear el gráfico
                          var chart = new Chart(canvas, {
                            type: 'line', // Tipo de gráfico: línea
                            data: data, // Datos del gráfico
                            options: options // Opciones del gráfico
                          });

                          $('.bitportfolio-data-loading').css("display", "none");
                          $('.bitportfolio-data').css("display", "block");
                    }
                
        }
    });
}

async function getTransfers() {
    var walletAddress = $("#walletAddress").val();
    $('.transfers-data-loading').css("display", "block");

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": covalentAPI+"/"+chainName+"/address/"+walletAddress+"/transactions_v3/page/0/?key=" + covalentAPIKey,
        "method": "GET"
    };
    $.ajax(settings).done(function (response) {
        var urlToken = "https://explorer.testnet.mantle.xyz/tx/";
        if (response.data.items.length == 0) {
            $('.transfers-data-loading').css('display', 'block');
            $('.transfers-data-loading').text('There is no transaction for this address.');
        }
        else {
            var list = document.querySelector('.transfers-data');
            var table = document.createElement('table');
            var thead = document.createElement('thead');
            var tbody = document.createElement('tbody');


            var theadTr = document.createElement('tr');
            var contractNameHeader = document.createElement('th');
            contractNameHeader.innerHTML = 'Trx Hash';
            theadTr.appendChild(contractNameHeader);
            var contractTickerHeader = document.createElement('th');
            contractTickerHeader.innerHTML = 'From Address';
            theadTr.appendChild(contractTickerHeader);
            var contractTickerHeader = document.createElement('th');
            contractTickerHeader.innerHTML = 'To Address';
            theadTr.appendChild(contractTickerHeader);
            var balanceHeader = document.createElement('th');
            balanceHeader.innerHTML = 'Amount (BIT)';
            theadTr.appendChild(balanceHeader);
            var usdHeader = document.createElement('th');
            usdHeader.innerHTML = 'USD';
            theadTr.appendChild(usdHeader);
            var usdHeader = document.createElement('th');
            usdHeader.innerHTML = 'Fees (BIT)';
            theadTr.appendChild(usdHeader);

            thead.appendChild(theadTr);
            table.className = 'table table-striped';
            table.appendChild(thead);

            for (j = 0; j < response.data.items.length; j++) {
                var tbodyTr = document.createElement('tr');
                var contractTd = document.createElement('td');
                var url = urlToken + response.data.items[j].tx_hash;
                contractTd.innerHTML = "<b><a href='" + url + "' target='_blank'>" + response.data.items[j].tx_hash.substring(0, 10) + "...</a></b>";
                tbodyTr.appendChild(contractTd);
                var contractFromTickerTd = document.createElement('td');
                contractFromTickerTd.innerHTML = "<b>"+ (response.data.items[j].from_address != null ? response.data.items[j].from_address.substring(0, 10) + "..." : "-" )+ "</b>";
                tbodyTr.appendChild(contractFromTickerTd);
                var contractTickerTd = document.createElement('td');
                contractTickerTd.innerHTML = "<b>"+ (response.data.items[j].to_address != null ? response.data.items[j].to_address.substring(0, 10) + "..." : "-")+ "</b>";
                tbodyTr.appendChild(contractTickerTd);
                var balanceTd = document.createElement('td');
                balanceTd.innerHTML = "<b>"+ Web3.utils.fromWei(response.data.items[j].value.toString())+ "</b>";
                tbodyTr.appendChild(balanceTd);
                var balanceUSDTd = document.createElement('td');
                balanceUSDTd.innerHTML = "<b>"+ (response.data.items[j].value_quote != null ? response.data.items[j].value_quote : "0")+ "</b>";
                tbodyTr.appendChild(balanceUSDTd);
                var contractIdTd = document.createElement('td');
                contractIdTd.innerHTML = "<b>"+ (response.data.items[j].fees_paid != null ? Web3.utils.fromWei(response.data.items[j].fees_paid.toString()) : '-')+ "</b>";
                tbodyTr.appendChild(contractIdTd);
                tbody.appendChild(tbodyTr);
            }
            table.appendChild(tbody);

            list.appendChild(table);
            $('.transfers-data').css("display", "block");
            $('.transfers-data-loading').css("display", "none");
        }
    });
}

async function getTokenApprovals() {
    var walletAddress = $("#walletAddress").val();
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": covalentAPI+"/"+chainName+"/approvals/"+walletAddress+"/?key="+covalentAPIKey,
        "method": "GET"
    };

    $('.approval-data-loading').css("display", "block");

    var urlTokenURL = "https://explorer.testnet.mantle.xyz/token/";
    var counter = 0;

    $.ajax(settings).done(function (response) {
        if(response != null && response.data != null) {
            //console.log(response.data.items);
            if(response.data.items != null && response.data.items.length > 0) {
                var list = document.querySelector('.approval-data');
            var table = document.createElement('table');
            var thead = document.createElement('thead');
            var tbody = document.createElement('tbody');


            var theadTr = document.createElement('tr');
            var contractNameHeader = document.createElement('th');
            contractNameHeader.innerHTML = '<b>Token</b>';
            theadTr.appendChild(contractNameHeader);
            var contractTickerHeader = document.createElement('th');
            contractTickerHeader.innerHTML = '<b>Ticker</b>';
            theadTr.appendChild(contractTickerHeader);
            var contractTickerHeader2 = document.createElement('th');
            contractTickerHeader2.innerHTML = '<b>Balance</b>';
            theadTr.appendChild(contractTickerHeader2);
            

            thead.appendChild(theadTr);
            table.className = 'table table-striped';
            table.appendChild(thead);

            for (j = 0; j < response.data.items.length; j++) {
                var tbodyTr = document.createElement('tr');
                var contractTd = document.createElement('td');
                var url = urlTokenURL + response.data.items[j].token_address;
                contractTd.innerHTML = "<b><a href='" + url + "' target='_blank'>" + response.data.items[j].token_address_label + "</a></b>";
                tbodyTr.appendChild(contractTd);
                var contractFromTickerTd = document.createElement('td');
                contractFromTickerTd.innerHTML = "<b>"+ response.data.items[j].ticker_symbol+"</b>";
                tbodyTr.appendChild(contractFromTickerTd);
                var contractTickerTd = document.createElement('td');
                contractTickerTd.innerHTML = "<b>"+ (response.data.items[j].balance / Math.pow(10,response.data.items[j].contract_decimals))+"</b>";
                
                tbodyTr.appendChild(contractTickerTd);
                tbody.appendChild(tbodyTr);
                counter++;
            }
            table.appendChild(tbody);

            list.appendChild(table);
            $('#tokenApprovalsCount').text(counter);
                $('.approval-data-loading').css("display", "none");
                $('.approval-data').css("display", "block");
            }
        }
    });

}

async function getTransactionSummary() {
    var walletAddress = $("#walletAddress").val();
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": covalentAPI+"/"+chainName+"/address/"+walletAddress+"/transactions_summary/?key="+covalentAPIKey,
        "method": "GET"
    };

    $('.summary-data-loading').css("display", "block");

    $.ajax(settings).done(function (response) {
        if(response != null && response.data != null) {
            //console.log(response.data.items);
            if(response.data.items != null && response.data.items.length > 0) {
                var firstItem = response.data.items[0];
                $('#age').text(Math.round((Date.now() - Date.parse(firstItem.earliest_transaction.block_signed_at)) / (1000 * 60 * 60 * 24)));
                $("#transactionCount").text(firstItem.total_count);
                $("#earliestTransaction").html('<a href="https://explorer.testnet.mantle.xyz/tx/'+firstItem.earliest_transaction.tx_hash+'" target="_blank">'+firstItem.earliest_transaction.block_signed_at+'</a>');
                $("#lastestTransaction").html('<a href="https://explorer.testnet.mantle.xyz/tx/'+firstItem.latest_transaction.tx_hash+'" target="_blank">'+firstItem.latest_transaction.block_signed_at+'</a>');
                $('.summary-data-loading').css("display", "none");
                $('.summary-data').css("display", "block");
            }
        }
    });
}

$(document).ready(function() {
    $("#checkWalletButton").click(function() {
        getBalances();
        getHistoricalBalances();
        getTransfers();
        getTokenApprovals();
        getTransactionSummary();
    });
});