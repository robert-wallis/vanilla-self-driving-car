class NeuralNetwork {
    static initRandom(neuronCounts, labels) {
        let nn = new NeuralNetwork();
        nn.layers = [];
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            const inputCount = neuronCounts[i];
            let outputCount = neuronCounts[i + 1];
            nn.layers.push(NNLayer.initRandom(inputCount, outputCount));
        }
        let outputCount = neuronCounts[neuronCounts.length - 1];
        nn.labels = labels;
        nn.outputs = new Float32Array(outputCount);
        return nn;
    }

    static initDeserialize(json) {
        let nn = new NeuralNetwork();
        nn.layers = [];
        for (let i = 0; i < json.layers.length; i++) {
            nn.layers.push(NNLayer.initDeserialize(json.layers[i]));
        }
        let jsonOutputs = Object.values(json.outputs);
        nn.outputs = new Float32Array(jsonOutputs.length);
        for (let o = 0; o < jsonOutputs.length; o++) {
            nn.outputs[o] = jsonOutputs[o];
        }
        nn.labels = json.labels;
        return nn;
    }

    feedForward(givenInputs) {
        this.outputs = this.layers.reduce(
            (outputs, layer) => layer.feedForward(outputs),
            givenInputs
        );
        return this.outputs;
    }

    mutateWeightsAndBiases(amount=1.0) {
        this.layers.forEach(layer => {
            for (let i = 0; i < layer.weights.length; i++) {
                for (let o = 0; o < layer.weights[i].length; o++) {
                    const weight = layer.weights[i][o];
                    layer.weights[i][o] = lerp(weight, Math.random()*2.0-1.0, amount);
                }
            }
            for (let b = 0; b < layer.biases.length; b++) {
                const bias = layer.biases[b];
                layer.biases[b] = lerp(bias, Math.random()*2.0-1.0, amount);
            }
        });
    }
}

class NNLayer {
    constructor(inputCount, outputCount) {
        this.inputs = new Float32Array(inputCount);
        this.biases = new Float32Array(outputCount);

        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Float32Array(outputCount);
        }
    }

    static initRandom(inputCount, outputCount) {
        let layer = new NNLayer(inputCount, outputCount);
        for (let i = 0; i < layer.inputs.length; i++) {
            for (let o = 0; o < layer.biases.length; o++) {
                layer.weights[i][o] = Math.random() * 2 - 1; // [-1.0, 1.0]
            }
        }
        layer.biases = layer.biases.map(_ => Math.random() * 2 - 1);
        return layer;
    }

    static initDeserialize(json) {
        let jsonInputs = Object.values(json.inputs);
        let jsonBiases = Object.values(json.biases);
        let layer = new NNLayer(jsonInputs.length, jsonBiases.length);
        for (let i = 0; i < jsonInputs.length; i++) {
            layer.inputs[i] = jsonInputs[i];
        }
        for (let o = 0; o < jsonBiases.length; o++) {
            layer.biases[o] = jsonBiases[o];
        }
        let jsonWeights = Object.values(json.weights);
        for (let i = 0; i < jsonWeights.length; i++) {
            let jsonOutputs = Object.values(jsonWeights[i]);
            for (let o = 0; o < jsonOutputs.length; o++) {
                layer.weights[i][o] = jsonOutputs[o];
            }
        }
        return layer;
    }

    feedForward(givenInputs) {
        let outputs = new Float32Array(this.biases.length);
        for (let i = 0; i < this.inputs.length; i++) {
            this.inputs[i] = givenInputs[i];
        }
        for (let o = 0; o < this.biases.length; o++) {
            let sum = 0.0;
            for (let i = 0; i < this.inputs.length; i++) {
                sum += this.inputs[i] * this.weights[i][o];
            }
            // if the input is large enough, then activate the output
            outputs[o] = sum > this.biases[o] ? 1.0 : 0.0;
        }
        return outputs;
    }
}