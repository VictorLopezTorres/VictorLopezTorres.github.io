const fs = require('fs');

const fillBlank6th = {
    unit1: [
        {
            text: "The primary motivation for [BLANK_0] to explore North America was the lucrative [BLANK_1] trade.",
            blanks: ["France", "fur"],
            wordBank: ["France", "England", "fur", "spice", "gold"],
            hint: "They built strong alliances with Native Americans.",
            dok: 2
        },
        {
            text: "The [BLANK_0] Compact was signed by the [BLANK_1] to establish self-government before landing at Plymouth.",
            blanks: ["Mayflower", "Pilgrims"],
            wordBank: ["Mayflower", "Magna", "Pilgrims", "Puritans", "Declaration"],
            hint: "It was an early agreement for self-government.",
            dok: 2
        },
        {
            text: "The first permanent [BLANK_0] settlement in North America was [BLANK_1], founded in 1607.",
            blanks: ["English", "Jamestown"],
            wordBank: ["English", "French", "Jamestown", "Plymouth", "Roanoke"],
            hint: "It was saved by tobacco.",
            dok: 1
        },
        {
            text: "William Penn founded [BLANK_0] as a safe haven for [BLANK_1], who believed in pacifism.",
            blanks: ["Pennsylvania", "Quakers"],
            wordBank: ["Pennsylvania", "Massachusetts", "Quakers", "Puritans", "Catholics"],
            hint: "The state is named after him.",
            dok: 2
        },
        {
            text: "[BLANK_0]'s Rebellion was an uprising of poor farmers in [BLANK_1] protesting the governor's policies.",
            blanks: ["Bacon", "Virginia"],
            wordBank: ["Bacon", "Shays", "Virginia", "Massachusetts", "Pontiac"],
            hint: "It resulted in the burning of Jamestown.",
            dok: 2
        }
    ],
    unit2: [
        {
            text: "The [BLANK_0] colonies' economy was heavily based on shipbuilding and [BLANK_1] due to rocky soil.",
            blanks: ["New England", "fishing"],
            wordBank: ["New England", "Southern", "Middle", "fishing", "farming", "mining"],
            hint: "Think about Massachusetts and Rhode Island.",
            dok: 2
        },
        {
            text: "The horrific journey of enslaved Africans across the Atlantic was called the [BLANK_0] [BLANK_1].",
            blanks: ["Middle", "Passage"],
            wordBank: ["Middle", "Columbian", "Passage", "Exchange", "Northwest"],
            hint: "It was the center leg of the Triangular Trade.",
            dok: 1
        },
        {
            text: "Large farms in the [BLANK_0] colonies that relied on enslaved labor to grow cash crops were called [BLANK_1].",
            blanks: ["Southern", "plantations"],
            wordBank: ["Southern", "Middle", "plantations", "granges", "homesteads"],
            hint: "They grew tobacco, rice, and indigo.",
            dok: 2
        },
        {
            text: "The [BLANK_0] Colonies were known as the 'Breadbasket' and had the most [BLANK_1] populations.",
            blanks: ["Middle", "diverse"],
            wordBank: ["Middle", "New England", "diverse", "uniform", "Southern"],
            hint: "They included Pennsylvania and New York.",
            dok: 2
        },
        {
            text: "An [BLANK_0] servant agreed to work for a set time in exchange for [BLANK_1] to the colonies.",
            blanks: ["indentured", "passage"],
            wordBank: ["indentured", "enslaved", "passage", "money", "land"],
            hint: "They signed a contract, usually for 4 to 7 years.",
            dok: 2
        }
    ],
    unit3: [
        {
            text: "Jean-Baptiste Le Moyne de [BLANK_0] is considered the 'Father of Louisiana' and founded [BLANK_1] in 1718.",
            blanks: ["Bienville", "New Orleans"],
            wordBank: ["Bienville", "Iberville", "New Orleans", "Baton Rouge", "Natchitoches"],
            hint: "He served as governor of the colony multiple times.",
            dok: 2
        },
        {
            text: "The [BLANK_0] Noir was a set of laws created by the French to govern the lives of [BLANK_1] people.",
            blanks: ["Code", "enslaved"],
            wordBank: ["Code", "Magna", "enslaved", "free", "Native"],
            hint: "It translates to the 'Black Code'.",
            dok: 2
        },
        {
            text: "The [BLANK_0] were exiles from Canada who settled in Louisiana and became known as [BLANK_1].",
            blanks: ["Acadians", "Cajuns"],
            wordBank: ["Acadians", "Isleños", "Cajuns", "Creoles", "Haitians"],
            hint: "They were expelled from Nova Scotia by the British.",
            dok: 2
        },
        {
            text: "The secret Treaty of [BLANK_0] transferred control of Louisiana from [BLANK_1] to Spain in 1762.",
            blanks: ["Fontainebleau", "France"],
            wordBank: ["Fontainebleau", "Paris", "France", "Britain", "Portugal"],
            hint: "France wanted to keep the territory out of British hands.",
            dok: 2
        },
        {
            text: "The Spanish governor Alejandro [BLANK_0] earned a 'Bloody' nickname for crushing the 1768 [BLANK_1].",
            blanks: ["O'Reilly", "rebellion"],
            wordBank: ["O'Reilly", "Galvez", "rebellion", "election", "treaty"],
            hint: "He firmly established Spanish authority in the colony.",
            dok: 2
        }
    ],
    unit4: [
        {
            text: "The French and [BLANK_0] War was fought primarily between France and [BLANK_1] for control of the Ohio River Valley.",
            blanks: ["Indian", "Great Britain"],
            wordBank: ["Indian", "Spanish", "Great Britain", "Spain", "Netherlands"],
            hint: "It led to massive British war debt.",
            dok: 2
        },
        {
            text: "The [BLANK_0] Act placed a tax on all paper goods, such as newspapers and legal [BLANK_1].",
            blanks: ["Stamp", "documents"],
            wordBank: ["Stamp", "Sugar", "documents", "tea", "glass"],
            hint: "Colonists had to buy a special seal.",
            dok: 1
        },
        {
            text: "Thomas [BLANK_0] was the primary author of the Declaration of [BLANK_1].",
            blanks: ["Jefferson", "Independence"],
            wordBank: ["Jefferson", "Washington", "Independence", "Rights", "Confederation"],
            hint: "He wrote that 'all men are created equal.'",
            dok: 1
        },
        {
            text: "The Battle of [BLANK_0] is considered the turning point of the Revolution because it convinced [BLANK_1] to ally with the colonists.",
            blanks: ["Saratoga", "France"],
            wordBank: ["Saratoga", "Yorktown", "France", "Spain", "Britain"],
            hint: "It proved the Americans could fight a conventional war.",
            dok: 2
        },
        {
            text: "The Proclamation of [BLANK_0] forbade colonists from settling west of the [BLANK_1] Mountains.",
            blanks: ["1763", "Appalachian"],
            wordBank: ["1763", "1776", "Appalachian", "Rocky", "Andes"],
            hint: "King George III issued this to avoid conflict with Native Americans.",
            dok: 2
        }
    ],
    unit5: [
        {
            text: "The [BLANK_0] of Confederation was the first written [BLANK_1] of the United States.",
            blanks: ["Articles", "constitution"],
            wordBank: ["Articles", "Declaration", "constitution", "treaty", "law"],
            hint: "It created a very weak central government.",
            dok: 1
        },
        {
            text: "The [BLANK_0] Compromise settled the dispute over representation by creating a [BLANK_1] legislature.",
            blanks: ["Great", "bicameral"],
            wordBank: ["Great", "Three-Fifths", "bicameral", "unicameral", "judicial"],
            hint: "It combined the Virginia and New Jersey plans.",
            dok: 2
        },
        {
            text: "The [BLANK_0] Compromise determined how enslaved people would be counted for [BLANK_1] and taxation.",
            blanks: ["Three-Fifths", "representation"],
            wordBank: ["Three-Fifths", "Great", "representation", "voting", "freedom"],
            hint: "It counted a portion of the enslaved population.",
            dok: 2
        },
        {
            text: "James [BLANK_0] is known as the 'Father of the Constitution' for his role in drafting the [BLANK_1].",
            blanks: ["Madison", "document"],
            wordBank: ["Madison", "Jefferson", "document", "declaration", "treaty"],
            hint: "He kept detailed notes of the convention.",
            dok: 1
        },
        {
            text: "Shays's [BLANK_0] proved that the national government was too [BLANK_1] under the Articles of Confederation.",
            blanks: ["Rebellion", "weak"],
            wordBank: ["Rebellion", "War", "weak", "strong", "rich"],
            hint: "It was an uprising of Massachusetts farmers.",
            dok: 2
        }
    ]
};

const fillBlank7th = {
    unit1: [
        {
            text: "George Washington warned against political [BLANK_0] and foreign [BLANK_1] in his Farewell Address.",
            blanks: ["parties", "alliances"],
            wordBank: ["parties", "taxes", "alliances", "trade", "banks"],
            hint: "He feared these would divide and endanger the nation.",
            dok: 2
        },
        {
            text: "Alexander Hamilton served as the first Secretary of the [BLANK_0] and championed the National [BLANK_1].",
            blanks: ["Treasury", "Bank"],
            wordBank: ["Treasury", "State", "Bank", "Army", "Debt"],
            hint: "He is featured on the ten-dollar bill.",
            dok: 1
        },
        {
            text: "The [BLANK_0] Rebellion was an uprising of farmers protesting a federal [BLANK_1].",
            blanks: ["Whiskey", "tax"],
            wordBank: ["Whiskey", "Shays'", "tax", "law", "tariff"],
            hint: "Washington led troops to stop it.",
            dok: 2
        },
        {
            text: "The [BLANK_0] and Sedition Acts restricted freedom of speech and the [BLANK_1].",
            blanks: ["Alien", "press"],
            wordBank: ["Alien", "Stamp", "press", "religion", "assembly"],
            hint: "Passed under John Adams.",
            dok: 2
        },
        {
            text: "Marbury v. [BLANK_0] established the principle of judicial [BLANK_1].",
            blanks: ["Madison", "review"],
            wordBank: ["Madison", "Maryland", "review", "branch", "supremacy"],
            hint: "It involved 'midnight judges'.",
            dok: 2
        }
    ],
    unit2: [
        {
            text: "The Louisiana [BLANK_0] doubled the size of the United States in [BLANK_1].",
            blanks: ["Purchase", "1803"],
            wordBank: ["Purchase", "Territory", "1803", "1812", "1776"],
            hint: "It was bought from France.",
            dok: 1
        },
        {
            text: "The British practice of [BLANK_0] forced American sailors to serve in the British [BLANK_1].",
            blanks: ["impressment", "navy"],
            wordBank: ["impressment", "embargo", "navy", "army", "merchant"],
            hint: "A major cause of the War of 1812.",
            dok: 2
        },
        {
            text: "The [BLANK_0] Doctrine warned Europe not to [BLANK_1] the Americas.",
            blanks: ["Monroe", "colonize"],
            wordBank: ["Monroe", "Truman", "colonize", "invade", "trade"],
            hint: "Issued in 1823.",
            dok: 2
        },
        {
            text: "Lewis and [BLANK_0] explored the new western territory with the help of [BLANK_1].",
            blanks: ["Clark", "Sacagawea"],
            wordBank: ["Clark", "Pike", "Sacagawea", "Pocahontas", "Tecumseh"],
            hint: "Their group was called the Corps of Discovery.",
            dok: 1
        },
        {
            text: "The Battle of New [BLANK_0] made Andrew [BLANK_1] a national hero.",
            blanks: ["Orleans", "Jackson"],
            wordBank: ["Orleans", "York", "Jackson", "Washington", "Harrison"],
            hint: "Fought after the treaty was signed.",
            dok: 2
        }
    ],
    unit3: [
        {
            text: "Manifest [BLANK_0] was the belief that the U.S. was meant to expand to the [BLANK_1] Ocean.",
            blanks: ["Destiny", "Pacific"],
            wordBank: ["Destiny", "Expansion", "Pacific", "Atlantic", "Gulf"],
            hint: "Translates to 'obvious fate'.",
            dok: 1
        },
        {
            text: "The [BLANK_0] gin vastly increased the demand for [BLANK_1] labor in the South.",
            blanks: ["cotton", "enslaved"],
            wordBank: ["cotton", "steam", "enslaved", "free", "factory"],
            hint: "Invented by Eli Whitney.",
            dok: 2
        },
        {
            text: "The forced march of the [BLANK_0] people is known as the Trail of [BLANK_1].",
            blanks: ["Cherokee", "Tears"],
            wordBank: ["Cherokee", "Seminole", "Tears", "Sorrow", "Death"],
            hint: "To Indian Territory.",
            dok: 1
        },
        {
            text: "The [BLANK_0] Revolution was the rapid shift to machine-made goods in [BLANK_1].",
            blanks: ["Industrial", "factories"],
            wordBank: ["Industrial", "Agricultural", "factories", "farms", "homes"],
            hint: "Began in New England.",
            dok: 2
        },
        {
            text: "Andrew Jackson rewarded his supporters with government jobs in the [BLANK_0] [BLANK_1].",
            blanks: ["Spoils", "System"],
            wordBank: ["Spoils", "Merit", "System", "Bargain", "Branch"],
            hint: "To the victor go the spoils.",
            dok: 2
        }
    ],
    unit4: [
        {
            text: "The Seneca Falls Convention was the first public meeting focused on [BLANK_0] [BLANK_1].",
            blanks: ["women's", "rights"],
            wordBank: ["women's", "civil", "rights", "suffrage", "labor"],
            hint: "Held in New York in 1848.",
            dok: 2
        },
        {
            text: "Harriet [BLANK_0] was a famous 'conductor' on the [BLANK_1] Railroad.",
            blanks: ["Tubman", "Underground"],
            wordBank: ["Tubman", "Stowe", "Underground", "Transcontinental", "Erie"],
            hint: "Known as 'Moses'.",
            dok: 1
        },
        {
            text: "Dorothea [BLANK_0] campaigned to improve conditions in prisons and mental [BLANK_1].",
            blanks: ["Dix", "asylums"],
            wordBank: ["Dix", "Truth", "asylums", "factories", "schools"],
            hint: "Lobbied for humane hospitals.",
            dok: 2
        },
        {
            text: "The [BLANK_0] Movement sought to ban the consumption and sale of [BLANK_1].",
            blanks: ["Temperance", "alcohol"],
            wordBank: ["Temperance", "Abolition", "alcohol", "tobacco", "sugar"],
            hint: "Blamed for poverty and violence.",
            dok: 2
        },
        {
            text: "Frederick [BLANK_0] was a formerly enslaved man who published the abolitionist newspaper The North [BLANK_1].",
            blanks: ["Douglass", "Star"],
            wordBank: ["Douglass", "Garrison", "Star", "Liberator", "Press"],
            hint: "A powerful speaker and writer.",
            dok: 1
        }
    ],
    unit5: [
        {
            text: "The [BLANK_0] Scott decision ruled that enslaved people were [BLANK_1] and could not sue.",
            blanks: ["Dred", "property"],
            wordBank: ["Dred", "Fugitive", "property", "citizens", "free"],
            hint: "Declared the Missouri Compromise unconstitutional.",
            dok: 2
        },
        {
            text: "The [BLANK_0] Slave Act allowed catchers into Northern states to capture escaped [BLANK_1].",
            blanks: ["Fugitive", "enslaved"],
            wordBank: ["Fugitive", "Missouri", "enslaved", "criminals", "immigrants"],
            hint: "Part of the Compromise of 1850.",
            dok: 2
        },
        {
            text: "The first shots of the American [BLANK_0] War were fired at Fort [BLANK_1].",
            blanks: ["Civil", "Sumter"],
            wordBank: ["Civil", "Revolutionary", "Sumter", "Wagner", "Knox"],
            hint: "Located in South Carolina.",
            dok: 1
        },
        {
            text: "The [BLANK_0] Proclamation freed enslaved people specifically in the [BLANK_1] states.",
            blanks: ["Emancipation", "Confederate"],
            wordBank: ["Emancipation", "Gettysburg", "Confederate", "Union", "Border"],
            hint: "Issued by Lincoln after Antietam.",
            dok: 2
        },
        {
            text: "General Robert E. [BLANK_0] surrendered to Ulysses S. [BLANK_1] at Appomattox Court House.",
            blanks: ["Lee", "Grant"],
            wordBank: ["Lee", "Jackson", "Grant", "Sherman", "Lincoln"],
            hint: "Effectively ending the Civil War.",
            dok: 1
        }
    ]
};

const fillBlank8th = {
    unit1: [
        {
            text: "The [BLANK_0] Amendment permanently abolished [BLANK_1] in the United States.",
            blanks: ["13th", "slavery"],
            wordBank: ["13th", "14th", "slavery", "segregation", "poll taxes"],
            hint: "Passed shortly before Lincoln's death.",
            dok: 1
        },
        {
            text: "The [BLANK_0] Amendment granted citizenship and equal [BLANK_1] under the law.",
            blanks: ["14th", "protection"],
            wordBank: ["14th", "15th", "protection", "voting", "rights"],
            hint: "Aimed to protect formerly enslaved people.",
            dok: 2
        },
        {
            text: "In the agricultural system of [BLANK_0], poor farmers worked land in exchange for a portion of the [BLANK_1].",
            blanks: ["sharecropping", "crops"],
            wordBank: ["sharecropping", "homesteading", "crops", "money", "debt"],
            hint: "It often trapped families in debt.",
            dok: 2
        },
        {
            text: "State laws enforcing strict racial [BLANK_0] in the South were known as [BLANK_1] Crow laws.",
            blanks: ["segregation", "Jim"],
            wordBank: ["segregation", "integration", "Jim", "Black", "Code"],
            hint: "Named after a minstrel show character.",
            dok: 2
        },
        {
            text: "The Supreme Court case [BLANK_0] v. Ferguson established the doctrine of 'separate but [BLANK_1]'.",
            blanks: ["Plessy", "equal"],
            wordBank: ["Plessy", "Brown", "equal", "free", "fair"],
            hint: "Involved a man arrested on a train.",
            dok: 2
        }
    ],
    unit2: [
        {
            text: "The [BLANK_0] Age was a period of extreme wealth for a few and deep [BLANK_1] for many.",
            blanks: ["Gilded", "poverty"],
            wordBank: ["Gilded", "Progressive", "poverty", "equality", "corruption"],
            hint: "Coined by Mark Twain.",
            dok: 2
        },
        {
            text: "Investigative journalists who exposed corruption were called [BLANK_0], such as Upton Sinclair who wrote 'The [BLANK_1]'.",
            blanks: ["muckrakers", "Jungle"],
            wordBank: ["muckrakers", "yellow journalists", "Jungle", "Octopus", "History"],
            hint: "They raked through the dirt of society.",
            dok: 2
        },
        {
            text: "John D. [BLANK_0] dominated the American oil industry with his company, [BLANK_1] Oil.",
            blanks: ["Rockefeller", "Standard"],
            wordBank: ["Rockefeller", "Carnegie", "Standard", "Gulf", "Imperial"],
            hint: "He became extremely wealthy.",
            dok: 1
        },
        {
            text: "The majority of European immigrants arrived and were processed at [BLANK_0] Island in New [BLANK_1].",
            blanks: ["Ellis", "York"],
            wordBank: ["Ellis", "Angel", "York", "Jersey", "Boston"],
            hint: "Near the Statue of Liberty.",
            dok: 1
        },
        {
            text: "Henry Ford perfected the assembly [BLANK_0] to lower the costs of manufacturing [BLANK_1].",
            blanks: ["line", "cars"],
            wordBank: ["line", "plant", "cars", "steel", "trains"],
            hint: "Workers stayed in one place.",
            dok: 2
        }
    ],
    unit3: [
        {
            text: "The policy of powerful countries seeking to control weaker ones is called [BLANK_0], which the U.S. pursued by acquiring [BLANK_1].",
            blanks: ["imperialism", "territories"],
            wordBank: ["imperialism", "isolationism", "territories", "allies", "states"],
            hint: "Like Hawaii and the Philippines.",
            dok: 2
        },
        {
            text: "The mysterious explosion of the USS [BLANK_0] helped spark the [BLANK_1]-American War.",
            blanks: ["Maine", "Spanish"],
            wordBank: ["Maine", "Lusitania", "Spanish", "Mexican", "British"],
            hint: "'Remember the ___!'",
            dok: 1
        },
        {
            text: "The engineering marvel that connected the Atlantic and Pacific oceans is the [BLANK_0] [BLANK_1].",
            blanks: ["Panama", "Canal"],
            wordBank: ["Panama", "Suez", "Canal", "Strait", "River"],
            hint: "Pushed by Teddy Roosevelt.",
            dok: 1
        },
        {
            text: "World War I combat on the Western Front was characterized by [BLANK_0] warfare and 'No Man's [BLANK_1]'.",
            blanks: ["trench", "Land"],
            wordBank: ["trench", "guerilla", "Land", "Zone", "Area"],
            hint: "Deep ditches and stalemates.",
            dok: 2
        },
        {
            text: "The [BLANK_0] Telegram proposed an alliance between Germany and [BLANK_1] against the U.S.",
            blanks: ["Zimmerman", "Mexico"],
            wordBank: ["Zimmerman", "Lusitania", "Mexico", "Spain", "Japan"],
            hint: "Intercepted by the British.",
            dok: 2
        }
    ],
    unit4: [
        {
            text: "The Stock Market Crash of [BLANK_0] signaled the start of the Great [BLANK_1].",
            blanks: ["1929", "Depression"],
            wordBank: ["1929", "1914", "Depression", "Recession", "War"],
            hint: "Billions disappeared in days.",
            dok: 1
        },
        {
            text: "The severe environmental disaster on the Great Plains in the 1930s was the [BLANK_0] [BLANK_1].",
            blanks: ["Dust", "Bowl"],
            wordBank: ["Dust", "Dirt", "Bowl", "Storm", "Drought"],
            hint: "Forced 'Okies' to migrate.",
            dok: 1
        },
        {
            text: "Franklin D. Roosevelt promised Americans a '[BLANK_0] [BLANK_1]' to fix the economy.",
            blanks: ["New", "Deal"],
            wordBank: ["New", "Square", "Deal", "Plan", "Era"],
            hint: "Included programs like the WPA and CCC.",
            dok: 2
        },
        {
            text: "The [BLANK_0] Security Act provided a safety net, specifically pensions for the [BLANK_1].",
            blanks: ["Social", "elderly"],
            wordBank: ["Social", "National", "elderly", "youth", "farmers"],
            hint: "Still exists today.",
            dok: 2
        },
        {
            text: "The period in the 1920s when alcohol was illegal was known as [BLANK_0], leading to the rise of organized [BLANK_1].",
            blanks: ["Prohibition", "crime"],
            wordBank: ["Prohibition", "Temperance", "crime", "speakeasies", "gangs"],
            hint: "The 18th Amendment.",
            dok: 2
        }
    ],
    unit5: [
        {
            text: "The United States entered WWII after the attack on [BLANK_0] [BLANK_1].",
            blanks: ["Pearl", "Harbor"],
            wordBank: ["Pearl", "Midway", "Harbor", "Island", "Base"],
            hint: "A date which will live in infamy.",
            dok: 1
        },
        {
            text: "The alliance of Germany, Italy, and Japan during WWII was known as the [BLANK_0] [BLANK_1].",
            blanks: ["Axis", "Powers"],
            wordBank: ["Axis", "Allied", "Powers", "Forces", "Nations"],
            hint: "They were the enemies of the U.S.",
            dok: 2
        },
        {
            text: "The massive Allied invasion of Normandy, France on June 6, 1944, is known as [BLANK_0]-[BLANK_1].",
            blanks: ["D", "Day"],
            wordBank: ["D", "V", "Day", "E", "Invasion"],
            hint: "Opened a crucial second front.",
            dok: 1
        },
        {
            text: "The top-secret U.S. program to develop the atomic bomb was the [BLANK_0] [BLANK_1].",
            blanks: ["Manhattan", "Project"],
            wordBank: ["Manhattan", "Apollo", "Project", "Experiment", "Plan"],
            hint: "Led by Oppenheimer.",
            dok: 2
        },
        {
            text: "The horrific genocide of six million Jewish people by the Nazi regime is known as the [BLANK_0], the execution of Hitler's 'Final [BLANK_1]'.",
            blanks: ["Holocaust", "Solution"],
            wordBank: ["Holocaust", "Internment", "Solution", "Plan", "Order"],
            hint: "A systematic mass murder.",
            dok: 2
        }
    ]
};

function insertIntoFile(filePath, fillBlankObj) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const insertPoint = fileContent.lastIndexOf('}');

    let toInsert = ',\n    FILL_BLANK: ' + JSON.stringify(fillBlankObj, null, 4);

    const newContent = fileContent.slice(0, insertPoint) + toInsert + fileContent.slice(insertPoint);
    fs.writeFileSync(filePath, newContent, 'utf-8');
}

insertIntoFile('GameQuestions6th.js', fillBlank6th);
insertIntoFile('GameQuestions7th.js', fillBlank7th);
insertIntoFile('GameQuestions8th.js', fillBlank8th);
console.log("Updated GameQuestions files with FILL_BLANK data.");
module.exports = { fillBlank6th, fillBlank7th, fillBlank8th };
