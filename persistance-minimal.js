const bigs    = ["7", "8", "9"],
    smalls    = ["2", "3"],
    finding   = {
        value       : 0,
        persistance : 0,
    },
    calculate = (start, value, persistance) => {
        if (value.length === 1) {
            return {value: start, persistance};
        } else if (value.includes("0") || (value.includes("5") && (value.includes("2") || value.includes("4") || value.includes("6") || value.includes("8")))) {
            return {value: start, persistance : persistance + 2};
        }
        persistance++;
        let result = 1;
        value.split("").map((digit) => result *= digit);
        return calculate(start, result.toString(), persistance);
    },
    combine   = (length, data) => {
        if(data.length === length) {
            smalls.map((small) => {
                let result = calculate(small + data, small + data, 0);
                if (result.persistance > finding.persistance) {
                    Object.assign(finding, result);
                    console.log("\nFound ->", result);
                }
                result = undefined;
            });
        } else {
            for(let value of bigs) { combine(length, data + value) }
        }
    },
    loop      = () => {
        if (!global.gc) {
            console.log("Garbage collection is not exposed\nrun with '--expose_gc'");
            return;
        }
        for (let size = 1; true; size++) {
            console.log("\tAt size ->", size);
            combine(size, "");
            global.gc();
        }
    };
console.log("\nRunning persistance calculator\n------------------------------\n");
loop();
