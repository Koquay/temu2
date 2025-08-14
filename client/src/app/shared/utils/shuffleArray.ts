export function shuffleArray(array: any[]) {
    // Create a shallow copy to avoid modifying the original array
    const shuffledArray = [...array];

    // Loop backwards through the array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i (inclusive)
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements at i and j
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
}