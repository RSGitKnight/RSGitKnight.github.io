/**
 * Text Analyzer Tool
 * @author Rishith Sunil
 * 
 * This script analyzes text for:
 * - Basic statistics (letters, words, spaces, newlines, special symbols)
 * - Pronoun usage with counts
 * - Preposition usage with counts
 * - Indefinite article usage with counts
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleBtn = document.getElementById('sample-btn');
    
    // Stats elements
    const letterCount = document.getElementById('letter-count');
    const wordCount = document.getElementById('word-count');
    const spaceCount = document.getElementById('space-count');
    const newlineCount = document.getElementById('newline-count');
    const specialCount = document.getElementById('special-count');
    
    // Result containers
    const pronounResults = document.getElementById('pronoun-results');
    const prepositionResults = document.getElementById('preposition-results');
    const articleResults = document.getElementById('article-results');
    
    // Define linguistic data
    const pronouns = {
        'personal': ['i', 'me', 'my', 'mine', 'myself', 'you', 'your', 'yours', 'yourself', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'we', 'us', 'our', 'ours', 'ourselves', 'yourselves', 'they', 'them', 'their', 'theirs', 'themselves'],
        'possessive': ['my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs'],
        'demonstrative': ['this', 'that', 'these', 'those'],
        'interrogative': ['who', 'whom', 'whose', 'which', 'what'],
        'relative': ['who', 'whom', 'whose', 'which', 'that'],
        'indefinite': ['anybody', 'anyone', 'anything', 'each', 'either', 'everybody', 'everyone', 'everything', 'neither', 'nobody', 'no one', 'nothing', 'one', 'somebody', 'someone', 'something', 'both', 'few', 'many', 'several', 'all', 'any', 'most', 'none', 'some']
    };
    
    const prepositions = [
        'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 'around', 'at', 'before', 'behind', 
        'below', 'beneath', 'beside', 'between', 'beyond', 'by', 'concerning', 'considering', 'despite', 'down', 
        'during', 'except', 'for', 'from', 'in', 'inside', 'into', 'like', 'near', 'of', 'off', 'on', 'onto', 
        'out', 'outside', 'over', 'past', 'regarding', 'round', 'since', 'through', 'throughout', 'to', 'toward', 
        'towards', 'under', 'underneath', 'until', 'unto', 'up', 'upon', 'with', 'within', 'without'
    ];
    
    const indefiniteArticles = ['a', 'an'];
    
    // Event listeners
    analyzeBtn.addEventListener('click', analyzeText);
    clearBtn.addEventListener('click', clearAll);
    sampleBtn.addEventListener('click', loadSampleText);
    
    /**
     * Main function to analyze the text
     */
    function analyzeText() {
        const text = textInput.value;
        
        if (!text.trim()) {
            alert('Please enter some text to analyze.');
            return;
        }
        
        // Calculate basic stats
        calculateBasicStats(text);
        
        // Tokenize and analyze text
        const tokens = tokenizeText(text);
        
        // Analyze pronouns
        analyzeTokens(tokens, pronouns, pronounResults, true);
        
        // Analyze prepositions
        const prepositionCounts = countTokens(tokens, prepositions);
        displayTokenCounts(prepositionCounts, prepositionResults);
        
        // Analyze indefinite articles
        const articleCounts = countTokens(tokens, indefiniteArticles);
        displayTokenCounts(articleCounts, articleResults);
    }
    
    /**
     * Calculate basic text statistics
     */
    function calculateBasicStats(text) {
        // Count letters (alphanumeric characters)
        const letters = text.match(/[a-zA-Z0-9]/g) || [];
        letterCount.textContent = letters.length;
        
        // Count words
        const words = text.match(/\b\w+\b/g) || [];
        wordCount.textContent = words.length;
        
        // Count spaces
        const spaces = text.match(/\s/g) || [];
        spaceCount.textContent = spaces.length;
        
        // Count newlines
        const newlines = text.match(/\n/g) || [];
        newlineCount.textContent = newlines.length;
        
        // Count special symbols (non-alphanumeric, non-space characters)
        const specials = text.match(/[^\w\s]/g) || [];
        specialCount.textContent = specials.length;
    }
    
    /**
     * Tokenize text into words
     */
    function tokenizeText(text) {
        // Convert to lowercase and remove punctuation
        const cleanText = text.toLowerCase().replace(/[^\w\s]|_/g, ' ');
        
        // Split by whitespace and filter out empty strings
        return cleanText.split(/\s+/).filter(token => token.length > 0);
    }
    
    /**
     * Count tokens by category
     */
    function countTokens(tokens, tokenList) {
        const counts = {};
        
        tokens.forEach(token => {
            if (tokenList.includes(token)) {
                counts[token] = (counts[token] || 0) + 1;
            }
        });
        
        return counts;
    }
    
    /**
     * Analyze tokens by groups (for pronouns)
     */
    function analyzeTokens(tokens, tokenGroups, resultContainer, isGrouped) {
        if (isGrouped) {
            // For grouped analysis (like pronouns)
            const results = {};
            
            // Initialize all groups
            for (const group in tokenGroups) {
                results[group] = {};
            }
            
            // Count occurrences
            tokens.forEach(token => {
                for (const group in tokenGroups) {
                    if (tokenGroups[group].includes(token)) {
                        results[group][token] = (results[group][token] || 0) + 1;
                    }
                }
            });
            
            displayGroupedTokenCounts(results, resultContainer);
        } else {
            // For simple list analysis
            const counts = countTokens(tokens, tokenGroups);
            displayTokenCounts(counts, resultContainer);
        }
    }
    
    /**
     * Display token counts in the result container
     */
    function displayTokenCounts(counts, container) {
        // Sort by count (descending)
        const sortedTokens = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
        
        if (sortedTokens.length === 0) {
            container.innerHTML = '<p>No matches found in the text.</p>';
            return;
        }
        
        let html = '<div class="token-grid">';
        
        sortedTokens.forEach(token => {
            html += `
                <div class="token-item">
                    <span class="token-name">${token}</span>
                    <span class="token-count">${counts[token]}</span>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    /**
     * Display grouped token counts (for pronouns)
     */
    function displayGroupedTokenCounts(groupedCounts, container) {
        let hasAnyResults = false;
        let html = '';
        
        for (const group in groupedCounts) {
            const counts = groupedCounts[group];
            const tokens = Object.keys(counts);
            
            if (tokens.length > 0) {
                hasAnyResults = true;
                
                html += `
                    <div class="token-group">
                        <h4>${capitalizeFirstLetter(group)} Pronouns</h4>
                        <div class="token-grid">
                `;
                
                // Sort by count (descending)
                tokens.sort((a, b) => counts[b] - counts[a]);
                
                tokens.forEach(token => {
                    html += `
                        <div class="token-item">
                            <span class="token-name">${token}</span>
                            <span class="token-count">${counts[token]}</span>
                        </div>
                    `;
                });
                
                html += '</div></div>';
            }
        }
        
        if (!hasAnyResults) {
            container.innerHTML = '<p>No pronouns found in the text.</p>';
        } else {
            container.innerHTML = html;
        }
    }
    
    /**
     * Helper function to capitalize the first letter of a string
     */
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    /**
     * Clear all fields and results
     */
    function clearAll() {
        textInput.value = '';
        
        // Reset statistics
        letterCount.textContent = '0';
        wordCount.textContent = '0';
        spaceCount.textContent = '0';
        newlineCount.textContent = '0';
        specialCount.textContent = '0';
        
        // Reset result containers
        pronounResults.innerHTML = '<p>No data to display. Please analyze a text.</p>';
        prepositionResults.innerHTML = '<p>No data to display. Please analyze a text.</p>';
        articleResults.innerHTML = '<p>No data to display. Please analyze a text.</p>';
    }
    
    /**
     * Load sample text for analysis
     */
    function loadSampleText() {
        textInput.value = `The Importance of Natural Language Processing

Natural Language Processing (NLP) is a field of artificial intelligence that focuses on the interaction between computers and humans using natural language. The ultimate objective of NLP is to read, decipher, understand, and make sense of human languages in a valuable way.

Despite being a relatively new field, NLP has seen tremendous growth in recent years. From voice assistants like Siri and Alexa to grammar checking software like Grammarly, NLP applications have become an integral part of our daily lives.

One of the fundamental aspects of NLP is tokenization - the process of breaking down text into smaller units called tokens. These tokens can be words, characters, or subwords. This allows computers to understand the structure of sentences and the meaning behind them.

Part-of-speech tagging is another crucial task in NLP. It involves identifying whether a word is a noun, verb, adjective, or another part of speech. This helps in understanding the grammatical structure of sentences.

Consider the sentence: "The cat sat on the mat." Here, "The" and "the" are articles, "cat" and "mat" are nouns, "sat" is a verb, and "on" is a preposition. By analyzing these components, computers can begin to understand the meaning behind the sentence.

Pronouns like "he," "she," "it," "they," and "we" are particularly interesting in NLP because they often refer to entities mentioned earlier in the text. Resolving these references, a task known as anaphora resolution, is crucial for understanding the context of a conversation.

Prepositions such as "in," "on," "at," "by," and "with" indicate relationships between elements in a sentence. They provide spatial, temporal, or logical relationships, adding depth to the meaning of a text.

Articles like "a," "an," and "the" might seem insignificant, but they provide important contextual cues. "The" indicates a specific entity that the speaker assumes the listener is familiar with, while "a" and "an" introduce new entities.

As AI continues to evolve, the ability to process and understand natural language becomes increasingly important. Whether it's for translating languages, summarizing texts, or answering questions, NLP is at the forefront of making human-computer interaction more intuitive and efficient.

In conclusion, NLP is not just about understanding words in isolation, but about comprehending the intricate dance of language, with all its nuances, contexts, and implications. As we continue to refine our algorithms and approaches, the dream of having machines truly understand human language draws ever closer.`;
    }
});