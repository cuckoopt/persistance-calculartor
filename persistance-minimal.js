const bigs    = ["7", "8", "9"],
    smalls    = ["2", "3"],
    finding   = {
        value       : 0,
        persistance : 0,
    },
    calculate = (start, value, persistance) => {
        value = value.toString()
        if (value.length === 1) {
            return {value: start, persistance};
        } else if (value.includes("0")) {
            return {value: start, persistance : persistance + 1};
        }
        persistance++;
        let result = 1;
        value.split("").map((digit) => result *= digit);
        return calculate(start, result, persistance);
    },
    combine   = (length, data) => {
        if(data.length === length) {
            smalls.map((small) => {
                let result = calculate(small + data, small + data, 0);
                if (result.persistance > finding.persistance) {
                    console.log("\nFound ->", result);
                    finding.value       = result.value;
                    finding.persistance = result.persistance;
                }
            });
        } else {
            for(let value of bigs) { combine(length, data + value) }
        }
    };
console.log("\nRunning persistance calculator\n------------------------------\n");

for (let size = 1; true; size++) {
    console.log("\tAt size ->", size + 1);
    combine(size, "");
}
