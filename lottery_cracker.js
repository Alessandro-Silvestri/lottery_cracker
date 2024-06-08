/*
LOTTERY GUESSER
(https://bet.szerencsejatek.hu/)

This program checks how many times a number has been been picked given an HTML with many extractions.
Any extraction has 8 numbers.
The 2 main problems I have solved are: retrieving the 8 most piked numbers and scraping an HTML
file that contains all the daily exctractions

Solved by Alessandro Silvestri - 2024 <alessandro.silvestri.work@gmail.com>
*/


// check the sequence of 8 numbers
function isEightNumbers(txt) {
    // convert the text in array of 8 numbers
    txt = txt.split(",");
    // check if there are 8 items in the array
    if (txt.length !== 8) {
        return false;
    }
    // check if they are all numbers between 1 and 20
    for (let i of txt) {
        i = parseInt(i);
        if (!(i >= 1 && i <= 20)) {
            return false;
        }
    }
    return true;
}

// parse the sequence of 8 numbers string in an array of 8 numbers
function parseEightNumbersInt(txt) {
    let txtArrSplit = txt.split(",");
    // convert the 8 string/number in numbers
    let intArr = txtArrSplit.map(n => parseInt(n))
    return intArr;
}

// file reader
const fileInput = document.getElementById("fileInput");

// file loader
fileInput.addEventListener("change", (event) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(selectedFile);
    reader.onload = (event) => {
        const textContent = event.target.result;
        const lines = textContent.split(/\r?\n/); // Split on both \n and \r\n (carriage return)
        console.log(typeof lines);

        let extractionsList = [];
        let allNumbers = {};

        // reading line by line the text file
        for (let line of lines) {
            line = line.trim();
            // check if the line starts with <div>
            if (line.slice(0, 5) === "<div>") {
                // remove middle spaces and <div> tags
                line = line.replace(" ", "")
                    .replace("<div>", "")
                    .replace("</div>", "");
                // check if the line is an 8 number sequence 
                if (isEightNumbers(line)) {
                    line = parseEightNumbersInt(line);
                    extractionsList.push(line);
                }
            }
        }

        // fill the objects with extractions data
        for (let row of extractionsList) {
            for (let num of row) {
                if (!(num in allNumbers)) {
                    allNumbers[num] = 1;
                } else {
                    allNumbers[num]++;
                }
            }
        }

        // sorting (multidimensional array)
        let allNumbersSorted = Object.entries(allNumbers).sort(
            (a, b) => b[1] - a[1]
        );

        // print the first most drew numbers
        console.log("\nMost drew numbers: ");
        let counter = 0;
        for (let j = 0; j < allNumbersSorted.length; j++) {
            let num = allNumbersSorted[j][0];
            let times = allNumbersSorted[j][1];
            console.log(`number: ${num} --> times: ${times}`);
            counter++;
            if (counter == 8) {
                break;
            }
        }

        // print less drew numbers
        console.log("\nLess drew numbers: ");
        counter = 0;
        for (let j = allNumbersSorted.length - 1; j >= 0; j--) {
            let num = allNumbersSorted[j][0];
            let times = allNumbersSorted[j][1];
            console.log(`number: ${num} --> times: ${times}`);
            counter++;
            if (counter == 8) {
                break;
            }
        }
    };

    reader.onerror = (error) => {
        console.error("Error reading file:", error);
    };
});

