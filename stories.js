import { readFile, appendFile } from 'fs/promises';


function deserializeRow(row, delimiter = ',') {
    return row.trim();
}


async function getData(path) {
    try {
        const data = await readFile(path, 'utf-8');
        const rows = data.split('\n');
        return rows.map(row => deserializeRow(row, ','));
    } catch (err) {
        console.error(`Could not read file at ${path}:`, err);
        return [];
    }
}


async function main() {
    const verbs = await getData('./data/verbs.csv');
    const adjectives = await getData('./data/adjectives.csv');
    const nouns = await getData('./data/nouns.csv');
    const features = await getData('./data/features.csv');

    const prompt = "Напиши кратка приказка (от 3 до 5 параграфа), която използва само прости думи, които три годишен би разбрал. Приказката трябва да използва глаголът \"{verb}\", съществителното \"{noun}\" и прилагателното \"{adjective}\". Приказката трябва да покрива следните изисквания: трябва да има {feature}.\nИзползвай само прости думи!\n----\n";

    for (let i = 0; i < 1000; i++) {
        const currVerb = verbs[Math.floor(Math.random() * verbs.length)];
        const currAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const currNoun = nouns[Math.floor(Math.random() * nouns.length)];
        const currFeature = features[Math.floor(Math.random() * features.length)];

        let output = prompt
            .replace('{verb}', currVerb)
            .replace('{adjective}', currAdj)
            .replace('{noun}', currNoun)
            .replace('{feature}', currFeature);

        try {
            await appendFile('./output.txt', output + '\n');
            console.log(`Saved ${i + 1}`);
        } catch (err) {
            console.error('Error writing to file:', err);
        }
    }
}


main();

