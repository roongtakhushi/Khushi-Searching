// DOM Elements
const arrayContainer = document.getElementById('array-container');
const arraySizeInput = document.getElementById('array-size');
const arrayElementsInput = document.getElementById('array-elements');
const searchValueInput = document.getElementById('search-value');
const algorithmSelect = document.getElementById('algorithm');
const generateArrayBtn = document.getElementById('generate-array');
const resetArrayBtn = document.getElementById('reset-array');
const startSearchBtn = document.getElementById('start-search');
const resetBtn = document.getElementById('reset');
const comparisonsEl = document.getElementById('comparisons');
const timeEl = document.getElementById('time');
const positionEl = document.getElementById('position');
const statusEl = document.getElementById('status');
const logEntriesEl = document.getElementById('log-entries');
const speedControl = document.getElementById('speed');
const speedValue = document.getElementById('speed-value');
const algorithmCards = document.querySelectorAll('.algorithm');
const floatingElementsContainer = document.getElementById('floating-elements');

// Create floating elements
for (let i = 0; i < 15; i++) {
    const element = document.createElement('div');
    element.className = 'floating-element';
    element.style.left = `${Math.random() * 100}%`;
    element.style.top = `${Math.random() * 100}%`;
    element.style.width = `${20 + Math.random() * 40}px`;
    element.style.height = element.style.width;
    element.style.background = `rgba(${108 + Math.random() * 50}, ${99 + Math.random() * 50}, ${255}, ${0.05 + Math.random() * 0.1})`;
    element.style.animationDuration = `${15 + Math.random() * 20}s`;
    element.style.animationDelay = `${Math.random() * 5}s`;
    floatingElementsContainer.appendChild(element);
}

// Global variables
let array = [];
let isSearching = false;
let speed = 500; // Animation speed in ms

// Update speed display
speedControl.addEventListener('input', () => {
    speed = parseInt(speedControl.value);
    speedValue.textContent = `${speed}ms`;
});

// Algorithm card selection
algorithmCards.forEach(card => {
    card.addEventListener('click', () => {
        algorithmCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        algorithmSelect.value = card.dataset.algo;
    });
});

// Initialize with a sample array
function initializeArray() {
    const size = parseInt(arraySizeInput.value);
    
    // Clear previous array
    array = [];
    
    if (arrayElementsInput.value.trim() !== '') {
        // Use user-provided elements
        const elements = arrayElementsInput.value.split(',').map(el => parseInt(el.trim())).filter(el => !isNaN(el));
        if (elements.length > 0) {
            // Use exactly the elements provided, no filling with random numbers
            array = elements.slice(0, size);
        } else {
            generateRandomArray(size);
        }
    } else {
        generateRandomArray(size);
    }
    renderArray();
    addLogEntry("Array initialized with " + array.length + " elements");
}

// Generate random array
function generateRandomArray(size) {
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
}

// Reset array to initial state
function resetArray() {
    initializeArray();
    resetVisualization();
    addLogEntry("Array has been reset");
}

// Reset everything - control panel inputs and visualization
function resetEverything() {
    // Reset all input fields to default values
    arraySizeInput.value = 10;
    arrayElementsInput.value = '';
    searchValueInput.value = '';
    algorithmSelect.value = 'linear';
    speedControl.value = 500;
    speedValue.textContent = '500ms';
    
    // Reset algorithm cards
    algorithmCards.forEach(card => card.classList.remove('active'));
    algorithmCards[0].classList.add('active');
    
    // Reset array and visualization
    resetArray();
    addLogEntry("All inputs and visualization have been reset");
}

// Render array visually
function renderArray() {
    arrayContainer.innerHTML = '';
    array.forEach((value, index) => {
        const element = document.createElement('div');
        element.className = 'array-element';
        element.textContent = value;
        
        const indexLabel = document.createElement('div');
        indexLabel.className = 'index';
        indexLabel.textContent = `[${index}]`;
        element.appendChild(indexLabel);
        
        arrayContainer.appendChild(element);
    });
}

// Update element visual state
function updateElement(index, className) {
    const elements = document.querySelectorAll('.array-element');
    
    if (index >= 0 && index < elements.length) {
        elements.forEach(el => el.classList.remove('current', 'visited', 'found'));
        elements[index].classList.add(className);
    }
}

// Add multiple elements to visited
function updateMultipleElements(indices, className) {
    const elements = document.querySelectorAll('.array-element');
    indices.forEach(index => {
        if (index >= 0 && index < elements.length) {
            elements[index].classList.add(className);
        }
    });
}

// Add log entry
function addLogEntry(message) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `> ${message}`;
    logEntriesEl.appendChild(entry);
    logEntriesEl.scrollTop = logEntriesEl.scrollHeight;
}

// Reset visualization
function resetVisualization() {
    isSearching = false;
    const elements = document.querySelectorAll('.array-element');
    elements.forEach(el => el.classList.remove('current', 'visited', 'found'));
    comparisonsEl.textContent = '0';
    timeEl.textContent = '0 ms';
    positionEl.textContent = '-';
    statusEl.textContent = 'Idle';
    logEntriesEl.innerHTML = '';
    startSearchBtn.disabled = false;
    addLogEntry("Visualization reset");
}

// Linear Search
async function linearSearch(target) {
    resetVisualization();
    isSearching = true;
    statusEl.textContent = 'Searching...';
    startSearchBtn.disabled = true;
    
    let comparisons = 0;
    const startTime = performance.now();
    addLogEntry(`Starting Linear Search for value: ${target}`);
    
    for (let i = 0; i < array.length; i++) {
        if (!isSearching) break;
        
        updateElement(i, 'current');
        comparisons++;
        comparisonsEl.textContent = comparisons;
        
        addLogEntry(`Checking index ${i}: ${array[i]}`);
        
        await new Promise(resolve => setTimeout(resolve, speed));
        
        if (array[i] === target) {
            updateElement(i, 'found');
            const endTime = performance.now();
            timeEl.textContent = `${(endTime - startTime).toFixed(2)} ms`;
            positionEl.textContent = i;
            statusEl.textContent = 'Found';
            addLogEntry(`✓ Target ${target} found at index ${i}`);
            isSearching = false;
            startSearchBtn.disabled = false;
            return i;
        }
        
        updateElement(i, 'visited');
    }
    
    const endTime = performance.now();
    timeEl.textContent = `${(endTime - startTime).toFixed(2)} ms`;
    positionEl.textContent = 'Not found';
    statusEl.textContent = 'Not found';
    addLogEntry(`✗ Target ${target} not found in the array`);
    isSearching = false;
    startSearchBtn.disabled = false;
    return -1;
}

// Binary Search (requires sorted array)
async function binarySearch(target) {
    resetVisualization();
    isSearching = true;
    statusEl.textContent = 'Searching...';
    startSearchBtn.disabled = true;
    
    // Sort the array for binary search
    const sortedArray = [...array].sort((a, b) => a - b);
    array = sortedArray;
    renderArray();
    addLogEntry("Array sorted for binary search");
    addLogEntry(`Starting Binary Search for value: ${target}`);
    
    let comparisons = 0;
    const startTime = performance.now();
    
    let left = 0;
    let right = array.length - 1;
    
    while (left <= right) {
        if (!isSearching) break;
        
        const mid = Math.floor((left + right) / 2);
        updateElement(mid, 'current');
        comparisons++;
        comparisonsEl.textContent = comparisons;
        
        addLogEntry(`Checking index ${mid}: ${array[mid]}`);
        
        await new Promise(resolve => setTimeout(resolve, speed));
        
        if (array[mid] === target) {
            updateElement(mid, 'found');
            const endTime = performance.now();
            timeEl.textContent = `${(endTime - startTime).toFixed(2)} ms`;
            positionEl.textContent = mid;
            statusEl.textContent = 'Found';
            addLogEntry(`✓ Target ${target} found at index ${mid}`);
            isSearching = false;
            startSearchBtn.disabled = false;
            return mid;
        } else if (array[mid] < target) {
            // Highlight the left portion as visited
            const visitedIndices = [];
            for (let i = left; i <= mid; i++) {
                visitedIndices.push(i);
            }
            updateMultipleElements(visitedIndices, 'visited');
            left = mid + 1;
            addLogEntry(`Target is greater than ${array[mid]}, searching right half`);
        } else {
            // Highlight the right portion as visited
            const visitedIndices = [];
            for (let i = mid; i <= right; i++) {
                visitedIndices.push(i);
            }
            updateMultipleElements(visitedIndices, 'visited');
            right = mid - 1;
            addLogEntry(`Target is less than ${array[mid]}, searching left half`);
        }
    }
    
    const endTime = performance.now();
    timeEl.textContent = `${(endTime - startTime).toFixed(2)} ms`;
    positionEl.textContent = 'Not found';
    statusEl.textContent = 'Not found';
    addLogEntry(`✗ Target ${target} not found in the array`);
    isSearching = false;
    startSearchBtn.disabled = false;
    return -1;
}

// Fibonacci Search (requires sorted array)
async function fibonacciSearch(target) {
    resetVisualization();
    isSearching = true;
    statusEl.textContent = 'Searching...';
    startSearchBtn.disabled = true;
    
    // Sort the array for fibonacci search
    const sortedArray = [...array].sort((a, b) => a - b);
    array = sortedArray;
    renderArray();
    addLogEntry("Array sorted for Fibonacci search");
    addLogEntry(`Starting Fibonacci Search for value: ${target}`);
    
    let comparisons = 0;
    const startTime = performance.now();
    
    // Initialize Fibonacci numbers
    let fib2 = 0; // (n-2)th Fibonacci number
    let fib1 = 1; // (n-1)th Fibonacci number
    let fib = fib1 + fib2; // nth Fibonacci number
    
    // Find the smallest Fibonacci number greater than or equal to array length
    while (fib < array.length) {
        fib2 = fib1;
        fib1 = fib;
        fib = fib1 + fib2;
    }
    
    let offset = -1;
    
    while (fib > 1) {
        if (!isSearching) break;
        
        const i = Math.min(offset + fib2, array.length - 1);
        updateElement(i, 'current');
        comparisons++;
        comparisonsEl.textContent = comparisons;
        
        addLogEntry(`Checking index ${i}: ${array[i]}`);
        
        await new Promise(resolve => setTimeout(resolve, speed));
        
        if (array[i] < target) {
            fib = fib1;
            fib1 = fib2;
            fib2 = fib - fib1;
            offset = i;
            addLogEntry(`Target is greater than ${array[i]}, moving forward`);
        } else if (array[i] > target) {
            fib = fib2;
            fib1 = fib1 - fib2;
            fib2 = fib - fib1;
            addLogEntry(`Target is less than ${array[i]}, moving backward`);
        } else {
            updateElement(i, 'found');
            const endTime = performance.now();
            timeEl.textContent = `${(endTime - startTime).toFixed(2)} ms`;
            positionEl.textContent = i;
            statusEl.textContent = 'Found';
            addLogEntry(`✓ Target ${target} found at index ${i}`);
            isSearching = false;
            startSearchBtn.disabled = false;
            return i;
        }
        
        updateElement(i, 'visited');
    }
    
    // Check last element
    if (fib1 === 1 && array[offset + 1] === target) {
        const i = offset + 1;
        updateElement(i, 'found');
        const endTime = performance.now();
        timeEl.textContent = `${(endTime - startTime).toFixed(2)} ms`;
        positionEl.textContent = i;
        statusEl.textContent = 'Found';
        addLogEntry(`✓ Target ${target} found at index ${i}`);
        isSearching = false;
        startSearchBtn.disabled = false;
        return i;
    }
    
    const endTime = performance.now();
    timeEl.textContent = `${(endTime - startTime).toFixed(2)} ms`;
    positionEl.textContent = 'Not found';
    statusEl.textContent = 'Not found';
    addLogEntry(`✗ Target ${target} not found in the array`);
    isSearching = false;
    startSearchBtn.disabled = false;
    return -1;
}

// Sequential Search (similar to linear but with different visualization)
async function sequentialSearch(target) {
    resetVisualization();
    isSearching = true;
    statusEl.textContent = 'Searching...';
    startSearchBtn.disabled = true;
    addLogEntry(`Starting Sequential Search for value: ${target}`);
    
    let comparisons = 0;
    const startTime = performance.now();
    
    for (let i = 0; i < array.length; i++) {
        if (!isSearching) break;
        
        updateElement(i, 'current');
        comparisons++;
        comparisonsEl.textContent = comparisons;
        
        addLogEntry(`Checking index ${i}: ${array[i]}`);
        
        await new Promise(resolve => setTimeout(resolve, speed));
        
        if (array[i] === target) {
            updateElement(i, 'found');
            const endTime = performance.now();
            timeEl.textContent = `${(endTime - startTime).toFixed(2)} ms`;
            positionEl.textContent = i;
            statusEl.textContent = 'Found';
            addLogEntry(`✓ Target ${target} found at index ${i}`);
            isSearching = false;
            startSearchBtn.disabled = false;
            return i;
        }
        
        updateElement(i, 'visited');
    }
    
    const endTime = performance.now();
    timeEl.textContent = `${(endTime - startTime).toFixed(2)} ms`;
    positionEl.textContent = 'Not found';
    statusEl.textContent = 'Not found';
    addLogEntry(`✗ Target ${target} not found in the array`);
    isSearching = false;
    startSearchBtn.disabled = false;
    return -1;
}

// Event Listeners
generateArrayBtn.addEventListener('click', initializeArray);
resetArrayBtn.addEventListener('click', resetArray);
resetBtn.addEventListener('click', resetEverything);

startSearchBtn.addEventListener('click', () => {
    const target = parseInt(searchValueInput.value);
    if (isNaN(target)) {
        alert('Please enter a valid number to search');
        return;
    }
    
    if (array.length === 0) {
        alert('Please generate an array first');
        return;
    }
    
    const algorithm = algorithmSelect.value;
    
    switch (algorithm) {
        case 'linear':
            linearSearch(target);
            break;
        case 'binary':
            binarySearch(target);
            break;
        case 'fibonacci':
            fibonacciSearch(target);
            break;
        case 'sequential':
            sequentialSearch(target);
            break;
    }
});

// Initialize on page load
window.addEventListener('load', initializeArray);