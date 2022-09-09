function filePicked(oEvent) {
    let files = oEvent.target.files;
    for (const key in files) {
        if (files.hasOwnProperty(key)) {
            // tableCreate(files[key]);

            var oFile = files[key];
            var sFilename = oFile.name;

            var reader = new FileReader();

            reader.fileName = sFilename
            let fileTypes = ['csv', 'ods', 'xlsx'];
            let extension = sFilename.split('.').pop().toLowerCase();
            let isSuccess = fileTypes.indexOf(extension) > -1;
            if (isSuccess) {
                reader.onload = function (e) {
                    var data = e.target.result;
                    data = new Uint8Array(data);
                    var workbook = XLSX.read(data, {type: 'array'});
                    var result = {};
                    console.log(data)
                    workbook.SheetNames.forEach(function (sheetName) {
                        var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
                        if (roa.length) result[sheetName] = roa;
                    });
                    for (const key in result) {
                        if (result.hasOwnProperty(key)) {
                            tableCreate(e.target.fileName, result[key]);
                        }
                    }
                };
                reader.readAsArrayBuffer(oFile);
            }
        }
    }
}

function tableCreate(filename, data) {
    const tbl = document.createElement('table');
    tbl.style.width = '500px';
    tbl.style.border = '1px solid black';
    let tabRows = data.length;
    let tableCol = data[0].length;

    for (let i = 0; i < tabRows; i++) {
        const tr = tbl.insertRow();
        for (let j = 0; j < tableCol; j++) {
            let datum = data[i][j];
            if (i === 0) {
                let th = document.createElement('th');
                th.innerHTML = datum;
                th.addEventListener('click', (() => {

                    let getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

                    let comparer = (idx, asc) => (a, b) => ((v1, v2) =>
                            v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
                    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

                    const table = th.closest('table');
                    Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
                        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
                        .forEach(tr => table.appendChild(tr));
                }));
                tr.appendChild(th);
            } else {
                const td = tr.insertCell(-1);
                td.appendChild(document.createTextNode(datum));
                td.style.border = '1px solid black';
            }
        }
    }

    let newDiv = document.createElement("div");
    let newContent = document.createTextNode(filename);
    my_file_output.prepend(tbl);
    my_file_output.prepend(newContent);
}

let my_file_output = document.createElement("div"), scoreElement, refreshIntervalId, ctx, gameState, canvas;
let fileChooser = document.createElement("input");
fileChooser.type = 'file';
fileChooser.setAttribute("multiple", "");
fileChooser.addEventListener('change', function (evt) {
    filePicked(evt);
});

document.body.appendChild(fileChooser);
document.body.appendChild(my_file_output);
fileChooser.click();