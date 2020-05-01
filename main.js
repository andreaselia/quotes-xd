const { Text, Color } = require("scenegraph");
const { alert, error } = require("./lib/dialogs.js");

async function randomQuote() {
    try {
        const response = await fetch("https://api.quotable.io/random");
        return response.json();
    } catch (ex) {
        error("The quotes API or your network connection is currently be unavailable.");
        throw "The quotes API or your network connection is currently be unavailable.";
    }
}

async function quickQuoteHandlerFunction(selection) {
    const { content, author } = await randomQuote();

    const node = new Text();
    node.text = `${content} - ${author}`;
    node.fill = new Color().clone();
    node.fontSize = 18;
    node.areaBox = { width: 800, height: 200 };

    selection.insertionParent.addChild(node);
    node.moveInParentCoordinates(20, 20);
}

async function fillQuoteHandlerFunction(selection) {
    let candidateItems = 0;

    const items = selection.items;

    for (let i = items.length - 1; i >= 0; i--) {
        let item = items[i];

        if (! item instanceof Text) {
            continue;
        }

        candidateItems++;

        const text = item.text;
        const length = text.length;

        const { content, author } = await randomQuote();
        item.text = `${content} - ${author}`;
    }

    if (selection.items.length === 0 || candidateItems === 0) {
        alert("Unable to perform operation", "Be sure to select one or more text items.");
        return;
    }
}

module.exports = {
    commands: {
        quickQuote: quickQuoteHandlerFunction,
        fillQuote: fillQuoteHandlerFunction,
        shuffleQuote: fillQuoteHandlerFunction
    }
};
