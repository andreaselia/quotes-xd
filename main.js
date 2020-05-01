const { Text, Color } = require("scenegraph");
const { alert, error } = require("./lib/dialogs.js");

async function randomQuote() {
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();
    return data;
}

async function quickQuoteHandlerFunction(selection) {
    try {
        const quote = await randomQuote();
    } catch (ex) {
        await error("Please check your network connection.");
        return;
    }

    const node = new Text();
    node.text = `${quote.content} - ${quote.author}`;
    node.fill = new Color().clone();
    node.fontSize = 18;
    node.areaBox = { width: 800, height: 200 };

    selection.insertionParent.addChild(node);
    node.moveInParentCoordinates(20, 20);
}

async function fillQuoteHandlerFunction(selection) {
    let quote = '';

    try {
        quote = await randomQuote();
    } catch (ex) {
        await error("Please check your network connection.");
        return;
    }

    let candidateItems = 0;
    let affectedItems = 0;

    selection.items.filter(item => item instanceof Text)
        .forEach(item => {
            candidateItems++;

            const text = item.text;
            const length = text.length;

            item.text = `${quote.content} - ${quote.author}`;

            affectedItems++;
        });

    if (candidateItems === 0 || affectedItems === 0) {
        if (selection.items.length === 0 || candidateItems === 0) {
            alert(selection.items.length === 0 ? "Nothing selected..." : "No operable items selected...", "Be sure to select one or more text items.");
            return;
        }

        if (candidateItems > affectedItems) {
            error("No operable items selected...");
            return;
        }
    }
}

module.exports = {
    commands: {
        quickQuote: quickQuoteHandlerFunction,
        fillQuote: fillQuoteHandlerFunction,
        shuffleQuote: fillQuoteHandlerFunction
    }
};
