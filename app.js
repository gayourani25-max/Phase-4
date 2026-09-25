

const API_KEY = "const API_KEY "

const MODEL = "gemini-2.5-flash";

const API_URL =
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;



const askInput = document.getElementById("askInput");
const askBtn = document.getElementById("askBtn");
const askLoading = document.getElementById("askLoading");
const askOutput = document.getElementById("askOutput");


const summaryInput =
    document.getElementById("summaryInput");

const summaryBtn =
    document.getElementById("summaryBtn");

const summaryLoading =
    document.getElementById("summaryLoading");

const summaryOutput =
    document.getElementById("summaryOutput");


const ideaInput =
    document.getElementById("ideaInput");

const ideaBtn =
    document.getElementById("ideaBtn");

const ideaLoading =
    document.getElementById("ideaLoading");

const ideaOutput =
    document.getElementById("ideaOutput");


const definitionInput =
    document.getElementById("definitionInput");

const definitionBtn =
    document.getElementById("definitionBtn");

const definitionLoading =
    document.getElementById("definitionLoading");

const definitionOutput =
    document.getElementById("definitionOutput");



const combinePrompts = (...prompts) => {

    return prompts
        .filter(Boolean)
        .join("\n\n");

};


const createRequestParts = (...texts) => {

    const parts = texts.map(text => ({
        text: text
    }));

    return [
        ...parts
    ];

};


const createPrompt = (instruction, userInput) => {

    return `
${instruction}

User Input:
${userInput}

Give a clear, useful and beginner-friendly response.
`;

};

const askGemini = async (prompt) => {

    const response = await fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",

            "x-goog-api-key": API_KEY
        },

        body: JSON.stringify({

            contents: [
                {
                    role: "user",

                    parts: createRequestParts(
                        prompt
                    )
                }
            ]

        })

    });



    const data = await response.json();


    // Check API error

    if (!response.ok) {

        const {
            error: {
                message = "Gemini API request failed."
            } = {}
        } = data;

        throw new Error(message);
    }


    const {
        candidates = []
    } = data;


    const [
        {
            content: {
                parts = []
            } = {}
        } = {}
    ] = candidates;


    const validParts = parts.filter(
        part => part.text
    );

    const textParts = validParts.map(
        part => part.text
    );


    const finalText = textParts.reduce(
        (total, current) => {

            return `${total} ${current}`;

        },
        ""
    );


    if (!finalText.trim()) {

        throw new Error(
            "Gemini returned an empty response."
        );
    }


    return finalText.trim();

};


const setLoading = (
    button,
    loadingElement,
    isLoading,
    message = ""
) => {

    button.disabled = isLoading;

    loadingElement.textContent =
        isLoading ? message : "";

};



const handleAsk = async () => {

    const question =
        askInput.value.trim();



    if (!question) {

        askOutput.textContent =
            "Please enter a question.";

        return;
    }


    setLoading(
        askBtn,
        askLoading,
        true,
        "Thinking..."
    );


    askOutput.textContent = "";


    try {


        const prompt = createPrompt(
            "Answer this question:",
            question
        );


        const result =
            await askGemini(prompt);


        askOutput.textContent =
            result;

    } catch (error) {

        askOutput.textContent =
            `Error: ${error.message}`;

        console.error(error);

    } finally {

        setLoading(
            askBtn,
            askLoading,
            false
        );

    }

};


const handleSummary = async () => {

    const text =
        summaryInput.value.trim();


    if (!text) {

        summaryOutput.textContent =
            "Please paste some text.";

        return;
    }


    setLoading(
        summaryBtn,
        summaryLoading,
        true,
        "Summarizing..."
    );


    summaryOutput.textContent = "";


    try {

        const prompt =
            createPrompt(
                "Summarize this text in 3 to 5 simple points:",
                text
            );


        const result =
            await askGemini(prompt);


        summaryOutput.textContent =
            result;

    } catch (error) {

        summaryOutput.textContent =
            `Error: ${error.message}`;

        console.error(error);

    } finally {

        setLoading(
            summaryBtn,
            summaryLoading,
            false
        );

    }

};


const handleIdeas = async () => {

    const topic =
        ideaInput.value.trim();


    if (!topic) {

        ideaOutput.textContent =
            "Please enter a topic.";

        return;
    }


    setLoading(
        ideaBtn,
        ideaLoading,
        true,
        "Generating ideas..."
    );


    ideaOutput.textContent = "";


    try {

        const prompt =
            combinePrompts(

                "Generate 5 creative ideas about:",
                topic,

                "Keep each idea short and practical."

            );


        const result =
            await askGemini(prompt);


        ideaOutput.textContent =
            result;

    } catch (error) {

        ideaOutput.textContent =
            `Error: ${error.message}`;

        console.error(error);

    } finally {

        setLoading(
            ideaBtn,
            ideaLoading,
            false
        );

    }

};


const handleDefinition = async () => {

    const term =
        definitionInput.value.trim();


    if (!term) {

        definitionOutput.textContent =
            "Please enter a term.";

        return;
    }


    setLoading(
        definitionBtn,
        definitionLoading,
        true,
        "Finding definition..."
    );


    definitionOutput.textContent = "";


    try {

        const prompt =
            createPrompt(

                "Define this term and explain it with a simple real-life example:",

                term

            );


        const result =
            await askGemini(prompt);


        definitionOutput.textContent =
            result;

    } catch (error) {

        definitionOutput.textContent =
            `Error: ${error.message}`;

        console.error(error);

    } finally {

        setLoading(
            definitionBtn,
            definitionLoading,
            false
        );

    }

};


askBtn.addEventListener(
    "click",
    handleAsk
);


summaryBtn.addEventListener(
    "click",
    handleSummary
);


ideaBtn.addEventListener(
    "click",
    handleIdeas
);


definitionBtn.addEventListener(
    "click",
    handleDefinition
);