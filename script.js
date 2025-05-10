// Debug function to log messages
function debug(message, level = 'info', error = null) {
    const timestamp = new Date().toLocaleTimeString();
    
    // If level is set to error, log the error object as well
    if (level === 'error' && error) {
        console.error(`[${timestamp}] ${message}:`, error);
    } else if (level === 'warn') {
        console.warn(`[${timestamp}] ${message}`);
    } else {
        console.log(`[${timestamp}] ${message}`);
    }
    
    return true;
}

// DOM Elements - Core
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const usageProgressBar = document.getElementById('usage-progress');
const pcTimeElement = document.getElementById('pc-time');
const pcProgressBar = document.getElementById('pc-progress');
const phoneTimeElement = document.getElementById('phone-time');
const phoneProgressBar = document.getElementById('phone-progress');
const pcLimitInput = document.getElementById('pc-limit');
const phoneLimitInput = document.getElementById('phone-limit');
const saveLimitsButton = document.getElementById('save-limits');
const deviceSelect = document.getElementById('device-select');
const hoursInput = document.getElementById('hours-input');
const minutesInput = document.getElementById('minutes-input');
const logTimeButton = document.getElementById('log-time');

// DOM Elements - Smart Time Limits
const appSelect = document.getElementById('app-select');
const customAppInput = document.getElementById('custom-app');
const appLimitInput = document.getElementById('app-limit');
const reminderFrequencySelect = document.getElementById('reminder-frequency');
const addAppLimitButton = document.getElementById('add-app-limit');
const appLimitsContainer = document.getElementById('app-limits-container');

// DOM Elements - AI-Powered Breaks
const breakActivityElement = document.getElementById('break-activity');
const nextBreakButton = document.getElementById('next-break');
const startBreakButton = document.getElementById('start-break');
const prefPhysical = document.getElementById('pref-physical');
const prefMental = document.getElementById('pref-mental');
const prefCreative = document.getElementById('pref-creative');
const prefSocial = document.getElementById('pref-social');

// DOM Elements - Focus Mode
const focusTimerDisplay = document.getElementById('focus-timer-display');
const startFocusButton = document.getElementById('start-focus');
const pauseFocusButton = document.getElementById('pause-focus');
const stopFocusButton = document.getElementById('stop-focus');
const focusDurationSelect = document.getElementById('focus-duration');
const customDurationInput = document.getElementById('custom-duration');
const blockSocialCheckbox = document.getElementById('block-social');
const blockEntertainmentCheckbox = document.getElementById('block-entertainment');
const blockNewsCheckbox = document.getElementById('block-news');
const blockCustomCheckbox = document.getElementById('block-custom');
const customBlocksTextarea = document.getElementById('custom-blocks');

// DOM Elements - Insights
const trendChartElement = document.getElementById('trend-chart');
const dailyInsightElement = document.getElementById('daily-insight');
const personalizedTipsElement = document.getElementById('personalized-tips');

// Default values for core functionality
let screenTimeData = {
    pc: {
        timeInMinutes: 0,
        limitInHours: 3
    },
    phone: {
        timeInMinutes: 0,
        limitInHours: 2
    },
    // New properties for added features
    appLimits: [],
    breakPreferences: {
        physical: true,
        mental: true,
        creative: true,
        social: true
    },
    focusHistory: [],
    dailyHistory: [],
    challenges: [
        {
            id: 1,
            name: 'Digital Detox Weekend',
            description: 'Reduce your weekend screen time by 50% compared to last weekend.',
            progress: 35,
            active: true
        },
        {
            id: 2,
            name: 'Focus Master',
            description: 'Complete 5 focus sessions of at least 45 minutes this week.',
            progress: 0,
            active: false
        },
        {
            id: 3,
            name: 'Mindful Mornings',
            description: 'Don\'t use your devices during the first hour after waking up for 5 consecutive days.',
            progress: 0,
            active: false
        }
    ],
    achievements: [
        { id: 1, name: 'Screen Time Reducer', description: 'Reduced overall screen time by 20%', unlocked: true },
        { id: 2, name: 'Break Master', description: 'Took 10 mindful breaks', unlocked: true },
        { id: 3, name: 'Focus Champion', description: 'Completed 20 focus sessions', unlocked: true },
        { id: 4, name: 'Digital Sunset', description: 'Complete the evening wind-down challenge', unlocked: false },
        { id: 5, name: 'Weekend Warrior', description: 'Complete the weekend challenge', unlocked: false }
    ],
    connectedDevices: [
        { id: 1, name: 'This PC', type: 'pc', connected: true },
        { id: 2, name: 'iPhone', type: 'phone', connected: false }
    ],
    // New property for website-specific screen time tracking
    websiteUsage: {}
};

// Activity suggestions for AI-powered breaks
const breakSuggestions = {
    physical: [
        "Take a 5-minute walk around your home or office",
        "Do 10 jumping jacks to get your blood flowing",
        "Stretch your arms, legs, and back for 3 minutes",
        "Try 2 minutes of light yoga or simple stretching poses",
        "Stand up and march in place for 1 minute",
        "Do 5 shoulder rolls forward and backward",
        "Try 10 desk push-ups leaning against your desk",
        "Touch your toes 10 times with bent knees if needed",
        "Shake out your limbs for 30 seconds each"
    ],
    mental: [
        "Do a 5-minute mindfulness meditation focusing on your breathing",
        "Close your eyes and count slowly to 50",
        "Try the 4-7-8 breathing technique (inhale for 4, hold for 7, exhale for 8)",
        "Look out a window and focus on something natural for 2 minutes",
        "Listen to a calming song with your eyes closed",
        "Recall a positive memory and reflect on it for 3 minutes",
        "Practice gratitude by listing 5 things you're thankful for",
        "Do a quick word puzzle or sudoku",
        "Try box breathing for 2 minutes"
    ],
    creative: [
        "Doodle or sketch for 5 minutes without judgment",
        "Write a short poem or haiku about your day",
        "Think of 5 alternative uses for a common object",
        "Visualize your perfect vacation spot for 3 minutes",
        "Write down a story idea or creative concept",
        "Try a 2-minute free writing exercise without stopping",
        "Create a simple origami shape with a piece of paper",
        "Think of an invention that would make your life easier",
        "Hum or sing a song you enjoy"
    ],
    social: [
        "Send a message to a friend you haven't talked to recently",
        "Call a family member for a quick chat",
        "Write a thank-you note to someone who helped you",
        "Share an interesting article with a colleague",
        "Plan a future get-together with friends",
        "Post something positive on social media",
        "Write down three qualities you appreciate about someone in your life",
        "Leave a positive comment on someone's work",
        "Think of a small act of kindness you can do today"
    ]
};

// Focus mode timer variables
let focusTimer = null;
let focusDuration = 25 * 60; // Default: 25 minutes in seconds
let focusTimeRemaining = focusDuration;
let focusActive = false;
let focusPaused = false;

// Screen time tracking variables
let activeTrackingEnabled = false;
let activeTrackingTimer = null;
let activeTrackingInterval = 60000; // 1 minute interval
let lastActivity = Date.now();
let screenTimeActive = true;
let windowFocused = true;
let idleTimeout = 3 * 60 * 1000; // 3 minutes in milliseconds

// Chart data and configuration
let usageChartData = {
    labels: [],
    datasets: [
        {
            label: 'Screen Time (minutes)',
            data: [],
            backgroundColor: 'rgba(94, 114, 228, 0.5)',
            borderColor: 'rgba(94, 114, 228, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(94, 114, 228, 1)',
            pointRadius: 4,
            tension: 0.4
        }
    ]
};

let socialMediaChartData = {
    labels: ['Social Media', 'Games', 'Streaming', 'Browsing', 'Productivity'],
    datasets: [
        {
            data: [30, 15, 45, 60, 20],
            backgroundColor: [
                'rgba(94, 114, 228, 0.8)',
                'rgba(45, 206, 137, 0.8)',
                'rgba(251, 99, 64, 0.8)',
                'rgba(87, 182, 196, 0.8)',
                'rgba(17, 205, 239, 0.8)'
            ],
            borderColor: [
                'rgba(94, 114, 228, 1)',
                'rgba(45, 206, 137, 1)',
                'rgba(251, 99, 64, 1)',
                'rgba(87, 182, 196, 1)',
                'rgba(17, 205, 239, 1)'
            ],
            borderWidth: 1
        }
    ]
};

let usageChart = null;
let socialMediaChart = null;

// Create variables for website usage chart
let websiteUsageChart = null;
let websiteUsageChartData = {
    labels: [],
    datasets: [{
        label: 'Minutes Spent',
        data: [],
        backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(199, 199, 199, 0.7)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)'
        ],
        borderWidth: 1
    }]
};

// Current active website tracking
let currentWebsite = '';
let lastWebsiteCheck = null;
let clockAnimationInterval = null;

// Save data to localStorage
function saveData() {
    try {
        debug('Saving data to localStorage');
        
        // Initialize with default data if none exists
        if (!screenTimeData) {
            screenTimeData = {
                totalScreenTime: 0,
                today: {
                    pc: 0,
                    phone: 0
                },
                apps: {},
                focusHistory: [],
                breakHistory: [],
                breakPreferences: {
                    physical: true,
                    mental: true,
                    creative: true,
                    social: true
                },
                challenges: [
                    {
                        id: 1,
                        name: 'Digital Detox Weekend',
                        description: 'Reduce your weekend screen time by 50% compared to last weekend.',
                        progress: 35,
                        active: true
                    },
                    {
                        id: 2,
                        name: 'Focus Master',
                        description: 'Complete 5 focus sessions of at least 45 minutes this week.',
                        progress: 0,
                        active: false
                    },
                    {
                        id: 3,
                        name: 'Mindful Mornings',
                        description: 'Don\'t use your devices during the first hour after waking up for 5 consecutive days.',
                        progress: 0,
                        active: false
                    }
                ],
                pc: {
                    timeInMinutes: 0,
                    limitInHours: 3
                },
                phone: {
                    timeInMinutes: 0,
                    limitInHours: 2
                }
            };
        }
        
        localStorage.setItem('screenTimeData', JSON.stringify(screenTimeData));
        debug('Data saved successfully');
        return true;
    } catch (error) {
        debug('Failed to save data', 'error', error);
        return false;
    }
}

// Load data from localStorage
function loadData() {
    try {
        debug('Loading data from localStorage');
        const savedData = localStorage.getItem('screenTimeData');
        
        if (savedData) {
            screenTimeData = JSON.parse(savedData);
            debug('Data loaded successfully');
            
            // Make sure we have all required structures
            if (!screenTimeData.today) {
                screenTimeData.today = {
                    pc: 0,
                    phone: 0
                };
            }
            
            if (!screenTimeData.pc) {
                screenTimeData.pc = {
                    timeInMinutes: 0,
                    limitInHours: 3
                };
            }
            
            if (!screenTimeData.phone) {
                screenTimeData.phone = {
                    timeInMinutes: 0,
                    limitInHours: 2
                };
            }
            
            if (!screenTimeData.breakPreferences) {
                screenTimeData.breakPreferences = {
                    physical: true,
                    mental: true,
                    creative: true,
                    social: true
                };
            }
            
            // Ensure proper challenge structure
            if (!Array.isArray(screenTimeData.challenges)) {
                debug("Converting challenge data structure", 'warn');
                screenTimeData.challenges = [
                    {
                        id: 1,
                        name: 'Digital Detox Weekend',
                        description: 'Reduce your weekend screen time by 50% compared to last weekend.',
                        progress: 35,
                        active: true
                    },
                    {
                        id: 2,
                        name: 'Focus Master',
                        description: 'Complete 5 focus sessions of at least 45 minutes this week.',
                        progress: 0,
                        active: false
                    },
                    {
                        id: 3,
                        name: 'Mindful Mornings',
                        description: 'Don\'t use your devices during the first hour after waking up for 5 consecutive days.',
                        progress: 0,
                        active: false
                    }
                ];
            }
            
            // Update input fields with saved limits
            if (pcLimitInput) pcLimitInput.value = screenTimeData.pc.limitInHours;
            if (phoneLimitInput) phoneLimitInput.value = screenTimeData.phone.limitInHours;
            
            // Update break preferences
            if (prefPhysical) prefPhysical.checked = screenTimeData.breakPreferences.physical;
            if (prefMental) prefMental.checked = screenTimeData.breakPreferences.mental;
            if (prefCreative) prefCreative.checked = screenTimeData.breakPreferences.creative;
            if (prefSocial) prefSocial.checked = screenTimeData.breakPreferences.social;
        } else {
            debug('No saved data found, initializing with defaults');
            saveData(); // Save default data
        }
        
        return true;
    } catch (error) {
        debug('Error loading saved data', 'error', error);
        saveData(); // Save default data
        return false;
    }
}

// Update the display with current data
function updateDisplay() {
    // Update the total usage display
    updateTodaysUsage();
    
    // Calculate total time
    const totalMinutes = screenTimeData.pc.timeInMinutes + screenTimeData.phone.timeInMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    // Update PC time display
    const pcHours = Math.floor(screenTimeData.pc.timeInMinutes / 60);
    const pcMinutes = screenTimeData.pc.timeInMinutes % 60;
    pcTimeElement.textContent = `${pcHours}h ${pcMinutes}m`;
    
    // Update Phone time display
    const phoneHours = Math.floor(screenTimeData.phone.timeInMinutes / 60);
    const phoneMinutes = screenTimeData.phone.timeInMinutes % 60;
    phoneTimeElement.textContent = `${phoneHours}h ${phoneMinutes}m`;
    
    // Update progress bars
    const pcLimit = screenTimeData.pc.limitInHours * 60;
    const phoneLimit = screenTimeData.phone.limitInHours * 60;
    const totalLimit = pcLimit + phoneLimit;
    
    const pcPercentage = Math.min((screenTimeData.pc.timeInMinutes / pcLimit) * 100, 100);
    const phonePercentage = Math.min((screenTimeData.phone.timeInMinutes / phoneLimit) * 100, 100);
    
    pcProgressBar.style.width = `${pcPercentage}%`;
    phoneProgressBar.style.width = `${phonePercentage}%`;
    
    // Set progress bar colors based on usage
    pcProgressBar.style.backgroundColor = pcPercentage > 90 ? '#dc3545' : '#4a6fa5';
    phoneProgressBar.style.backgroundColor = phonePercentage > 90 ? '#dc3545' : '#4a6fa5';
}

// Save limits
function saveLimits() {
    try {
        debug("Saving daily limits");
        
    screenTimeData.pc.limitInHours = parseInt(pcLimitInput.value) || 3;
    screenTimeData.phone.limitInHours = parseInt(phoneLimitInput.value) || 2;
    
    saveData();
    updateDisplay();
    
    alert('Daily limits saved!');
        debug("Daily limits saved successfully");
    } catch (error) {
        debug("Error saving limits", 'error', error);
        alert('There was an error saving your limits. Please try again.');
    }
}

// Log time spent
function logTime() {
    try {
        const device = deviceSelect ? deviceSelect.value : 'pc';
        const hours = parseInt(hoursInput ? hoursInput.value : 0) || 0;
        const minutes = parseInt(minutesInput ? minutesInput.value : 0) || 0;
        
        debug(`Logging time: ${hours}h ${minutes}m for ${device}`);
    
    if (hours === 0 && minutes === 0) {
            debug("Invalid time input (0h 0m)", 'warn');
        alert('Please enter a valid time.');
        return;
    }
    
    const timeInMinutes = (hours * 60) + minutes;
    screenTimeData[device].timeInMinutes += timeInMinutes;
    
    saveData();
    updateDisplay();
    updateInsights();
    
    // Clear inputs
        if (hoursInput) hoursInput.value = '';
        if (minutesInput) minutesInput.value = '';
        
        debug(`Time logged successfully: ${timeInMinutes} minutes for ${device}`);
    
    // Show alert if limit exceeded
    const deviceLimit = screenTimeData[device].limitInHours * 60;
    if (screenTimeData[device].timeInMinutes > deviceLimit) {
            debug(`Limit exceeded for ${device}`, 'warn');
        alert(`Warning: You've exceeded your ${device.toUpperCase()} screen time limit!`);
    }
    
    // Check for app limits
    checkAppLimits();
    } catch (error) {
        debug("Error logging time", 'error', error);
        alert('There was an error logging your time. Please try again.');
    }
}

// Smart Time Limits Functions

// Toggle custom app input visibility
function toggleCustomAppInput() {
    try {
        console.log('Toggling custom app input');
        const appSelect = document.getElementById('app-select');
        const customAppInput = document.getElementById('custom-app');
        
        if (appSelect && customAppInput) {
            const showCustomInput = appSelect.value === 'custom';
            customAppInput.classList.toggle('hidden', !showCustomInput);
            
            console.log(`Custom app input ${showCustomInput ? 'shown' : 'hidden'}`);
        } else {
            console.error('App select or custom app input element not found');
        }
        
        return true;
    } catch (error) {
        console.error('Error toggling custom app input:', error);
        return false;
    }
}

// Add a new app limit
function addAppLimit() {
    const appName = appSelect.value === 'custom' ? customAppInput.value.trim() : appSelect.options[appSelect.selectedIndex].text;
    const limitMinutes = parseInt(appLimitInput.value) || 60;
    const reminderFrequency = parseInt(reminderFrequencySelect.value) || 30;
    
    if (appSelect.value === 'custom' && !appName) {
        alert('Please enter a custom app name.');
        return;
    }
    
    // Check if app already exists
    const existingAppIndex = screenTimeData.appLimits.findIndex(app => 
        app.name.toLowerCase() === appName.toLowerCase());
    
    if (existingAppIndex >= 0) {
        // Update existing app
        screenTimeData.appLimits[existingAppIndex].limitMinutes = limitMinutes;
        screenTimeData.appLimits[existingAppIndex].reminderFrequency = reminderFrequency;
    } else {
        // Add new app
        const newApp = {
            id: Date.now(), // unique identifier
            name: appName,
            category: appSelect.value,
            limitMinutes: limitMinutes,
            usedMinutes: 0,
            reminderFrequency: reminderFrequency,
            lastReminder: null
        };
        
        screenTimeData.appLimits.push(newApp);
    }
    
    saveData();
    renderAppLimits();
    
    // Reset form
    appSelect.selectedIndex = 0;
    customAppInput.value = '';
    appLimitInput.value = '60';
    reminderFrequencySelect.selectedIndex = 1; // Default to 30 minutes
    customAppInput.classList.add('hidden');
}

// Render app limits in the UI
function renderAppLimits() {
    appLimitsContainer.innerHTML = '';
    
    if (screenTimeData.appLimits.length === 0) {
        appLimitsContainer.innerHTML = '<p>No app limits set. Add your first app limit above.</p>';
        return;
    }
    
    screenTimeData.appLimits.forEach(app => {
        const appLimitItem = document.createElement('div');
        appLimitItem.className = 'app-limit-item';
        
        const usedPercentage = Math.min((app.usedMinutes / app.limitMinutes) * 100, 100);
        const isExceeded = app.usedMinutes >= app.limitMinutes;
        
        appLimitItem.innerHTML = `
            <div class="app-limit-info">
                <div class="app-limit-name">${app.name}</div>
                <div class="app-limit-time">
                    ${Math.floor(app.usedMinutes / 60)}h ${app.usedMinutes % 60}m / ${Math.floor(app.limitMinutes / 60)}h ${app.limitMinutes % 60}m
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${usedPercentage}%; background-color: ${isExceeded ? '#dc3545' : '#4a6fa5'}"></div>
                </div>
            </div>
            <div class="app-limit-actions">
                <button class="app-limit-edit" data-id="${app.id}">Edit</button>
                <button class="app-limit-delete" data-id="${app.id}">Delete</button>
            </div>
        `;
        
        appLimitsContainer.appendChild(appLimitItem);
    });
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.app-limit-edit').forEach(button => {
        button.addEventListener('click', () => editAppLimit(button.dataset.id));
    });
    
    document.querySelectorAll('.app-limit-delete').forEach(button => {
        button.addEventListener('click', () => deleteAppLimit(button.dataset.id));
    });
}

// Edit an app limit
function editAppLimit(appId) {
    const app = screenTimeData.appLimits.find(app => app.id.toString() === appId);
    
    if (!app) return;
    
    // Pre-fill form with app data
    if (app.category === 'custom') {
        appSelect.value = 'custom';
        customAppInput.value = app.name;
        customAppInput.classList.remove('hidden');
    } else {
        appSelect.value = app.category;
        customAppInput.classList.add('hidden');
    }
    
    appLimitInput.value = app.limitMinutes;
    
    // Find closest reminder frequency option
    const frequencies = [15, 30, 60];
    const closestFrequency = frequencies.reduce((prev, curr) => 
        Math.abs(curr - app.reminderFrequency) < Math.abs(prev - app.reminderFrequency) ? curr : prev);
    
    reminderFrequencySelect.value = closestFrequency;
    
    // Delete the app as it will be re-added
    deleteAppLimit(appId);
    
    // Scroll to form
    appSelect.scrollIntoView({ behavior: 'smooth' });
}

// Delete an app limit
function deleteAppLimit(appId) {
    screenTimeData.appLimits = screenTimeData.appLimits.filter(app => 
        app.id.toString() !== appId);
    
    saveData();
    renderAppLimits();
}

// Check app limits and provide reminders if needed
function checkAppLimits() {
    screenTimeData.appLimits.forEach(app => {
        if (app.usedMinutes >= app.limitMinutes) {
            // Limit exceeded
            if (!app.lastReminder || 
                (Date.now() - app.lastReminder) >= app.reminderFrequency * 60 * 1000) {
                sendNotification(`${app.name} Limit Exceeded`, 
                    `You've reached your daily limit of ${Math.floor(app.limitMinutes / 60)}h ${app.limitMinutes % 60}m for ${app.name}.`);
                app.lastReminder = Date.now();
            }
        } else if (app.usedMinutes >= app.limitMinutes * 0.8) {
            // Approaching limit (80%)
            if (!app.lastReminder || 
                (Date.now() - app.lastReminder) >= app.reminderFrequency * 60 * 1000) {
                sendNotification(`${app.name} Limit Approaching`, 
                    `You're approaching your daily limit for ${app.name}.`);
                app.lastReminder = Date.now();
            }
        }
    });
    
    saveData();
}

// Log time for a specific app
function logAppTime(appName, minutes) {
    const app = screenTimeData.appLimits.find(app => 
        app.name.toLowerCase() === appName.toLowerCase());
    
    if (app) {
        app.usedMinutes += minutes;
        saveData();
        renderAppLimits();
        checkAppLimits();
    }
}

// AI-Powered Breaks Functions

// Function to get a break suggestion based on selected preferences
function getBreakSuggestion() {
    try {
        console.log('Getting break suggestion based on preferences');
        
        // Get HTML elements if not already defined
        const prefPhysical = document.getElementById('pref-physical');
        const prefMental = document.getElementById('pref-mental');
        const prefCreative = document.getElementById('pref-creative');
        const prefSocial = document.getElementById('pref-social');
        const breakActivityElement = document.getElementById('break-activity');
        
        if (!breakActivityElement) {
            console.error('Break activity element not found');
            return 'Take a 5-minute break to refresh your mind and body.';
        }
        
        // Get enabled categories
    const enabledCategories = [];
        if (prefPhysical && prefPhysical.checked) enabledCategories.push('physical');
        if (prefMental && prefMental.checked) enabledCategories.push('mental');
        if (prefCreative && prefCreative.checked) enabledCategories.push('creative');
        if (prefSocial && prefSocial.checked) enabledCategories.push('social');
    
        console.log('Enabled categories:', enabledCategories);
    
        // If no categories are selected, use physical by default
    if (enabledCategories.length === 0) {
            console.log('No break preferences selected, defaulting to physical');
            enabledCategories.push('physical');
            if (prefPhysical) prefPhysical.checked = true;
    }
    
        // Randomly select a category from enabled categories
    const randomCategory = enabledCategories[Math.floor(Math.random() * enabledCategories.length)];
        console.log('Selected category:', randomCategory);
    
        // Get suggestions for selected category
        let suggestion = 'Take a 5-minute break';
        
        if (breakSuggestions && breakSuggestions[randomCategory]) {
    const suggestions = breakSuggestions[randomCategory];
            const randomIndex = Math.floor(Math.random() * suggestions.length);
            suggestion = suggestions[randomIndex];
        } else {
            console.warn('Could not find suggestions for category: ' + randomCategory);
        }
        
        // Update the UI
        breakActivityElement.textContent = suggestion;
        console.log('Break suggestion updated:', suggestion);
        
        return suggestion;
    } catch (error) {
        console.error('Error getting break suggestion:', error);
        return 'Take a 5-minute stretching break to refresh your mind and body.';
    }
}

// Function to start a break
function startBreak() {
    try {
        console.log('Starting break');
        
        // Get HTML element if not already defined
        const breakActivityElement = document.getElementById('break-activity');
        
        // Get the current break activity
        const breakActivity = breakActivityElement ? breakActivityElement.textContent : 'Taking a break';
        
        // Send a notification
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification('Time for a break!', {
                    body: breakActivity,
                    icon: 'https://cdn-icons-png.flaticon.com/512/6195/6195702.png'
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification('Time for a break!', {
                            body: breakActivity,
                            icon: 'https://cdn-icons-png.flaticon.com/512/6195/6195702.png'
                        });
                    }
                });
            }
        }
        
        // Log the break in history
        const now = new Date();
        if (!screenTimeData.breakHistory) {
            screenTimeData.breakHistory = [];
        }
        
        screenTimeData.breakHistory.push({
            timestamp: now.toISOString(),
            activity: breakActivity
        });
        
        // Save data
        saveData();
        
        // Alert the user
        alert('Break started: ' + breakActivity);
        
        console.log('Break started successfully');
        return true;
    } catch (error) {
        console.error('Error starting break:', error);
        alert('Break started!');
        return false;
    }
}

// Function to update break preferences
function updateBreakPreferences() {
    try {
        console.log('Updating break preferences');
        
        // Get HTML elements if not already defined
        const prefPhysical = document.getElementById('pref-physical');
        const prefMental = document.getElementById('pref-mental');
        const prefCreative = document.getElementById('pref-creative');
        const prefSocial = document.getElementById('pref-social');
        
        // Save preferences
        if (!screenTimeData.breakPreferences) {
            screenTimeData.breakPreferences = {};
        }
        
        screenTimeData.breakPreferences = {
            physical: prefPhysical ? prefPhysical.checked : true,
            mental: prefMental ? prefMental.checked : true,
            creative: prefCreative ? prefCreative.checked : true,
            social: prefSocial ? prefSocial.checked : true
        };
        
        console.log('Updated break preferences:', screenTimeData.breakPreferences);
        
        // Save data
        saveData();
        
        // Get a new suggestion based on updated preferences
        getBreakSuggestion();
        
        console.log('Break preferences updated successfully');
        return true;
    } catch (error) {
        console.error('Error updating break preferences:', error);
        return false;
    }
}

// Event listeners
function attachEventListeners() {
    try {
        // Core event listeners
        saveLimitsButton.addEventListener('click', saveLimits);
        logTimeButton.addEventListener('click', logTime);

        // Smart Time Limits event listeners
        appSelect.addEventListener('change', toggleCustomAppInput);
        addAppLimitButton.addEventListener('click', addAppLimit);

        // AI-Powered Breaks event listeners
        nextBreakButton.addEventListener('click', getBreakSuggestion);
        startBreakButton.addEventListener('click', startBreak);
        prefPhysical.addEventListener('change', updateBreakPreferences);
        prefMental.addEventListener('change', updateBreakPreferences);
        prefCreative.addEventListener('change', updateBreakPreferences);
        prefSocial.addEventListener('change', updateBreakPreferences);

        // Focus Mode event listeners
        focusDurationSelect.addEventListener('change', updateFocusDuration);
        customDurationInput.addEventListener('input', updateFocusDuration);
        startFocusButton.addEventListener('click', startFocusSession);
        pauseFocusButton.addEventListener('click', pauseFocusSession);
        stopFocusButton.addEventListener('click', stopFocusSession);
        blockCustomCheckbox.addEventListener('change', toggleCustomBlocks);
        
        // Challenge event listeners
        document.querySelectorAll('.start-challenge').forEach(button => {
            // Only add event listener if there's no onclick attribute to prevent conflicts
            if (!button.hasAttribute('onclick')) {
                button.addEventListener('click', function() {
                    startChallenge(this);
                });
            }
        });
        
        debug('All event listeners attached successfully');
        return true;
    } catch (error) {
        debug('Error attaching event listeners', 'error', error);
        return false;
    }
}

// Focus Mode Functions

// Function to start a focus session
function startFocusSession() {
    try {
        debug('Starting focus session');
        
        if (focusActive) {
            debug('Focus session already active', 'warn');
            return false;
        }
    
    // Update UI
    startFocusButton.disabled = true;
    pauseFocusButton.disabled = false;
    stopFocusButton.disabled = false;
    
        // Set focus status
        focusActive = true;
        focusPaused = false;
        
        // Start timer
        focusTimer = setInterval(updateFocusTimer, 1000);
        
        // Log start time
        const sessionData = {
            startTime: new Date().toISOString(),
            duration: focusDuration,
            completed: false
        };
        
        // Initialize focusHistory if it doesn't exist
        if (!screenTimeData.focusHistory) {
            screenTimeData.focusHistory = [];
        }
        
        // Add to history
        screenTimeData.focusHistory.push(sessionData);
        
        // Save data
        saveData();
        
        // Update UI
        updateFocusTimerDisplay();
        
        // Apply site blocks if enabled
        applyFocusBlocks();
        
        debug('Focus session started successfully');
        
        // Show notification
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification('Focus Session Started', {
                    body: `Focus session started for ${formatTime(focusDuration)}`,
                    icon: 'https://cdn-icons-png.flaticon.com/512/2618/2618245.png'
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification('Focus Session Started', {
                            body: `Focus session started for ${formatTime(focusDuration)}`,
                            icon: 'https://cdn-icons-png.flaticon.com/512/2618/2618245.png'
                        });
                    }
                });
            }
        }
        
        return true;
    } catch (error) {
        debug('Error starting focus session', 'error', error);
        return false;
    }
}

// Function to pause or resume a focus session
function pauseFocusSession() {
    try {
        debug('Toggling focus session pause state');
        
        if (!focusActive) {
            debug('No active focus session to pause', 'warn');
            return false;
        }
    
    if (focusPaused) {
            // Resume session
            focusTimer = setInterval(updateFocusTimer, 1000);
            focusPaused = false;
        pauseFocusButton.textContent = 'Pause';
            debug('Focus session resumed');
        } else {
            // Pause session
            clearInterval(focusTimer);
            focusPaused = true;
            pauseFocusButton.textContent = 'Resume';
            debug('Focus session paused');
        }
        
        return true;
    } catch (error) {
        debug('Error toggling focus session pause state', 'error', error);
        return false;
    }
}

// Function to stop a focus session
function stopFocusSession() {
    try {
        debug('Stopping focus session');
        
        if (!focusActive) {
            debug('No active focus session to stop', 'warn');
            return false;
        }
        
        // Clear timer
        clearInterval(focusTimer);
        
        // Update UI
        startFocusButton.disabled = false;
        pauseFocusButton.disabled = true;
        stopFocusButton.disabled = true;
        pauseFocusButton.textContent = 'Pause';
        
        // Update status
        focusActive = false;
        focusPaused = false;
        
        // Update session data
        if (screenTimeData.focusHistory && screenTimeData.focusHistory.length > 0) {
            const lastSession = screenTimeData.focusHistory[screenTimeData.focusHistory.length - 1];
            lastSession.endTime = new Date().toISOString();
            lastSession.completed = false;
            lastSession.timeSpent = focusDuration - focusTimeRemaining;
        }
        
        // Reset timer
        focusTimeRemaining = focusDuration;
        
        // Update display
        updateFocusTimerDisplay();
        
        // Remove site blocks
        removeFocusBlocks();
        
        // Save data
        saveData();
        
        debug('Focus session stopped successfully');
        return true;
    } catch (error) {
        debug('Error stopping focus session', 'error', error);
        return false;
    }
}

// Update the focus timer every second
function updateFocusTimer() {
    try {
        if (focusTimeRemaining <= 0) {
            // Timer complete
            completeFocusSession();
            return;
        }
        
        // Decrement timer
        focusTimeRemaining--;
        
        // Update display
    updateFocusTimerDisplay();
    } catch (error) {
        debug('Error updating focus timer', 'error', error);
    }
}

// Complete the focus session when timer ends
function completeFocusSession() {
    try {
        debug('Completing focus session');
        
        // Clear timer
        clearInterval(focusTimer);
        
        // Update UI
    startFocusButton.disabled = false;
    pauseFocusButton.disabled = true;
    stopFocusButton.disabled = true;
    pauseFocusButton.textContent = 'Pause';
    
        // Update status
        focusActive = false;
        focusPaused = false;
        
        // Update session data
        if (screenTimeData.focusHistory && screenTimeData.focusHistory.length > 0) {
            const lastSession = screenTimeData.focusHistory[screenTimeData.focusHistory.length - 1];
            lastSession.endTime = new Date().toISOString();
            lastSession.completed = true;
        }
        
        // Reset timer
        focusTimeRemaining = focusDuration;
        
        // Update display
        updateFocusTimerDisplay();
        
        // Remove site blocks
        removeFocusBlocks();
        
        // Save data
    saveData();
        
        // Show alert
        alert('Focus session completed! Great job!');
        
        // Show notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Focus Session Complete', {
                body: 'Great job! You completed your focus session.',
                icon: 'https://cdn-icons-png.flaticon.com/512/190/190411.png'
            });
        }
        
        // Suggest a break
        getBreakSuggestion();
        
        debug('Focus session completed successfully');
        return true;
    } catch (error) {
        debug('Error completing focus session', 'error', error);
        return false;
    }
}

// Update the focus timer display
function updateFocusTimerDisplay() {
    try {
        if (focusTimerDisplay) {
            const minutes = Math.floor(focusTimeRemaining / 60);
            const seconds = focusTimeRemaining % 60;
            focusTimerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    } catch (error) {
        debug('Error updating focus timer display', 'error', error);
    }
}

// Set the focus duration in minutes
function setFocusDuration(minutes) {
    try {
        console.log(`Setting focus duration to ${minutes} minutes`);
        
        // Get elements if not already defined
        const focusTimerDisplay = document.getElementById('focus-timer-display');
        const focusDurationSelect = document.getElementById('focus-duration');
        const customDurationInput = document.getElementById('custom-duration');
        const applyCustomDurationButton = document.getElementById('apply-custom-duration');
        
        // Don't allow changing duration during active session
        if (focusActive) {
            console.warn('Cannot change duration during active session');
            return false;
        }
        
        // Set the duration
        focusDuration = minutes * 60; // Convert to seconds
        focusTimeRemaining = focusDuration;
        
        // Update the display
        if (focusTimerDisplay) {
            updateFocusTimerDisplay();
        }
        
        // Update the select element
        if (focusDurationSelect) {
            // Check if the duration matches a preset
            if ([15, 25, 45, 60, 90].includes(minutes)) {
                focusDurationSelect.value = minutes.toString();
                
                // Hide custom input
                if (customDurationInput && applyCustomDurationButton) {
                    customDurationInput.classList.add('hidden');
                    applyCustomDurationButton.classList.add('hidden');
                }
            } else {
                // Custom duration
                focusDurationSelect.value = 'custom';
                
                // Show and set custom input
                if (customDurationInput && applyCustomDurationButton) {
                    customDurationInput.value = minutes;
                    customDurationInput.classList.remove('hidden');
                    applyCustomDurationButton.classList.remove('hidden');
                }
            }
        }
        
        // Update quick duration buttons
        const quickDurationButtons = document.querySelectorAll('.quick-duration');
        if (quickDurationButtons.length > 0) {
            quickDurationButtons.forEach(button => {
                const buttonMinutes = parseInt(button.getAttribute('data-minutes'));
                button.classList.toggle('active', buttonMinutes === minutes);
            });
        }
        
        console.log(`Focus duration set to ${minutes} minutes`);
        return true;
    } catch (error) {
        console.error('Error setting focus duration:', error);
        return false;
    }
}

// Toggle custom blocks textarea
function toggleCustomBlocks() {
    try {
        console.log('Toggling custom blocks');
        const blockCustomCheckbox = document.getElementById('block-custom');
        const customBlocksTextarea = document.getElementById('custom-blocks');
        
        if (blockCustomCheckbox && customBlocksTextarea) {
            const showCustomBlocks = blockCustomCheckbox.checked;
            customBlocksTextarea.classList.toggle('hidden', !showCustomBlocks);
            
            console.log(`Custom blocks textarea ${showCustomBlocks ? 'shown' : 'hidden'}`);
        } else {
            console.error('Block custom checkbox or custom blocks textarea element not found');
        }
        
        return true;
    } catch (error) {
        console.error('Error toggling custom blocks:', error);
        return false;
    }
}

// Insights and Reports Functions

// Update insights based on current data
function updateInsights() {
    generateTrendChart();
    updateDailyInsight();
    updatePersonalizedTips();
}

// Generate trend chart
function generateTrendChart() {
    // In a real implementation, this would use a charting library
    // For now, we'll just show a placeholder
    const chartPlaceholder = document.createElement('div');
    chartPlaceholder.className = 'placeholder-chart';
    chartPlaceholder.textContent = 'Screen time visualization would appear here';
    
    trendChartElement.innerHTML = '';
    trendChartElement.appendChild(chartPlaceholder);
    
    // Check if we have history data
    if (screenTimeData.dailyHistory.length > 0) {
        const historyText = document.createElement('p');
        historyText.style.padding = '10px';
        historyText.style.fontSize = '0.9rem';
        
        // Calculate average
        const totalMinutes = screenTimeData.dailyHistory.reduce((total, day) => total + day.total, 0);
        const avgMinutes = Math.round(totalMinutes / screenTimeData.dailyHistory.length);
        const avgHours = Math.floor(avgMinutes / 60);
        const avgMins = avgMinutes % 60;
        
        historyText.textContent = `Average daily screen time: ${avgHours}h ${avgMins}m`;
        trendChartElement.appendChild(historyText);
    }
}

// Update daily insight based on usage patterns
function updateDailyInsight() {
    let insight = '';
    
    // Get current hour
    const currentHour = new Date().getHours();
    
    if (currentHour < 12) {
        insight = 'Morning is a great time to set your intentions for the day. Try to limit unnecessary screen time during your most productive hours.';
    } else if (currentHour < 18) {
        insight = 'Afternoon slumps are common. Consider using the AI-powered breaks to refresh your mind instead of mindless scrolling.';
    } else {
        insight = 'Evening screen time can affect your sleep quality. Try the Digital Sunset challenge to improve your sleep.';
    }
    
    // Check if we have history to provide more personalized insights
    if (screenTimeData.dailyHistory.length > 6) {
        const recentDays = screenTimeData.dailyHistory.slice(-7);
        const recentTotal = recentDays.reduce((total, day) => total + day.total, 0);
        const avgRecentMinutes = recentTotal / recentDays.length;
        
        const todayMinutes = screenTimeData.pc.timeInMinutes + screenTimeData.phone.timeInMinutes;
        
        if (todayMinutes > avgRecentMinutes * 1.2) {
            insight = 'Today\'s screen time is higher than your weekly average. Consider taking more breaks or using Focus Mode.';
        } else if (todayMinutes < avgRecentMinutes * 0.8) {
            insight = 'Great job! Today\'s screen time is lower than your weekly average. Keep up the good work.';
        }
    }
    
    dailyInsightElement.textContent = insight;
}

// Update personalized tips based on usage patterns
function updatePersonalizedTips() {
    const tips = [];
    
    // Check if we have focus history
    if (screenTimeData.focusHistory.length > 0) {
        const completedSessions = screenTimeData.focusHistory.filter(session => session.completed).length;
        const abandonedSessions = screenTimeData.focusHistory.filter(session => !session.completed).length;
        
        if (abandonedSessions > completedSessions) {
            tips.push('You tend to end focus sessions early. Try shorter sessions to build the focus habit.');
        } else if (completedSessions > 5) {
            tips.push('You\'ve successfully completed multiple focus sessions. Consider increasing the duration for deeper work.');
        }
    } else {
        tips.push('Try the Focus Mode to improve productivity and reduce distractions.');
    }
    
    // Check device balance
    if (screenTimeData.pc.timeInMinutes > 0 || screenTimeData.phone.timeInMinutes > 0) {
        const totalMinutes = screenTimeData.pc.timeInMinutes + screenTimeData.phone.timeInMinutes;
        const pcPercentage = (screenTimeData.pc.timeInMinutes / totalMinutes) * 100;
        
        if (pcPercentage > 80) {
            tips.push('Most of your screen time is on PC. Remember to take regular breaks to reduce eye strain.');
        } else if (pcPercentage < 20) {
            tips.push('Most of your screen time is on your phone. Consider using Digital Wellbeing tools on your device.');
        }
    }
    
    // Add generic tips if we don't have enough data
    if (tips.length < 3) {
        tips.push('Set specific goals for reducing non-essential screen time.');
        tips.push('Try the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.');
        tips.push('Use the AI-powered breaks to stay refreshed throughout your day.');
    }
    
    // Update the UI
    personalizedTipsElement.innerHTML = '';
    
    tips.slice(0, 3).forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        personalizedTipsElement.appendChild(li);
    });
}

// Function to set up notification permissions
function setupNotifications() {
    try {
        debug('Setting up notifications');
        
        // Check if the browser supports notifications
        if (!("Notification" in window)) {
            debug('Notifications not supported in this browser', 'warn');
            return false;
        }
        
        // If permission is not granted, request it
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            debug('Requesting notification permission');
            
            // Show a message to the user first
            const requestPermission = confirm('Would you like to enable notifications for break reminders and focus session updates?');
            
            if (requestPermission) {
                Notification.requestPermission().then(function(permission) {
                    if (permission === "granted") {
                        debug('Notification permission granted');
                        sendNotification('Notifications Enabled', 'You will now receive notifications for your screen time activities.');
                    } else {
                        debug('Notification permission denied by user', 'warn');
                    }
                });
            } else {
                debug('User declined to request notification permission', 'warn');
            }
        }
        
        debug('Notification setup complete');
        return true;
    } catch (error) {
        debug('Error setting up notifications', 'error', error);
        return false;
    }
}

// Function to send notifications
function sendNotification(title, message) {
    try {
        debug(`Sending notification: ${title}`);
        
        // Check if the browser supports notifications
        if (!("Notification" in window)) {
            debug('Notifications not supported in this browser', 'warn');
            return false;
        }
        
        // Check permission
        if (Notification.permission === "granted") {
            // Create and show notification
            const notification = new Notification(title, {
                body: message,
                icon: 'https://cdn-icons-png.flaticon.com/512/1584/1584358.png'
            });
            
            // Handle click event
            notification.onclick = function() {
                window.focus();
                notification.close();
            };
            
            debug('Notification sent successfully');
            return true;
        } else if (Notification.permission !== "denied") {
            // Request permission
            Notification.requestPermission().then(function(permission) {
                if (permission === "granted") {
                    sendNotification(title, message);
                }
            });
        }
        
        return false;
    } catch (error) {
        debug('Error sending notification', 'error', error);
        return false;
    }
}

// Ensure all buttons have click handlers by adding direct onclick attributes
function ensureButtonHandlers() {
    try {
        debug("Ensuring all buttons have direct onclick handlers");
        
        // Core buttons
        if (saveLimitsButton && !saveLimitsButton.hasAttribute('onclick')) {
            saveLimitsButton.setAttribute('onclick', 'saveLimits()');
        }
        
        if (logTimeButton && !logTimeButton.hasAttribute('onclick')) {
            logTimeButton.setAttribute('onclick', 'logTime()');
        }
        
        // Smart Time Limits
        if (addAppLimitButton && !addAppLimitButton.hasAttribute('onclick')) {
            addAppLimitButton.setAttribute('onclick', 'addAppLimit()');
        }
        
        // AI-Powered Breaks
        if (nextBreakButton && !nextBreakButton.hasAttribute('onclick')) {
            nextBreakButton.setAttribute('onclick', 'getBreakSuggestion()');
        }
        
        if (startBreakButton && !startBreakButton.hasAttribute('onclick')) {
            startBreakButton.setAttribute('onclick', 'startBreak()');
        }
        
        // Focus Mode
        if (startFocusButton && !startFocusButton.hasAttribute('onclick')) {
            startFocusButton.setAttribute('onclick', 'startFocusSession()');
        }
        
        if (pauseFocusButton && !pauseFocusButton.hasAttribute('onclick')) {
            pauseFocusButton.setAttribute('onclick', 'pauseFocusSession()');
        }
        
        if (stopFocusButton && !stopFocusButton.hasAttribute('onclick')) {
            stopFocusButton.setAttribute('onclick', 'stopFocusSession()');
        }
        
        // Theme buttons
        const modeToggleBtn = document.getElementById('mode-toggle-btn');
        if (modeToggleBtn && !modeToggleBtn.hasAttribute('onclick')) {
            modeToggleBtn.setAttribute('onclick', 'toggleThemeMode()');
        }
        
        const colorToggleBtn = document.getElementById('color-toggle-btn');
        if (colorToggleBtn && !colorToggleBtn.hasAttribute('onclick')) {
            colorToggleBtn.setAttribute('onclick', 'toggleThemePanel()');
        }
        
        debug("Button handlers ensured");
        return true;
    } catch (error) {
        debug("Error ensuring button handlers", 'error', error);
        return false;
    }
}

// Global functions for direct onclick attributes
function toggleThemeMode() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update other UI elements
        const lightModeRadio = document.getElementById('light-mode');
        const darkModeRadio = document.getElementById('dark-mode');
        const lightIcon = document.querySelector('.light-icon');
        const darkIcon = document.querySelector('.dark-icon');
        
        if (newTheme === 'light') {
            if (lightModeRadio) lightModeRadio.checked = true;
            if (darkModeRadio) darkModeRadio.checked = false;
            if (lightIcon) lightIcon.classList.remove('hidden');
            if (darkIcon) darkIcon.classList.add('hidden');
        } else {
            if (lightModeRadio) lightModeRadio.checked = false;
            if (darkModeRadio) darkModeRadio.checked = true;
            if (lightIcon) lightIcon.classList.add('hidden');
            if (darkIcon) darkIcon.classList.remove('hidden');
        }
        
        if (typeof saveThemeSettings === 'function') {
            saveThemeSettings();
        }
        
        debug(`Theme toggled to ${newTheme}`);
    } catch (error) {
        debug("Error in toggleThemeMode", 'error', error);
    }
}

function toggleThemePanel() {
    try {
        const themeSettingsPanel = document.querySelector('.theme-settings');
        const modeSettings = document.getElementById('mode-settings');
        const colorSettings = document.getElementById('color-settings');
        
        if (themeSettingsPanel) {
            if (themeSettingsPanel.classList.contains('collapsed')) {
                themeSettingsPanel.classList.remove('collapsed');
                if (modeSettings) modeSettings.style.display = 'none';
                if (colorSettings) colorSettings.style.display = 'block';
            } else {
                themeSettingsPanel.classList.add('collapsed');
            }
            
            debug("Theme panel toggled");
        }
    } catch (error) {
        debug("Error in toggleThemePanel", 'error', error);
    }
}

// Initialize
// We use both DOMContentLoaded and window.onload to ensure reliable loading
document.addEventListener('DOMContentLoaded', initApp);
window.onload = initApp;

// Track if initialization has already occurred to prevent double initialization
let appInitialized = false;

function initApp() {
    // Only run once
    if (appInitialized) return;
    appInitialized = true;
    
    debug('Application initializing...');
    
    // Use setTimeout to prevent blocking the main thread
    setTimeout(() => {
        try {
            // Validate DOM elements first
            if (!validateDomElements()) {
                debug("DOM validation failed. Some elements couldn't be found.", 'error');
                
                // Try to continue with available elements
                debug("Attempting to continue with available elements", 'warn');
            }
            
            // Attach event listeners
            if (!attachEventListeners()) {
                debug("Failed to attach event listeners.", 'error');
                
                // Try to fix event listeners manually
                debug("Attempting to fix event listeners manually", 'warn');
                tryFixEventListeners();
            }
            
            // Ensure all buttons have direct onclick attributes
            ensureButtonHandlers();
            
            try {
                debug("Loading saved data");
                loadData();
                
                debug("Setting up notifications");
                setupNotifications();
                
                // Initialize UI for custom inputs
                debug("Initializing UI components");
                if (typeof toggleCustomAppInput === 'function') toggleCustomAppInput();
                if (typeof toggleCustomBlocks === 'function') toggleCustomBlocks();
                if (typeof updateFocusDuration === 'function') updateFocusDuration();
                
                // Initialize challenges
                debug("Initializing challenges");
                initChallenges();
                
                // Initialize real-time clock animation
                debug("Initializing real-time clock animation");
                initClockAnimation();
                
                // Add focus timer display update
                updateFocusTimerDisplay();
                
                // Initialize tracking UI
                updateTrackingUI(false);
                
                // Initialize theme settings
                debug("Setting up theme settings");
                if (!setupThemeSettings()) {
                    debug("Theme settings setup failed, attempting fix", 'warn');
                    tryFixThemeSettings();
                }
                
                // Auto-start tracking if enabled in settings
                if (screenTimeData.autoStartTracking) {
                    debug("Auto-starting real-time tracking");
                    enableRealTimeTracking();
                }
                
                debug("Initialization complete");
            } catch (error) {
                debug("Error during initialization", 'error', error);
                // Continue to allow partial functionality
            }
        } catch (error) {
            debug("Critical error during initialization", 'error', error);
            console.error("Screen Time Tracker initialization failed:", error);
            alert("There was an issue initializing the Screen Time Tracker app. Some features may not work correctly.");
        }
    }, 0);
}

// Backup function to try to fix event listeners if the main function fails
function tryFixEventListeners() {
    try {
        // Core buttons
        if (saveLimitsButton) {
            saveLimitsButton.onclick = saveLimits;
        }
        
        if (logTimeButton) {
            logTimeButton.onclick = logTime;
        }
        
        // Smart Time Limits
        if (appSelect) {
            appSelect.onchange = toggleCustomAppInput;
        }
        
        if (addAppLimitButton) {
            addAppLimitButton.onclick = addAppLimit;
        }
        
        // AI-Powered Breaks
        if (nextBreakButton) {
            nextBreakButton.onclick = getBreakSuggestion;
        }
        
        if (startBreakButton) {
            startBreakButton.onclick = startBreak;
        }
        
        // Focus Mode
        if (startFocusButton) {
            startFocusButton.onclick = startFocusSession;
        }
        
        if (pauseFocusButton) {
            pauseFocusButton.onclick = pauseFocusSession;
        }
        
        if (stopFocusButton) {
            stopFocusButton.onclick = stopFocusSession;
        }
        
        debug("Manual event listener fixes applied");
    } catch (error) {
        debug("Failed to apply manual event listener fixes", 'error', error);
    }
}

// Backup function to try to fix theme settings if the main function fails
function tryFixThemeSettings() {
    try {
        const themeToggleBtn = document.getElementById('mode-toggle-btn');
        const colorToggleBtn = document.getElementById('color-toggle-btn');
        
        if (themeToggleBtn) {
            themeToggleBtn.onclick = function() {
                try {
                    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                    document.documentElement.setAttribute('data-theme', newTheme);
                    
                    // Update checkbox if it exists
                    const lightModeRadio = document.getElementById('light-mode');
                    const darkModeRadio = document.getElementById('dark-mode');
                    
                    if (lightModeRadio && darkModeRadio) {
                        if (newTheme === 'light') {
                            lightModeRadio.checked = true;
                            darkModeRadio.checked = false;
                        } else {
                            lightModeRadio.checked = false;
                            darkModeRadio.checked = true;
                        }
                    }
                    
                    // Show/hide icons if they exist
                    const lightIcon = document.querySelector('.light-icon');
                    const darkIcon = document.querySelector('.dark-icon');
                    
                    if (lightIcon && darkIcon) {
                        if (newTheme === 'light') {
                            lightIcon.classList.remove('hidden');
                            darkIcon.classList.add('hidden');
                        } else {
                            lightIcon.classList.add('hidden');
                            darkIcon.classList.remove('hidden');
                        }
                    }
                    
                    if (typeof saveThemeSettings === 'function') {
                        saveThemeSettings();
                    }
                    
                    debug(`Theme changed to ${newTheme}`);
                } catch (err) {
                    debug("Error toggling theme", 'error', err);
                }
            };
        }
        
        if (colorToggleBtn) {
            colorToggleBtn.onclick = function() {
                try {
                    // Simple implementation: cycle through colors
                    const colors = ['blue', 'purple', 'green', 'orange', 'teal', 'red'];
                    const currentColor = document.documentElement.getAttribute('data-color') || 'blue';
                    const currentIndex = colors.indexOf(currentColor);
                    const nextIndex = (currentIndex + 1) % colors.length;
                    const nextColor = colors[nextIndex];
                    
                    document.documentElement.setAttribute('data-color', nextColor);
                    
                    if (typeof saveThemeSettings === 'function') {
                        saveThemeSettings();
                    }
                    
                    debug(`Color changed to ${nextColor}`);
                } catch (err) {
                    debug("Error changing color", 'error', err);
                }
            };
        }
        
        debug("Manual theme settings fixes applied");
    } catch (error) {
        debug("Failed to apply manual theme settings fixes", 'error', error);
    }
}

// Function to validate that all DOM elements are found properly
function validateDomElements() {
    // Create an array of all element references and their IDs/names for validation
    const elements = [
        { element: hoursElement, name: 'hours' },
        { element: minutesElement, name: 'minutes' },
        { element: usageProgressBar, name: 'usage-progress' },
        { element: pcTimeElement, name: 'pc-time' },
        { element: pcProgressBar, name: 'pc-progress' },
        { element: phoneTimeElement, name: 'phone-time' },
        { element: phoneProgressBar, name: 'phone-progress' },
        { element: pcLimitInput, name: 'pc-limit' },
        { element: phoneLimitInput, name: 'phone-limit' },
        { element: saveLimitsButton, name: 'save-limits' },
        { element: deviceSelect, name: 'device-select' },
        { element: hoursInput, name: 'hours-input' },
        { element: minutesInput, name: 'minutes-input' },
        { element: logTimeButton, name: 'log-time' },
        { element: appSelect, name: 'app-select' },
        { element: customAppInput, name: 'custom-app' },
        { element: appLimitInput, name: 'app-limit' },
        { element: reminderFrequencySelect, name: 'reminder-frequency' },
        { element: addAppLimitButton, name: 'add-app-limit' },
        { element: appLimitsContainer, name: 'app-limits-container' },
        { element: breakActivityElement, name: 'break-activity' },
        { element: nextBreakButton, name: 'next-break' },
        { element: startBreakButton, name: 'start-break' },
        { element: prefPhysical, name: 'pref-physical' },
        { element: prefMental, name: 'pref-mental' },
        { element: prefCreative, name: 'pref-creative' },
        { element: prefSocial, name: 'pref-social' },
        { element: focusTimerDisplay, name: 'focus-timer-display' },
        { element: startFocusButton, name: 'start-focus' },
        { element: pauseFocusButton, name: 'pause-focus' },
        { element: stopFocusButton, name: 'stop-focus' },
        { element: focusDurationSelect, name: 'focus-duration' },
        { element: customDurationInput, name: 'custom-duration' },
        { element: blockSocialCheckbox, name: 'block-social' },
        { element: blockEntertainmentCheckbox, name: 'block-entertainment' },
        { element: blockNewsCheckbox, name: 'block-news' },
        { element: blockCustomCheckbox, name: 'block-custom' },
        { element: customBlocksTextarea, name: 'custom-blocks' },
        { element: trendChartElement, name: 'trend-chart' },
        { element: dailyInsightElement, name: 'daily-insight' },
        { element: personalizedTipsElement, name: 'personalized-tips' }
    ];

    // Check each element
    let allValid = true;
    const missingElements = [];

    elements.forEach(item => {
        if (!item.element) {
            console.error(`Element with ID '${item.name}' not found`);
            missingElements.push(item.name);
            allValid = false;
        }
    });

    // Also check theme settings elements
    const themeElements = [
        'mode-toggle-btn',
        'color-toggle-btn',
        'light-mode',
        'dark-mode',
        'mode-settings',
        'color-settings'
    ];

    themeElements.forEach(id => {
        if (!document.getElementById(id)) {
            console.error(`Theme element with ID '${id}' not found`);
            missingElements.push(id);
            allValid = false;
        }
    });

    if (!allValid) {
        console.error('Missing elements:', missingElements);
    }

    return allValid;
}

// Theme Settings Functions
function toggleThemeMode() {
    try {
        console.log('Toggling theme mode');
        const root = document.documentElement;
        const currentTheme = root.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Update the DOM
        root.setAttribute('data-theme', newTheme);
        
        // Update radio buttons if they exist
        const lightModeRadio = document.getElementById('light-mode');
        const darkModeRadio = document.getElementById('dark-mode');
        
        if (lightModeRadio && darkModeRadio) {
            lightModeRadio.checked = newTheme === 'light';
            darkModeRadio.checked = newTheme === 'dark';
        }
        
        // Update icon visibility
        const lightIcon = document.querySelector('.light-icon');
        const darkIcon = document.querySelector('.dark-icon');
        
        if (lightIcon && darkIcon) {
            if (newTheme === 'light') {
                lightIcon.classList.remove('hidden');
                darkIcon.classList.add('hidden');
            } else {
                lightIcon.classList.add('hidden');
                darkIcon.classList.remove('hidden');
            }
        }
        
        // Save settings
        saveThemeSettings();
        
        console.log(`Theme mode toggled to ${newTheme}`);
        return true;
    } catch (error) {
        console.error('Error toggling theme mode:', error);
        return false;
    }
}

function toggleThemePanel() {
    try {
        console.log('Toggling theme panel');
        const panel = document.querySelector('.theme-settings');
        
        if (panel) {
            panel.classList.toggle('collapsed');
            console.log(`Theme panel ${panel.classList.contains('collapsed') ? 'collapsed' : 'expanded'}`);
        } else {
            console.error('Theme settings panel not found');
        }
        
        return true;
    } catch (error) {
        console.error('Error toggling theme panel:', error);
        return false;
    }
}

function setColorTheme(color) {
    try {
        console.log(`Setting color theme to ${color}`);
        const root = document.documentElement;
        
        // Update the DOM
        root.setAttribute('data-color', color);
        
        // Update active class on color options
        const colorOptions = document.querySelectorAll('.color-option');
        
        if (colorOptions.length > 0) {
            colorOptions.forEach(option => {
                if (option.getAttribute('data-color') === color) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        }
        
        // Save settings
        saveThemeSettings();
        
        console.log(`Color theme set to ${color}`);
        return true;
    } catch (error) {
        console.error('Error setting color theme:', error);
        return false;
    }
}

function saveThemeSettings() {
    try {
        console.log('Saving theme settings');
        const root = document.documentElement;
        const theme = root.getAttribute('data-theme') || 'light';
        const color = root.getAttribute('data-color') || 'blue';
        
        // Save to localStorage
        const settings = { theme, color };
        localStorage.setItem('themeSettings', JSON.stringify(settings));
        
        console.log('Theme settings saved:', settings);
        return true;
    } catch (error) {
        console.error('Error saving theme settings:', error);
        return false;
    }
}

function loadThemeSettings() {
    try {
        console.log('Loading theme settings');
        const savedSettings = localStorage.getItem('themeSettings');
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            const root = document.documentElement;
            
            // Apply theme
            if (settings.theme) {
                root.setAttribute('data-theme', settings.theme);
                
                // Update radio buttons if they exist
                const lightModeRadio = document.getElementById('light-mode');
                const darkModeRadio = document.getElementById('dark-mode');
                
                if (lightModeRadio && darkModeRadio) {
                    lightModeRadio.checked = settings.theme === 'light';
                    darkModeRadio.checked = settings.theme === 'dark';
                }
                
                // Update icon visibility
                const lightIcon = document.querySelector('.light-icon');
                const darkIcon = document.querySelector('.dark-icon');
                
                if (lightIcon && darkIcon) {
                    if (settings.theme === 'light') {
                        lightIcon.classList.remove('hidden');
                        darkIcon.classList.add('hidden');
                    } else {
                        lightIcon.classList.add('hidden');
                        darkIcon.classList.remove('hidden');
                    }
                }
            }
            
            // Apply color
            if (settings.color) {
                root.setAttribute('data-color', settings.color);
                
                // Update active class on color options
                const colorOptions = document.querySelectorAll('.color-option');
                
                if (colorOptions.length > 0) {
                    colorOptions.forEach(option => {
                        if (option.getAttribute('data-color') === settings.color) {
                            option.classList.add('active');
                        } else {
                            option.classList.remove('active');
                        }
                    });
                }
            }
            
            console.log('Theme settings loaded:', settings);
        } else {
            console.log('No saved theme settings found');
        }
        
        return true;
    } catch (error) {
        console.error('Error loading theme settings:', error);
        return false;
    }
}

// Function to handle challenge button clicks
function startChallenge(buttonElement) {
    try {
        if (!buttonElement) {
            debug("No button element provided to startChallenge", 'error');
            return;
        }

        const card = buttonElement.closest('.challenge-card');
        if (!card) {
            debug("Could not find parent challenge card", 'error');
            return;
        }

        const title = card.querySelector('h3')?.textContent;
        if (!title) {
            debug("Could not find challenge title", 'error');
            return;
        }

        debug(`Starting challenge: ${title}`);

        const challenge = screenTimeData.challenges.find(c => c.name === title);

        if (challenge) {
            challenge.active = true;
            challenge.progress = 0;
            saveData();

            alert(`Challenge "${title}" started! Good luck!`);

            // Update UI to show active challenge
            buttonElement.textContent = "Challenge Active";
            buttonElement.disabled = true;

            const badge = card.querySelector('.challenge-badge');
            if (badge) {
                badge.textContent = 'Active';
                badge.classList.remove('locked');
            }
            
            // Add active class to the card
            card.classList.add('active');

            debug(`Challenge "${title}" activated successfully`);
        } else {
            debug(`Challenge "${title}" not found in data`, 'error');
        }
    } catch (error) {
        debug("Error starting challenge", 'error', error);
    }
}

// Function to initialize and render challenges
function initChallenges() {
    try {
        debug("Initializing challenges");
        const challengeCards = document.querySelectorAll('.challenge-card');
        
        if (!challengeCards || challengeCards.length === 0) {
            debug("No challenge cards found in the DOM", 'warn');
            return false;
        }
        
        challengeCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent;
            if (!title) {
                debug("Challenge card without title found", 'warn');
                return;
            }
            
            const challenge = screenTimeData.challenges.find(c => c.name === title);
            if (!challenge) {
                debug(`Challenge "${title}" not found in data`, 'warn');
                return;
            }
            
            const button = card.querySelector('.start-challenge');
            const badge = card.querySelector('.challenge-badge');
            const progressElement = card.querySelector('.challenge-progress span');
            
            // Update card based on challenge state
            if (challenge.completed) {
                if (button) {
                    button.textContent = "Completed";
                    button.disabled = true;
                }
                if (badge) {
                    badge.textContent = 'Completed';
                    badge.classList.remove('locked');
                }
                card.classList.add('active');
                if (progressElement) {
                    progressElement.style.width = '100%';
                }
            } else if (challenge.active) {
                if (button) {
                    button.textContent = "Challenge Active";
                    button.disabled = true;
                }
                if (badge) {
                    badge.textContent = 'Active';
                    badge.classList.remove('locked');
                }
                card.classList.add('active');
                if (progressElement) {
                    const progress = challenge.progress || 0;
                    progressElement.style.width = `${progress}%`;
                }
            } else {
                if (button) {
                    button.textContent = "Start Challenge";
                    button.disabled = false;
                }
                if (badge) {
                    badge.textContent = challenge.unlocked ? 'Available' : 'Locked';
                    if (!challenge.unlocked) {
                        badge.classList.add('locked');
                    } else {
                        badge.classList.remove('locked');
                    }
                }
                card.classList.remove('active');
                if (progressElement) {
                    progressElement.style.width = '0%';
                }
            }
        });
        
        debug("Challenges initialized successfully");
        return true;
    } catch (error) {
        debug("Error initializing challenges", 'error', error);
        return false;
    }
}

// Function to update challenge progress in the UI
function updateChallengeUI() {
    try {
        debug("Updating challenge UI");
        const challengeCards = document.querySelectorAll('.challenge-card');
        
        challengeCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent;
            if (!title) return;
            
            const challenge = screenTimeData.challenges.find(c => c.name === title);
            if (!challenge || !challenge.active) return;
            
            const progressElement = card.querySelector('.challenge-progress span');
            if (progressElement) {
                const progress = challenge.progress || 0;
                progressElement.style.width = `${progress}%`;
            }
            
            // Check if challenge is completed
            if (challenge.completed) {
                const button = card.querySelector('.start-challenge');
                const badge = card.querySelector('.challenge-badge');
                
                if (button) {
                    button.textContent = "Completed";
                    button.disabled = true;
                }
                if (badge) {
                    badge.textContent = 'Completed';
                }
            }
        });
        
        debug("Challenge UI updated successfully");
        return true;
    } catch (error) {
        debug("Error updating challenge UI", 'error', error);
        return false;
    }
}

// Update focus-related challenges
function updateFocusChallenges(minutes) {
    try {
        // Focus Master challenge
        const focusMasterChallenge = screenTimeData.challenges.find(c => c.name === 'Focus Master');
        
        if (focusMasterChallenge && focusMasterChallenge.active && minutes >= 45) {
            debug("Updating Focus Master challenge progress");
            
            // Count focus sessions of 45+ minutes in the past week
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            
            const longSessionsCount = screenTimeData.focusHistory?.filter(session => {
                const sessionDate = new Date(session.startTime);
                return sessionDate >= oneWeekAgo && (session.timeSpent || 0) >= 45;
            }).length || 0;
            
            // Calculate progress (5 sessions = 100%)
            const progressPercentage = Math.min(Math.round((longSessionsCount / 5) * 100), 100);
            focusMasterChallenge.progress = progressPercentage;
            
            // Check if challenge completed
            if (progressPercentage >= 100 && !focusMasterChallenge.completed) {
                focusMasterChallenge.completed = true;
                sendNotification('Challenge Completed!', 'You\'ve completed the Focus Master challenge!');
                
                // Update achievements
                const focusBadge = document.querySelector('.achievement[title*="Focus Master"]');
                if (focusBadge) {
                    focusBadge.classList.remove('locked');
                }
            }
            
            saveData();
            updateChallengeUI();
            debug(`Focus Master challenge progress: ${progressPercentage}%`);
        }
    } catch (error) {
        debug("Error updating focus challenges", 'error', error);
    }
}

// Real-time screen time tracking functions
let lastActivityTime = Date.now();
let idleThreshold = 2 * 60 * 1000; // 2 minutes in milliseconds
let trackingInterval = null;
let trackingActive = false;
let lastTrackedMinute = null;

// Function to update user activity timestamp
function updateUserActivity() {
    try {
        lastActivityTime = Date.now();
        return true;
    } catch (error) {
        console.error('Error updating user activity:', error);
        return false;
    }
}

// Function to check if user is idle
function isUserIdle() {
    try {
        return (Date.now() - lastActivityTime) > idleThreshold;
    } catch (error) {
        console.error('Error checking if user is idle:', error);
        return false;
    }
}

// Function to start real-time tracking
function startRealTimeTracking() {
    try {
        console.log('Starting real-time screen time tracking');
        
        // Clear any existing interval
        if (trackingInterval) {
            clearInterval(trackingInterval);
        }
        
        // Set tracking as active
        trackingActive = true;
        lastActivityTime = Date.now();
        
        // Add event listeners for activity tracking
        document.addEventListener('mousemove', updateUserActivity);
        document.addEventListener('keydown', updateUserActivity);
        document.addEventListener('click', updateUserActivity);
        document.addEventListener('scroll', updateUserActivity);
        
        // Add visibility change listener
        document.addEventListener('visibilitychange', handlePageVisibility);
        
        // Start interval for tracking
        trackingInterval = setInterval(trackScreenTime, 60000); // Every minute
        
        console.log('Real-time tracking started');
        return true;
    } catch (error) {
        console.error('Error starting real-time tracking:', error);
        return false;
    }
}

// Function to stop real-time tracking
function stopRealTimeTracking() {
    try {
        console.log('Stopping real-time screen time tracking');
        
        // Clear interval
        if (trackingInterval) {
            clearInterval(trackingInterval);
            trackingInterval = null;
        }
        
        // Set tracking as inactive
        trackingActive = false;
        
        // Remove event listeners
        document.removeEventListener('mousemove', updateUserActivity);
        document.removeEventListener('keydown', updateUserActivity);
        document.removeEventListener('click', updateUserActivity);
        document.removeEventListener('scroll', updateUserActivity);
        document.removeEventListener('visibilitychange', handlePageVisibility);
        
        console.log('Real-time tracking stopped');
        return true;
    } catch (error) {
        console.error('Error stopping real-time tracking:', error);
        return false;
    }
}

// Function to handle page visibility changes
function handlePageVisibility() {
    try {
        if (document.hidden) {
            console.log('Page hidden, pausing tracking');
            // Don't stop tracking completely, just note that user isn't active on this page
        } else {
            console.log('Page visible, resuming tracking');
            lastActivityTime = Date.now(); // Reset idle timer
        }
        return true;
    } catch (error) {
        console.error('Error handling page visibility:', error);
        return false;
    }
}

// Function to track screen time
function trackScreenTime() {
    try {
        // Don't track if user is idle or page is hidden
        if (isUserIdle() || document.hidden) {
            debug('User is idle or page is hidden, not tracking time', 'warn');
            return false;
        }
        
        // Get current time
        const now = new Date();
        const currentMinute = `${now.getHours()}:${now.getMinutes()}`;
        
        // Avoid duplicate tracking in the same minute
        if (currentMinute === lastTrackedMinute) {
            return false;
        }
        
        debug(`Tracking screen time at ${currentMinute}`);
        lastTrackedMinute = currentMinute;
        
        // Add 1 minute to PC time (since we're tracking from browser)
        if (!screenTimeData.today) {
            screenTimeData.today = { pc: 0, phone: 0 };
        }
        
        screenTimeData.today.pc += 1;
        
        // Track current website (if applicable)
        trackCurrentWebsiteUsage();
        
        // Save data
        saveData();
        
        // Update UI
        updateTodaysUsage();
        updateClockAnimation();
        
        return true;
    } catch (error) {
        debug('Error tracking screen time', 'error', error);
        return false;
    }
}

// Function to track website-specific usage
function trackCurrentWebsiteUsage() {
    try {
        // Only check for active website once per minute to reduce overhead
        const now = Date.now();
        if (!lastWebsiteCheck || (now - lastWebsiteCheck) > 60000) {
            // In a real extension, we would get the actual URL
            // For demo purposes, we'll simulate with a few common websites
            const demoWebsites = [
                'facebook.com',
                'youtube.com',
                'github.com',
                'gmail.com',
                'twitter.com',
                'instagram.com',
                'linkedin.com'
            ];
            
            // In a real extension, we'd get the actual domain
            // For demo, we'll randomly select a site occasionally and stick with it for a while
            if (!currentWebsite || Math.random() < 0.3) {
                const randomIndex = Math.floor(Math.random() * demoWebsites.length);
                currentWebsite = demoWebsites[randomIndex];
                debug(`Now tracking website: ${currentWebsite}`);
            }
            
            lastWebsiteCheck = now;
        }
        
        // Record time for the current website
        if (currentWebsite) {
            if (!screenTimeData.websiteUsage[currentWebsite]) {
                screenTimeData.websiteUsage[currentWebsite] = {
                    totalMinutes: 0,
                    sessionsCount: 0,
                    lastVisit: new Date().toISOString()
                };
            }
            
            // Increment time spent on this website
            screenTimeData.websiteUsage[currentWebsite].totalMinutes += 1;
            screenTimeData.websiteUsage[currentWebsite].lastVisit = new Date().toISOString();
            
            debug(`Added 1 minute to ${currentWebsite}, total: ${screenTimeData.websiteUsage[currentWebsite].totalMinutes} minutes`);
            
            // Update the website usage chart data
            updateWebsiteUsageChart();
        }
        
        return true;
    } catch (error) {
        debug('Error tracking website-specific usage', 'error', error);
        return false;
    }
}

// Function to update website usage chart
function updateWebsiteUsageChart() {
    try {
        // Create sorted array of websites by usage
        const websiteData = Object.entries(screenTimeData.websiteUsage)
            .map(([website, data]) => ({ 
                website, 
                minutes: data.totalMinutes 
            }))
            .sort((a, b) => b.minutes - a.minutes)
            .slice(0, 7); // Show top 7 websites
        
        // Update chart data
        websiteUsageChartData.labels = websiteData.map(item => item.website);
        websiteUsageChartData.datasets[0].data = websiteData.map(item => item.minutes);
        
        // Update chart if it exists
        if (websiteUsageChart) {
            websiteUsageChart.update();
        }
        
        return true;
    } catch (error) {
        debug('Error updating website usage chart', 'error', error);
        return false;
    }
}

// Function to create and update real-time clock animation
function initClockAnimation() {
    try {
        debug('Initializing clock animation');
        const clockContainer = document.getElementById('real-time-clock');
        
        if (!clockContainer) {
            debug('Clock container not found, creating element', 'warn');
            // Create clock container if it doesn't exist
            const headerSection = document.querySelector('.dashboard-header');
            if (headerSection) {
                const clockDiv = document.createElement('div');
                clockDiv.id = 'real-time-clock';
                clockDiv.className = 'real-time-clock';
                clockDiv.innerHTML = `
                    <div class="clock-circle">
                        <div class="clock-face">
                            <div class="clock-center"></div>
                            <div class="clock-hour"></div>
                            <div class="clock-minute"></div>
                            <div class="clock-second"></div>
                            <div class="clock-website-indicator"></div>
                        </div>
                    </div>
                    <div class="clock-info">
                        <div class="current-website">Not tracking</div>
                        <div class="session-time">00:00</div>
                    </div>
                `;
                headerSection.appendChild(clockDiv);
                
                // Add the necessary CSS
                const style = document.createElement('style');
                style.textContent = `
                    .real-time-clock {
                        display: flex;
                        align-items: center;
                        margin-left: 20px;
                    }
                    
                    .clock-circle {
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        background-color: var(--card-bg);
                        border: 2px solid var(--accent-color);
                        position: relative;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    }
                    
                    .clock-face {
                        width: 100%;
                        height: 100%;
                        position: relative;
                    }
                    
                    .clock-center {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 8px;
                        height: 8px;
                        margin-left: -4px;
                        margin-top: -4px;
                        background-color: var(--accent-color);
                        border-radius: 50%;
                        z-index: 2;
                    }
                    
                    .clock-hour, .clock-minute, .clock-second {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform-origin: left center;
                    }
                    
                    .clock-hour {
                        width: 25px;
                        height: 4px;
                        margin-top: -2px;
                        background-color: var(--text-color);
                        z-index: 1;
                    }
                    
                    .clock-minute {
                        width: 30px;
                        height: 2px;
                        margin-top: -1px;
                        background-color: var(--text-color);
                        z-index: 1;
                    }
                    
                    .clock-second {
                        width: 35px;
                        height: 1px;
                        margin-top: -0.5px;
                        background-color: var(--accent-color);
                        z-index: 1;
                    }
                    
                    .clock-website-indicator {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 25px;
                        height: 3px;
                        margin-top: -1.5px;
                        background-color: #ff5722;
                        transform-origin: left center;
                        z-index: 0;
                        opacity: 0.7;
                    }
                    
                    .clock-info {
                        margin-left: 15px;
                    }
                    
                    .current-website {
                        font-size: 14px;
                        font-weight: bold;
                        color: var(--text-color);
                    }
                    
                    .session-time {
                        font-size: 12px;
                        color: var(--text-muted);
                    }
                `;
                document.head.appendChild(style);
                
                debug('Clock container created');
            } else {
                debug('Header section not found, cannot create clock', 'error');
                return false;
            }
        }
        
        // Start animation
        if (clockAnimationInterval) {
            clearInterval(clockAnimationInterval);
        }
        
        clockAnimationInterval = setInterval(updateClockAnimation, 1000);
        debug('Clock animation initialized');
        
        return true;
    } catch (error) {
        debug('Error initializing clock animation', 'error', error);
        return false;
    }
}

// Function to update clock animation
function updateClockAnimation() {
    try {
        const clockHourHand = document.querySelector('.clock-hour');
        const clockMinuteHand = document.querySelector('.clock-minute');
        const clockSecondHand = document.querySelector('.clock-second');
        const clockWebsiteIndicator = document.querySelector('.clock-website-indicator');
        const currentWebsiteElement = document.querySelector('.current-website');
        const sessionTimeElement = document.querySelector('.session-time');
        
        if (!clockHourHand || !clockMinuteHand || !clockSecondHand) {
            debug('Clock hands not found', 'warn');
            return false;
        }
        
        // Get current time
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        // Calculate rotation angles
        const hourAngle = (hours * 30) + (minutes * 0.5); // 30 degrees per hour, 0.5 degrees per minute
        const minuteAngle = minutes * 6; // 6 degrees per minute
        const secondAngle = seconds * 6; // 6 degrees per second
        
        // Apply rotations
        clockHourHand.style.transform = `rotate(${hourAngle}deg)`;
        clockMinuteHand.style.transform = `rotate(${minuteAngle}deg)`;
        clockSecondHand.style.transform = `rotate(${secondAngle}deg)`;
        
        // Update website indicator
        if (clockWebsiteIndicator && currentWebsite) {
            // Calculate the percentage of the day spent on the current website
            const totalMinutesForWebsite = screenTimeData.websiteUsage[currentWebsite]?.totalMinutes || 0;
            const percentageOfDay = Math.min(totalMinutesForWebsite / (60 * 3), 1); // Cap at 3 hours for visual purposes
            const indicatorAngle = percentageOfDay * 360; // Full circle is 360 degrees
            
            clockWebsiteIndicator.style.transform = `rotate(${indicatorAngle}deg)`;
            clockWebsiteIndicator.style.opacity = '0.7';
            
            // Update current website display
            if (currentWebsiteElement) {
                currentWebsiteElement.textContent = currentWebsite;
            }
            
            // Update session time display
            if (sessionTimeElement) {
                const hours = Math.floor(totalMinutesForWebsite / 60);
                const minutes = totalMinutesForWebsite % 60;
                sessionTimeElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            }
        } else if (clockWebsiteIndicator) {
            clockWebsiteIndicator.style.opacity = '0';
            
            if (currentWebsiteElement) {
                currentWebsiteElement.textContent = 'Not tracking';
            }
            
            if (sessionTimeElement) {
                sessionTimeElement.textContent = '00:00';
            }
        }
        
        return true;
    } catch (error) {
        debug('Error updating clock animation', 'error', error);
        return false;
    }
}

// Function to enable real-time tracking
function enableRealTimeTracking() {
    try {
        debug('Enabling real-time tracking');
        
        // Get elements if not already defined
        const startTrackingButton = document.getElementById('start-tracking');
        const stopTrackingButton = document.getElementById('stop-tracking');
        const trackingIndicator = document.getElementById('tracking-indicator');
        const trackingStatusText = document.getElementById('tracking-status-text');
        
        // Update UI
        if (startTrackingButton) startTrackingButton.disabled = true;
        if (stopTrackingButton) stopTrackingButton.disabled = false;
        
        if (trackingIndicator) {
            trackingIndicator.classList.remove('offline');
            trackingIndicator.classList.add('active');
        }
        
        if (trackingStatusText) {
            trackingStatusText.textContent = 'Tracking Active';
        }
        
        // Start tracking
        startRealTimeTracking();
        
        // Show notification
        alert('Real-time tracking is now active!');
        
        debug('Real-time tracking enabled successfully');
        return true;
    } catch (error) {
        debug('Error enabling real-time tracking', 'error', error);
        return false;
    }
}

// Function to disable real-time tracking
function disableRealTimeTracking() {
    try {
        debug('Disabling real-time tracking');
        
        // Get elements if not already defined
        const startTrackingButton = document.getElementById('start-tracking');
        const stopTrackingButton = document.getElementById('stop-tracking');
        const trackingIndicator = document.getElementById('tracking-indicator');
        const trackingStatusText = document.getElementById('tracking-status-text');
        
        // Update UI
        if (startTrackingButton) startTrackingButton.disabled = false;
        if (stopTrackingButton) stopTrackingButton.disabled = true;
        
        if (trackingIndicator) {
            trackingIndicator.classList.remove('active');
            trackingIndicator.classList.add('offline');
        }
        
        if (trackingStatusText) {
            trackingStatusText.textContent = 'Tracking Inactive';
        }
        
        // Stop tracking
        stopRealTimeTracking();
        
        // Show notification
        alert('Real-time tracking has been disabled.');
        
        debug('Real-time tracking disabled successfully');
        return true;
    } catch (error) {
        debug('Error disabling real-time tracking', 'error', error);
        return false;
    }
}

// Function to generate charts
function generateCharts() {
    try {
        debug('Generating charts');
        
        // Get the chart canvas elements
        const usageChartCanvas = document.getElementById('usage-chart');
        const socialMediaChartCanvas = document.getElementById('social-media-chart');
        const websiteUsageChartCanvas = document.getElementById('website-usage-chart');
        
        if (!usageChartCanvas || !socialMediaChartCanvas) {
            debug('Chart canvas elements not found', 'error');
            return false;
        }
        
        // Initialize charts if Chart.js is available
        if (typeof Chart !== 'undefined') {
            // Clear any existing charts
            if (usageChart) usageChart.destroy();
            if (socialMediaChart) socialMediaChart.destroy();
            if (websiteUsageChart) websiteUsageChart.destroy();
            
            // Create usage chart
            usageChart = new Chart(usageChartCanvas, {
                type: 'line',
                data: usageChartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                            },
                            grid: {
                                color: 'rgba(200, 200, 200, 0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                            },
                            grid: {
                                color: 'rgba(200, 200, 200, 0.1)'
                            }
                        }
                    }
                }
            });
            
            // Create social media chart
            socialMediaChart = new Chart(socialMediaChartCanvas, {
                type: 'doughnut',
                data: socialMediaChartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                            }
                        }
                    }
                }
            });
            
            // Create website usage chart if the canvas exists
            if (websiteUsageChartCanvas) {
                websiteUsageChart = new Chart(websiteUsageChartCanvas, {
                    type: 'bar',
                    data: websiteUsageChartData,
                    options: {
                        responsive: true,
                        indexAxis: 'y',
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'Website Screen Time (minutes)',
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                            }
                        },
                        scales: {
                            x: {
                                beginAtZero: true,
                                ticks: {
                                    color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                                },
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.1)'
                                }
                            },
                            y: {
                                ticks: {
                                    color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                                },
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.1)'
                                }
                            }
                        }
                    }
                });
            } else {
                debug('Website usage chart canvas not found, skipping', 'warn');
            }
            
            debug('Charts generated successfully');
            return true;
        } else {
            // Chart.js not available - create placeholders
            debug('Chart.js not available, creating placeholders', 'warn');
            createChartPlaceholders();
            return false;
        }
    } catch (error) {
        debug('Error generating charts', 'error', error);
        createChartPlaceholders();
        return false;
    }
}

// Create placeholder elements if Chart.js is not available
function createChartPlaceholders() {
    try {
        const usageChartContainer = document.getElementById('trend-chart');
        const socialMediaChartContainer = document.getElementById('social-media-chart-container');
        
        if (usageChartContainer) {
            usageChartContainer.innerHTML = `
                <div class="placeholder-chart">
                    <div>Screen Time Trend</div>
                    <div class="placeholder-text">Chart visualization not available</div>
                </div>
            `;
        }
        
        if (socialMediaChartContainer) {
            socialMediaChartContainer.innerHTML = `
                <div class="placeholder-chart">
                    <div>Social Media Usage</div>
                    <div class="placeholder-text">Chart visualization not available</div>
                </div>
            `;
        }
    } catch (error) {
        debug('Error creating chart placeholders', 'error', error);
    }
}

// Update chart data based on current usage
function updateChartData() {
    try {
        debug('Updating chart data');
        
        // Update usage chart data with today's time points
        const now = new Date();
        const time = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
        
        // Only add a new data point every 15 minutes to prevent overcrowding
        const lastLabel = usageChartData.labels[usageChartData.labels.length - 1];
        const lastLabelTime = lastLabel ? new Date(now.toDateString() + ' ' + lastLabel) : null;
        
        // If no labels yet or it's been at least 15 minutes since the last label
        if (!lastLabelTime || (now - lastLabelTime) >= 15 * 60 * 1000) {
            usageChartData.labels.push(time);
            const totalMinutes = screenTimeData.pc.timeInMinutes + screenTimeData.phone.timeInMinutes;
            usageChartData.datasets[0].data.push(totalMinutes);
            
            // Keep the chart showing only the last 8 hours
            if (usageChartData.labels.length > 32) { // 32 points for 8 hours (at 15 min intervals)
                usageChartData.labels.shift();
                usageChartData.datasets[0].data.shift();
            }
        }
        
        // Update social media chart based on app limits
        if (screenTimeData.appLimits.length > 0) {
            // Get app categories and their usage
            const categories = {};
            
            screenTimeData.appLimits.forEach(app => {
                const category = app.category || 'Other';
                if (!categories[category]) {
                    categories[category] = 0;
                }
                categories[category] += app.usedMinutes || 0;
            });
            
            // Update chart data
            socialMediaChartData.labels = Object.keys(categories);
            socialMediaChartData.datasets[0].data = Object.values(categories);
            
            // Ensure we have colors for all categories
            while (socialMediaChartData.datasets[0].backgroundColor.length < socialMediaChartData.labels.length) {
                // Generate a random color if we don't have enough predefined colors
                const r = Math.floor(Math.random() * 200) + 50;
                const g = Math.floor(Math.random() * 200) + 50;
                const b = Math.floor(Math.random() * 200) + 50;
                
                socialMediaChartData.datasets[0].backgroundColor.push(`rgba(${r}, ${g}, ${b}, 0.8)`);
                socialMediaChartData.datasets[0].borderColor.push(`rgba(${r}, ${g}, ${b}, 1)`);
            }
        }
        
        // Update the charts if they exist
        if (usageChart) usageChart.update();
        if (socialMediaChart) socialMediaChart.update();
        
        debug('Chart data updated');
    } catch (error) {
        debug('Error updating chart data', 'error', error);
    }
}

// Function to get server time
function getServerTime() {
    try {
        // Make a HEAD request to the server to get the date
        fetch('/', { method: 'HEAD' })
            .then(response => {
                // Extract the date from the response headers
                const serverDate = new Date(response.headers.get('date'));
                
                // Update the server time display
                const serverTimeElement = document.getElementById('server-time');
                if (serverTimeElement) {
                    serverTimeElement.textContent = serverDate.toLocaleTimeString();
                }
                
                // Update local data to reflect server time if needed
                const nowLocal = new Date();
                const timeDiff = Math.abs(nowLocal - serverDate);
                
                // If local time and server time differ by more than 2 minutes, log it
                if (timeDiff > 2 * 60 * 1000) {
                    debug(`Local time and server time differ by ${Math.round(timeDiff / 1000 / 60)} minutes`, 'warn');
                }
                
                return serverDate;
            })
            .catch(error => {
                debug('Error fetching server time', 'error', error);
                return new Date(); // Fallback to local time
            });
    } catch (error) {
        debug('Error in getServerTime', 'error', error);
        return new Date(); // Fallback to local time
    }
}

// Function to set focus duration from quick buttons
function setFocusDuration(minutes) {
    try {
        console.log(`Setting focus duration to ${minutes} minutes`);
        
        // Get elements if not already defined
        const focusTimerDisplay = document.getElementById('focus-timer-display');
        const focusDurationSelect = document.getElementById('focus-duration');
        const customDurationInput = document.getElementById('custom-duration');
        const applyCustomDurationButton = document.getElementById('apply-custom-duration');
        
        // Don't allow changing duration during active session
        if (focusActive) {
            console.warn('Cannot change duration during active session');
            return false;
        }
        
        // Set the duration
        focusDuration = minutes * 60; // Convert to seconds
        focusTimeRemaining = focusDuration;
        
        // Update the display
        if (focusTimerDisplay) {
            updateFocusTimerDisplay();
        }
        
        // Update the select element
        if (focusDurationSelect) {
            // Check if the duration matches a preset
            if ([15, 25, 45, 60, 90].includes(minutes)) {
                focusDurationSelect.value = minutes.toString();
                
                // Hide custom input
                if (customDurationInput && applyCustomDurationButton) {
                    customDurationInput.classList.add('hidden');
                    applyCustomDurationButton.classList.add('hidden');
                }
            } else {
                // Custom duration
                focusDurationSelect.value = 'custom';
                
                // Show and set custom input
                if (customDurationInput && applyCustomDurationButton) {
                    customDurationInput.value = minutes;
                    customDurationInput.classList.remove('hidden');
                    applyCustomDurationButton.classList.remove('hidden');
                }
            }
        }
        
        // Update quick duration buttons
        const quickDurationButtons = document.querySelectorAll('.quick-duration');
        if (quickDurationButtons.length > 0) {
            quickDurationButtons.forEach(button => {
                const buttonMinutes = parseInt(button.getAttribute('data-minutes'));
                button.classList.toggle('active', buttonMinutes === minutes);
            });
        }
        
        console.log(`Focus duration set to ${minutes} minutes`);
        return true;
    } catch (error) {
        console.error('Error setting focus duration:', error);
        return false;
    }
}

// Function to update focus duration based on select or custom input
function updateFocusDuration() {
    try {
        console.log('Updating focus duration');
        
        // Get elements if not already defined
        const focusDurationSelect = document.getElementById('focus-duration');
        const customDurationInput = document.getElementById('custom-duration');
        const applyCustomDurationButton = document.getElementById('apply-custom-duration');
        
        // Don't update during active session
        if (focusActive) {
            console.warn('Cannot update duration during active session');
            return false;
        }
        
        // Show/hide custom input based on selection
        if (focusDurationSelect && customDurationInput && applyCustomDurationButton) {
            const isCustom = focusDurationSelect.value === 'custom';
            customDurationInput.classList.toggle('hidden', !isCustom);
            applyCustomDurationButton.classList.toggle('hidden', !isCustom);
            
            // Update duration if a preset is selected
            if (!isCustom) {
                const minutes = parseInt(focusDurationSelect.value);
                if (!isNaN(minutes)) {
                    setFocusDuration(minutes);
                }
            }
        } else {
            console.error('Focus duration elements not found');
        }
        
        console.log('Focus duration updated');
        return true;
    } catch (error) {
        console.error('Error updating focus duration:', error);
        return false;
    }
}

// Function to apply custom duration from input
function applyCustomDuration() {
    try {
        console.log('Applying custom duration');
        
        // Get custom duration input element
        const customDurationInput = document.getElementById('custom-duration');
        
        if (customDurationInput) {
            const minutes = parseInt(customDurationInput.value);
            
            // Validate input
            if (isNaN(minutes) || minutes < 1 || minutes > 180) {
                alert('Please enter a valid duration between 1 and 180 minutes.');
                return false;
            }
            
            // Set the duration
            setFocusDuration(minutes);
            console.log(`Custom duration set to ${minutes} minutes`);
            return true;
        } else {
            console.error('Custom duration input element not found');
            return false;
        }
    } catch (error) {
        console.error('Error applying custom duration:', error);
        return false;
    }
}

// Function to update today's usage display
function updateTodaysUsage() {
    try {
        console.log('Updating today\'s usage display');
        
        // Get DOM elements if they don't exist
        const pcTimeElement = document.getElementById('pc-time');
        const phoneTimeElement = document.getElementById('phone-time');
        const pcProgressElement = document.getElementById('pc-progress');
        const phoneProgressElement = document.getElementById('phone-progress');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const usageProgressElement = document.getElementById('usage-progress');
        
        // Initialize if they don't exist
        if (!screenTimeData.today) {
            screenTimeData.today = { pc: 0, phone: 0 };
        }
        
        if (!screenTimeData.pc) {
            screenTimeData.pc = { timeInMinutes: 0, limitInHours: 3 };
        }
        
        if (!screenTimeData.phone) {
            screenTimeData.phone = { timeInMinutes: 0, limitInHours: 2 };
        }
        
        // Update PC time
        if (pcTimeElement) {
            const pcHours = Math.floor(screenTimeData.today.pc / 60);
            const pcMinutes = screenTimeData.today.pc % 60;
            pcTimeElement.textContent = `${pcHours}h ${pcMinutes}m`;
        }
        
        // Update Phone time
        if (phoneTimeElement) {
            const phoneHours = Math.floor(screenTimeData.today.phone / 60);
            const phoneMinutes = screenTimeData.today.phone % 60;
            phoneTimeElement.textContent = `${phoneHours}h ${phoneMinutes}m`;
        }
        
        // Update total time
        if (hoursElement && minutesElement) {
            const totalMinutes = screenTimeData.today.pc + screenTimeData.today.phone;
            const totalHours = Math.floor(totalMinutes / 60);
            const remainingMinutes = totalMinutes % 60;
            
            hoursElement.textContent = totalHours;
            minutesElement.textContent = remainingMinutes;
        }
        
        // Update progress bars
        if (pcProgressElement && phoneProgressElement && usageProgressElement) {
            const pcLimitMinutes = screenTimeData.pc.limitInHours * 60;
            const phoneLimitMinutes = screenTimeData.phone.limitInHours * 60;
            const totalLimitMinutes = pcLimitMinutes + phoneLimitMinutes;
            
            const pcProgress = Math.min((screenTimeData.today.pc / pcLimitMinutes) * 100, 100);
            const phoneProgress = Math.min((screenTimeData.today.phone / phoneLimitMinutes) * 100, 100);
            
            const totalMinutes = screenTimeData.today.pc + screenTimeData.today.phone;
            const totalProgress = Math.min((totalMinutes / totalLimitMinutes) * 100, 100);
            
            pcProgressElement.style.width = `${pcProgress}%`;
            phoneProgressElement.style.width = `${phoneProgress}%`;
            usageProgressElement.style.width = `${totalProgress}%`;
            
            // Set color classes
            if (pcProgress > 90) {
                pcProgressElement.style.backgroundColor = '#dc3545';
            }
            if (phoneProgress > 90) {
                phoneProgressElement.style.backgroundColor = '#dc3545';
            }
            if (totalProgress > 90) {
                usageProgressElement.style.backgroundColor = '#dc3545';
            }
        }
        
        console.log('Today\'s usage display updated successfully');
        return true;
    } catch (error) {
        console.error('Error updating today\'s usage display:', error);
        return false;
    }
}

// Function to update server time
function updateServerTime() {
    try {
        const serverTimeElement = document.getElementById('server-time');
        if (serverTimeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            const dateString = now.toLocaleDateString();
            serverTimeElement.textContent = `${dateString} ${timeString}`;
        }
        return true;
    } catch (error) {
        console.error('Error updating server time:', error);
        return false;
    }
}

// Initial setup to run when the page loads
(function() {
    // Wait for DOM to be fully loaded before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApplication);
    } else {
        // DOM already loaded, initialize immediately
        initApplication();
    }
    
    // Main initialization function
    function initApplication() {
        console.log('DOM fully loaded, initializing application...');
        
        try {
            // Load theme settings first
            loadThemeSettings();
            
            // Initialize the app
            initialize();
            
            // Setup error handling for the entire application
            window.onerror = function(message, source, lineno, colno, error) {
                console.error('Global error:', message, 'at', source, lineno, colno);
                return false;
            };
            
            // Final log message
            console.log('Application initialization complete!');
        } catch (error) {
            console.error('Critical error during initialization:', error);
            alert('There was a problem initializing the application. Please refresh the page and try again.');
        }
    }
})();

// Function to start focus timer
function startFocusTimer() {
    try {
        console.log('Starting focus timer');
        
        // Prevent starting if already active
        if (focusActive) {
            console.warn('Focus timer already active');
            return false;
        }
        
        focusActive = true;
        focusStartTime = Date.now();
        
        // Update UI states
        updateFocusUI(true);
        
        // Set up countdown timer
        focusInterval = setInterval(() => {
            updateFocusTimeRemaining();
            
            // Check if time is up
            if (focusTimeRemaining <= 0) {
                endFocusSession(true);
            }
        }, 1000);
        
        // Log the focus session start
        const focusSession = {
            startTime: new Date().toISOString(),
            duration: focusDuration * 60 * 1000, // Convert to milliseconds
            completed: false
        };
        
        // Add to history
        focusHistory.push(focusSession);
        saveFocusHistory();
        
        // Enable real-time tracking during focus session if applicable
        if (settings.enableTracking) {
            if (!isTracking) {
                startTracking();
            }
        }
        
        // Send notification
        if (Notification.permission === 'granted' && settings.allowNotifications) {
            new Notification('Focus Session Started', {
                body: `Stay focused for the next ${focusDuration} minutes.`,
                icon: 'img/focus-icon.png'
            });
        }
        
        console.log(`Focus session started for ${focusDuration} minutes`);
        return true;
    } catch (error) {
        console.error('Error starting focus timer:', error);
        return false;
    }
}

// Function to pause focus timer
function pauseFocusTimer() {
    try {
        console.log('Pausing focus timer');
        
        // Check if focus is active
        if (!focusActive) {
            console.warn('No active focus session to pause');
            return false;
        }
        
        // If already paused, unpause
        if (focusPaused) {
            focusPaused = false;
            focusStartTime = Date.now() - (focusDuration * 60 * 1000 - focusTimeRemaining);
            
            // Resume countdown
            focusInterval = setInterval(() => {
                updateFocusTimeRemaining();
                
                // Check if time is up
                if (focusTimeRemaining <= 0) {
                    endFocusSession(true);
                }
            }, 1000);
            
            // Update UI
            updateFocusPauseUI(false);
            console.log('Focus session resumed');
        } else {
            // Pause the timer
            focusPaused = true;
            
            // Store remaining time
            focusTimeRemaining = (focusDuration * 60 * 1000) - (Date.now() - focusStartTime);
            
            // Clear interval
            clearInterval(focusInterval);
            
            // Update UI
            updateFocusPauseUI(true);
            console.log('Focus session paused');
        }
        
        return true;
    } catch (error) {
        console.error('Error pausing/resuming focus timer:', error);
        return false;
    }
}

// Function to update focus UI based on active state
function updateFocusUI(isActive) {
    try {
        const startButton = document.getElementById('start-focus');
        const pauseButton = document.getElementById('pause-focus');
        const stopButton = document.getElementById('stop-focus');
        const focusControls = document.getElementById('focus-controls');
        const focusSetup = document.getElementById('focus-setup');
        const focusTimer = document.getElementById('focus-timer');
        
        if (startButton && pauseButton && stopButton && focusControls && focusSetup && focusTimer) {
            if (isActive) {
                // Hide setup, show controls
                focusSetup.classList.add('hidden');
                focusControls.classList.remove('hidden');
                focusTimer.classList.remove('hidden');
                
                // Update button states
                startButton.classList.add('hidden');
                pauseButton.classList.remove('hidden');
                stopButton.classList.remove('hidden');
            } else {
                // Show setup, hide controls
                focusSetup.classList.remove('hidden');
                focusControls.classList.add('hidden');
                focusTimer.classList.add('hidden');
                
                // Reset button states
                startButton.classList.remove('hidden');
                pauseButton.classList.add('hidden');
                stopButton.classList.add('hidden');
            }
        } else {
            console.error('Some focus UI elements not found');
        }
    } catch (error) {
        console.error('Error updating focus UI:', error);
    }
}

// Function to update pause/resume button UI
function updateFocusPauseUI(isPaused) {
    try {
        const pauseButton = document.getElementById('pause-focus');
        
        if (pauseButton) {
            if (isPaused) {
                pauseButton.textContent = 'Resume';
                pauseButton.classList.remove('btn-warning');
                pauseButton.classList.add('btn-success');
            } else {
                pauseButton.textContent = 'Pause';
                pauseButton.classList.remove('btn-success');
                pauseButton.classList.add('btn-warning');
            }
        } else {
            console.error('Pause button element not found');
        }
    } catch (error) {
        console.error('Error updating pause UI:', error);
    }
}

// Function to update time remaining in focus session
function updateFocusTimeRemaining() {
    try {
        if (!focusActive || focusPaused) return;
        
        const elapsed = Date.now() - focusStartTime;
        focusTimeRemaining = (focusDuration * 60 * 1000) - elapsed;
        
        // Update UI
        const focusTimerElement = document.getElementById('focus-time-remaining');
        
        if (focusTimerElement) {
            const minutes = Math.floor(focusTimeRemaining / 60000);
            const seconds = Math.floor((focusTimeRemaining % 60000) / 1000);
            
            focusTimerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Change color when time is running low
            if (minutes < 1) {
                focusTimerElement.classList.add('text-danger');
            } else {
                focusTimerElement.classList.remove('text-danger');
            }
        } else {
            console.error('Focus timer element not found');
        }
    } catch (error) {
        console.error('Error updating focus time remaining:', error);
    }
}

// Function to end focus session
function endFocusSession(completed = false) {
    try {
        console.log('Ending focus session');
        
        if (!focusActive) {
            console.warn('No active focus session to end');
            return false;
        }
        
        // Clear interval
        clearInterval(focusInterval);
        
        // Update history entry
        const currentSession = focusHistory[focusHistory.length - 1];
        if (currentSession) {
            currentSession.endTime = new Date().toISOString();
            currentSession.completed = completed;
            saveFocusHistory();
        }
        
        // Reset states
        focusActive = false;
        focusPaused = false;
        
        // Update UI
        updateFocusUI(false);
        
        // Send notification if completed
        if (completed && Notification.permission === 'granted' && settings.allowNotifications) {
            new Notification('Focus Session Completed', {
                body: `Great job! You've completed your ${focusDuration} minute focus session.`,
                icon: 'img/focus-completed.png'
            });
            
            // Check if break suggestions are enabled
            if (settings.enableBreaks) {
                // Ask if they want to take a break
                setTimeout(() => {
                    if (confirm('Your focus session is complete! Would you like to take a break?')) {
                        startBreak();
                    }
                }, 1000);
            }
        }
        
        console.log(`Focus session ended (completed: ${completed})`);
        return true;
    } catch (error) {
        console.error('Error ending focus session:', error);
        return false;
    }
}
}