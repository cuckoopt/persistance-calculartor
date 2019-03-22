const bigs         = ["7", "8", "9"],
    smalls         = ["2", "3"],
    arguments      = process.argv.slice(2),
    finding        = {
        value       : 0,
        persistance : 0,
    },
    isZero         = (value) => value === "0",
    combine        = (values, length = 1) => {
        let data    = Array(length),
            results = [],
            build   = (index) => {
                if(index === length) {
                    let newValue = data.slice().sort().join("");
                    if (!results.some((value) => newValue === value)) {
                        results.push(newValue);
                    }
                    newValue = undefined;
                    return;
                }
                for(let value of values) {
                    data[index] = value;
                    value = undefined;
                    build(index + 1);
                }
            };
        build(0);
        data = undefined;
        return results;
    },
    calculate = (start, value = start, persistance = 0) => {
        if (value.length === 1) {
            return {value: start, persistance};
        } else if (value.some(isZero)) {
            persistance += 1;
            return {value: start, persistance};
        }
        persistance++;
        let result = 1;
        value.map((digit) => result *= parseInt(digit));
        let calculated = calculate(start, result.toString().split(""), persistance);
        result = undefined;
        return calculated;
    },
    loop      = (start = { value : 0, persistance : 0 }) => {
        if (!global.gc) {
            console.log("Garbage collection is not exposed\nrun with '--expose_gc'");
            return;
        }
        Object.assign(finding, start);
        let size = finding.persistance + 1;

        while (true) {
            global.gc();
            console.log("\tAt size ->", size + 1);
            let source = combine(bigs, size);

            for (let value of smalls.map((small) => source.map((combination) => small + combination)).flat()) {
                let result = calculate(value.split(""));
                value = undefined;

                if (result.persistance > finding.persistance) {
                    result.value = parseInt(result.value.join(""));
                    Object.assign(finding, result);
                    console.log("\nFound ->", result, "\n");
                } else {
                    result = undefined;
                }
            }
            source = undefined;
            size++;
        }
    };

console.log("\nRunning persistance calculator\n------------------------------\n");

switch (arguments[0]) {
    case undefined :
    case "run" : {
        let start;
        try {
            start = JSON.parse(arguments[1]);
        } finally {
            loop(start);
        }
        break;
    }
    case "calculate" : {
        try {
            const value = parseInt(arguments[1]).toString().split(""),
                result  = calculate(value);
            result.value = parseInt(result.value.join(""));
            console.log(result);
        } catch(err) {
            console.log("Invalid integer ->", arguments[1]);
        }
        break;
    }
    default : {
        console.log("Invalid argument ->", arguments[0]);
        break;
    }
}

module.exports = loop;
module.exports.calculate = calculate;
module.exports.combine = combine;
