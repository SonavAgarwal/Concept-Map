export function evaluateMath(circleData, circleDataMap, connectionData, connectionDataMap) {
    // go through all connections, store endpoint values in hashmap of circles

    let circleConnections = {};

    for (let connection of connectionData) {
        addCirConInput(connection.circles[1], connection.circles[0]);
        addCirConOutput(connection.circles[0], connection.circles[1]);

        function addCirConInput(target, cir) {
            if (!circleConnections[target]) {
                circleConnections[target] = {};
            }

            let cirConLists = circleConnections[target];

            if (!cirConLists.inputs) {
                cirConLists.inputs = [];
            }

            if (!cirConLists.outputs) {
                cirConLists.outputs = [];
            }

            cirConLists.inputs.push(cir);
        }

        function addCirConOutput(target, cir) {
            if (!circleConnections[target]) {
                circleConnections[target] = {};
            }

            let cirConLists = circleConnections[target];

            if (!cirConLists.inputs) {
                cirConLists.inputs = [];
            }

            if (!cirConLists.outputs) {
                cirConLists.outputs = [];
            }

            cirConLists.outputs.push(cir);
        }
    }

    // find all circles that don't have anything coming out but do have stuff going in

    function evaluateCircle(cir) {
        let cirCon = circleConnections[cir];
        let cirConInputs = cirCon.inputs;
        let cirDat = circleDataMap[cir];

        let value;

        if (cirCon.visited) {
            value = cirCon.value;
        } else if (!cirCon.inputs || cirCon.inputs.length == 0) {
            value = cirDat.content;
        } else if (cirCon.inputs.length == 1) {
            value = evaluateCircle(cirCon.inputs[0]);
        } else {
            if (cirDat.content == "+") {
                value = 0;
            } else if (cirDat.content == "x") {
                value = 1;
            }

            for (let inp of cirConInputs) {
                if (cirDat.content == "+") {
                    value += evaluateCircle(inp);
                } else if (cirDat.content == "x") {
                    value *= evaluateCircle(inp);
                }
            }
        }

        cirCon.visited = true;

        return stringToNumber(value);
    }

    for (let cir of Object.keys(circleConnections)) {
        // recursion and then pass up values

        if (circleConnections[cir].outputs.length == 0) {
            circleDataMap[cir].content = evaluateCircle(cir);
        }
    }
}

function stringToNumber(str) {
    return parseFloat(str);
}
