const bigs    = ["7", "8", "9"],
    smalls    = ["2", "3"],
    finding   = {
        value       : 0,
        persistance : 0,
    },
    hasZero   = (value) => value === "0",
    hasFive   = (value) => value === "5",
    combine   = (values, length = 1) => {
        let data    = Array(length),
            results = [],
            build   = (index) => {
                if(index === length) {
                    results.push(data.slice());
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
        persistance++;
        if (value.length === 1) {
            persistance--;
            return {value: start, persistance};
        } else if (value.some(hasZero)) {
            persistance++;
            return {value: start, persistance};
        } else if (value.some(hasFive) && (persistance + 1) < finding.persistance) {
            return {value: start, persistance};
        }
        let next = 1;
        value.map((digit) => next *= parseInt(digit));
        return calculate(start, next.toString().split(""), persistance);
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
            console.log("\tAt size ->", size);
            let source = combine(bigs, size);

            for (let value of smalls.map((small) => source.map((combination) => [small, combination].flat())).flat()) {
                let result = calculate(value);
                value = undefined;

                if (result.persistance > finding.persistance) {
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

loop();

module.exports = loop;
module.exports.calculate = calculate;
module.exports.combine = combine;
