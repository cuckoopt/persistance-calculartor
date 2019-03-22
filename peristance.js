const bigs    = ["7", "8", "9"],
    smalls    = ["2", "3"],
    finding   = {
        value       : 0,
        persistance : 0,
    },
    cache     = {},
    isZero    = (value) => value === "0",
    isFive    = (value) => value === "5",
    isEven    = (value) => (parseInt(value) % 2) === 0,
    combine   = (values, length = 1) => {
        let data    = Array(length),
            results = [],
            build   = (index) => {
                if(index === length) {
                    let newValue = data.slice().sort();
                    if (!results.some((value) => newValue.join("") === value.join(""))) {
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
        if (value.join("") in cache) {
            return {value: start, persistance : cache[value.join("")] + persistance};
        } else if (value.length === 1) {
            cache[start.join("")] = persistance;
            return {value: start, persistance};
        } else if (value.some(isZero) || (value.some(isFive) && value.some(isEven))) {
            persistance += 2;
            cache[start.join("")] = persistance;
            return {value: start, persistance};
        }
        persistance++;
        let result = 1;
        value.map((digit) => result *= parseInt(digit));
        let next       = result.toString().split("").sort(),
            calculated = calculate(start, next, persistance);
        cache[next.join("")] = calculated.persistance - persistance;
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

process.on("sigint", () => {
    console.log(cache)
})

module.exports = loop;
module.exports.calculate = calculate;
module.exports.combine = combine;
