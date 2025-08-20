// Fantasy Football Draft Order - Tour Championship App (Simplified)
class TourChampionshipApp {
    constructor() {
        console.log('Initializing Tour Championship App...');
        
        this.teams = [
            { name: "MJC", golfer1: "Tommy Fleetwood", golfer2: "Russell Henley" },
            { name: "Kamp", golfer1: "Viktor Hovland", golfer2: "Brian Harman" },
            { name: "Burton", golfer1: "Patrick Cantlay", golfer2: "Corey Conners" },
            { name: "Blanch", golfer1: "Rory McIlroy", golfer2: "J.J. Spaun" },
            { name: "Blake", golfer1: "Shane Lowry", golfer2: "Ludvig Åberg" },
            { name: "Wales", golfer1: "Sungjae Im", golfer2: "Harris English" },
            { name: "Ryan", golfer1: "Robert MacIntyre", golfer2: "Keegan Bradley" },
            { name: "Frazey", golfer1: "Ben Griffin", golfer2: "Maverick McNealy" },
            { name: "Carl", golfer1: "Hideki Matsuyama", golfer2: "Akshay Bhatia" },
            { name: "Pannell", golfer1: "Justin Thomas", golfer2: "Cameron Young" },
            { name: "Tim", golfer1: "Collin Morikawa", golfer2: "Sam Burns" },
            { name: "Goldy", golfer1: "Justin Rose", golfer2: "Sepp Straka" }
        ];

        // Current 2025 Tour Championship odds (Updated August 2025)
        this.golferOdds = {
            "Tommy Fleetwood": 1500,       // Updated from 3500
            "Russell Henley": 2300,        // Updated from 12000
            "Viktor Hovland": 3000,        // Updated from 250
            "Brian Harman": 7000,          // Updated from 3000
            "Patrick Cantlay": 2300,       // Updated from 500
            "Corey Conners": 2500,         // No change
            "Rory McIlroy": 850,           // Updated from 400
            "J.J. Spaun": 2800,            // Updated from 2700
            "Shane Lowry": 4500,           // Updated from 5000
            "Ludvig Åberg": 1300,          // Updated from 800
            "Sungjae Im": 2200,            // Updated from 1800
            "Harris English": 25000,       // No change
            "Robert MacIntyre": 10000,     // No change
            "Keegan Bradley": 7000,        // No change
            "Ben Griffin": 4000,           // Updated from 40000
            "Maverick McNealy": 4000,      // Updated from 30000
            "Hideki Matsuyama": 5500,      // No change
            "Akshay Bhatia": 20000,        // No change
            "Justin Thomas": 3300,         // Updated from 4000
            "Cameron Young": 10000,        // No change
            "Collin Morikawa": 2900,       // Updated from 1200
            "Sam Burns": 4700,             // Updated from 6000
            "Justin Rose": 15000,          // No change
            "Sepp Straka": 50000           // No change
        };

        // Initialize scores
        this.golferScores = {};
        Object.keys(this.golferOdds).forEach(golfer => {
            this.golferScores[golfer] = { score: 0, thru: "--" };
        });

        this.previousRankings = [];
        this.tournamentStarted = false;
        this.isLocked = false;

        console.log('Teams loaded:', this.teams.length);
        console.log('Odds loaded:', Object.keys(this.golferOdds).length);
        console.log('Scores initialized:', Object.keys(this.golferScores).length);

        this.initialize();
    }

    initialize() {
        console.log('Starting initialization...');
        this.setupLockButton();
        this.setupUpdateOddsButton();
        this.renderLeaderboard();
        this.updateLastUpdatedTime();
        console.log('Initialization complete!');
    }

    calculateTeamRankings() {
        const teamScores = this.teams.map(team => {
            const golfer1Score = this.golferScores[team.golfer1]?.score || 0;
            const golfer2Score = this.golferScores[team.golfer2]?.score || 0;
            const golfer1Odds = this.golferOdds[team.golfer1] || 0;
            const golfer2Odds = this.golferOdds[team.golfer2] || 0;
            
            return {
                ...team,
                golfer1Score,
                golfer2Score,
                golfer1Odds,
                golfer2Odds,
                totalScore: golfer1Score + golfer2Score,
                combinedOdds: golfer1Odds + golfer2Odds
            };
        });

        // Sort by combined odds (lowest first = best odds)
        teamScores.sort((a, b) => a.combinedOdds - b.combinedOdds);

        // Add rank
        teamScores.forEach((team, index) => {
            team.rank = index + 1;
        });

        return teamScores;
    }

    renderLeaderboard() {
        console.log('Rendering leaderboard...');
        const leaderboard = document.getElementById('leaderboard');
        
        if (!leaderboard) {
            console.error('Leaderboard element not found!');
            return;
        }

        const rankings = this.calculateTeamRankings();
        console.log('Rankings calculated:', rankings.length);
        
        leaderboard.innerHTML = '';
        
        rankings.forEach((team, index) => {
            const row = document.createElement('div');
            row.className = 'team-row';
            
            row.innerHTML = `
                <div class="rank">${team.rank}</div>
                <div class="team-name">${team.name}</div>
                <div class="golfer-info">
                    <div class="golfer-name">
                        ${team.golfer1} <span class="odds">+${team.golfer1Odds}</span>
                    </div>
                    <div class="golfer-score">E</div>
                </div>
                <div class="golfer-info">
                    <div class="golfer-name">
                        ${team.golfer2} <span class="odds">+${team.golfer2Odds}</span>
                    </div>
                    <div class="golfer-score">E</div>
                </div>
                <div class="total-score">E</div>
            `;
            
            leaderboard.appendChild(row);
            console.log(`Added team ${index + 1}: ${team.name}`);
        });
        
        console.log('Leaderboard rendered successfully!');
    }

    setupLockButton() {
        const lockButton = document.getElementById('lockButton');
        if (lockButton) {
            lockButton.addEventListener('click', () => {
                this.lockInDraftOrder();
            });
            console.log('Lock button setup complete');
        }
    }

    setupUpdateOddsButton() {
        // Create the update odds button
        const buttonContainer = document.getElementById('lockButtonContainer');
        if (buttonContainer) {
            const updateButton = document.createElement('button');
            updateButton.id = 'updateOddsButton';
            updateButton.className = 'update-odds-button';
            updateButton.textContent = '🔄 UPDATE ODDS FROM WEB';
            updateButton.style.cssText = `
                background: #3498db;
                color: white;
                border: none;
                padding: 12px 25px;
                font-size: 14px;
                font-weight: 600;
                border-radius: 8px;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-right: 15px;
                transition: background-color 0.3s ease;
            `;
            
            updateButton.addEventListener('mouseover', () => {
                updateButton.style.background = '#2980b9';
            });
            
            updateButton.addEventListener('mouseout', () => {
                updateButton.style.background = '#3498db';
            });
            
            updateButton.addEventListener('click', () => {
                this.updateOddsFromWeb();
            });
            
            // Add double-click to force show modal (for testing)
            updateButton.addEventListener('dblclick', () => {
                console.log('Double-click detected, forcing modal to show...');
                this.showManualUpdateGuide();
            });
            
            // Insert before the lock button
            buttonContainer.insertBefore(updateButton, buttonContainer.firstChild);
            console.log('Update odds button setup complete');
        }
    }

    lockInDraftOrder() {
        this.isLocked = true;
        const lockButton = document.getElementById('lockButton');
        if (lockButton) {
            lockButton.disabled = true;
            lockButton.textContent = 'DRAFT ORDER LOCKED';
            lockButton.style.background = '#7f8c8d';
        }
        
        console.log('Draft order locked!');
    }

    updateLastUpdatedTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = timeString;
        }
    }

    startTournament() {
        console.log('Starting tournament mode...');
        this.tournamentStarted = true;
        
        // Sample tournament scores
        const sampleScores = {
            "Patrick Cantlay": { score: -16, thru: "F" },
            "Corey Conners": { score: -12, thru: "F" },
            "Viktor Hovland": { score: -17, thru: "F" },
            "Brian Harman": { score: -8, thru: "F" },
            "Shane Lowry": { score: -10, thru: "F" },
            "Ludvig Åberg": { score: -15, thru: "F" },
            "Collin Morikawa": { score: -14, thru: "F" },
            "Sam Burns": { score: -9, thru: "F" },
            "Tommy Fleetwood": { score: -11, thru: "F" },
            "Russell Henley": { score: -6, thru: "F" },
            "Sungjae Im": { score: -13, thru: "F" },
            "Harris English": { score: -4, thru: "F" },
            "Justin Thomas": { score: -10, thru: "F" },
            "Cameron Young": { score: -7, thru: "F" },
            "Rory McIlroy": { score: -16, thru: "F" },
            "J.J. Spaun": { score: 0, thru: "F" },
            "Hideki Matsuyama": { score: -9, thru: "F" },
            "Akshay Bhatia": { score: -5, thru: "F" },
            "Justin Rose": { score: -6, thru: "F" },
            "Sepp Straka": { score: -1, thru: "F" },
            "Robert MacIntyre": { score: 2, thru: "F" },
            "Keegan Bradley": { score: -8, thru: "F" },
            "Ben Griffin": { score: -2, thru: "F" },
            "Maverick McNealy": { score: -3, thru: "F" }
        };
        
        this.golferScores = sampleScores;
        this.renderTournamentLeaderboard();
    }

    renderTournamentLeaderboard() {
        console.log('Rendering tournament leaderboard...');
        const leaderboard = document.getElementById('leaderboard');
        
        if (!leaderboard) {
            console.error('Leaderboard element not found!');
            return;
        }

        // Calculate rankings by tournament scores
        const teamScores = this.teams.map(team => {
            const golfer1Score = this.golferScores[team.golfer1]?.score || 0;
            const golfer2Score = this.golferScores[team.golfer2]?.score || 0;
            const golfer1Odds = this.golferOdds[team.golfer1] || 0;
            const golfer2Odds = this.golferOdds[team.golfer2] || 0;
            
            return {
                ...team,
                golfer1Score,
                golfer2Score,
                golfer1Odds,
                golfer2Odds,
                totalScore: golfer1Score + golfer2Score
            };
        });

        // Sort by tournament scores (lowest first)
        teamScores.sort((a, b) => a.totalScore - b.totalScore);
        
        // Add rank
        teamScores.forEach((team, index) => {
            team.rank = index + 1;
        });

        leaderboard.innerHTML = '';
        
        teamScores.forEach((team, index) => {
            const row = document.createElement('div');
            row.className = 'team-row';
            
            const formatScore = (score) => {
                if (score === 0) return "E";
                return score > 0 ? `+${score}` : `${score}`;
            };

            const getScoreClass = (score) => {
                if (score < 0) return "score-under";
                if (score > 0) return "score-over";
                return "score-even";
            };
            
            row.innerHTML = `
                <div class="rank">${team.rank}</div>
                <div class="team-name">${team.name}</div>
                <div class="golfer-info">
                    <div class="golfer-name">
                        ${team.golfer1} <span class="odds">+${team.golfer1Odds}</span>
                    </div>
                    <div class="golfer-score ${getScoreClass(team.golfer1Score)}">
                        ${formatScore(team.golfer1Score)}
                    </div>
                </div>
                <div class="golfer-info">
                    <div class="golfer-name">
                        ${team.golfer2} <span class="odds">+${team.golfer2Odds}</span>
                    </div>
                    <div class="golfer-score ${getScoreClass(team.golfer2Score)}">
                        ${formatScore(team.golfer2Score)}
                    </div>
                </div>
                <div class="total-score ${getScoreClass(team.totalScore)}">
                    ${formatScore(team.totalScore)}
                </div>
            `;
            
            leaderboard.appendChild(row);
        });
        
        console.log('Tournament leaderboard rendered!');
    }

    async updateOddsFromWeb() {
        const updateButton = document.getElementById('updateOddsButton');
        
        // Show brief loading state for visual feedback
        updateButton.disabled = true;
        updateButton.textContent = '📋 OPENING PASTER...';
        updateButton.style.background = '#95a5a6';
        
        console.log('Opening manual odds paster...');
        
        // Short delay for visual feedback, then show simplified paster
        setTimeout(() => {
            this.showSimplifiedOddsPaster();
            
            // Reset button
            updateButton.disabled = false;
            updateButton.textContent = '🔄 UPDATE ODDS FROM WEB';
            updateButton.style.background = '#3498db';
        }, 200);
    }

    async attemptOddsUpdate() {
        console.log('Attempting to fetch odds from multiple sources...');
        
        // Try proxy methods first
        const attempts = [
            () => this.fetchFromProxy1(),
            () => this.fetchFromProxy2()
        ];
        
        for (let i = 0; i < attempts.length; i++) {
            try {
                console.log(`Attempt ${i + 1}...`);
                const result = await attempts[i]();
                if (result) {
                    console.log(`Attempt ${i + 1} succeeded!`);
                    return true;
                }
            } catch (error) {
                console.log(`Attempt ${i + 1} failed:`, error.message);
            }
        }
        
        console.log('All proxy attempts failed, will show manual options...');
        return false;
    }

    async fetchFromProxy1() {
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const targetUrl = encodeURIComponent('https://www.pgatour.com/tournaments/2025/tour-championship/R2025060/odds');
        
        console.log('Trying allorigins proxy...');
        const response = await fetch(proxyUrl + targetUrl);
        
        if (!response.ok) {
            throw new Error(`Proxy response not ok: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Got response from proxy, parsing...');
        
        const parsedOdds = this.parseOddsFromHTML(data.contents);
        console.log('Parsed odds:', parsedOdds);
        
        if (parsedOdds && Object.keys(parsedOdds).length > 3) {
            this.applyOddsUpdate(parsedOdds);
            return true;
        }
        
        return false;
    }

    async fetchFromProxy2() {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const targetUrl = 'https://www.pgatour.com/tournaments/2025/tour-championship/R2025060/odds';
        
        console.log('Trying cors-anywhere proxy...');
        const response = await fetch(proxyUrl + targetUrl);
        
        if (!response.ok) {
            throw new Error(`CORS proxy response not ok: ${response.status}`);
        }
        
        const html = await response.text();
        const parsedOdds = this.parseOddsFromHTML(html);
        console.log('Parsed odds from cors-anywhere:', parsedOdds);
        
        if (parsedOdds && Object.keys(parsedOdds).length > 3) {
            this.applyOddsUpdate(parsedOdds);
            return true;
        }
        
        return false;
    }

    async autoScrapePGATour() {
        console.log('Opening PGA Tour odds page for automatic scraping...');
        
        // Open the PGA Tour odds page in a new window
        const pgaTourWindow = window.open(
            'https://www.pgatour.com/tournaments/2025/tour-championship/R2025060/odds',
            'pgaTourOdds',
            'width=1200,height=800,scrollbars=yes,resizable=yes'
        );
        
        if (!pgaTourWindow) {
            throw new Error('Popup blocked - please allow popups for this site');
        }
        
        // Wait for the page to load
        console.log('Waiting for PGA Tour page to load...');
        
        return new Promise((resolve) => {
            // Create a communication system
            const messageHandler = (event) => {
                if (event.origin !== window.location.origin) return;
                
                if (event.data.type === 'ODDS_EXTRACTED') {
                    console.log('Received odds data from PGA Tour page:', event.data.odds);
                    
                    if (event.data.odds && Object.keys(event.data.odds).length > 3) {
                        this.applyOddsUpdate(event.data.odds);
                        window.removeEventListener('message', messageHandler);
                        pgaTourWindow.close();
                        resolve(true);
                    } else {
                        console.log('No valid odds data received');
                        window.removeEventListener('message', messageHandler);
                        resolve(false);
                    }
                }
            };
            
            window.addEventListener('message', messageHandler);
            
            // Inject the extraction script after page loads
            pgaTourWindow.addEventListener('load', () => {
                setTimeout(() => {
                    this.injectExtractionScript(pgaTourWindow);
                }, 3000); // Wait 3 seconds for content to load
            });
            
            // Timeout after 15 seconds
            setTimeout(() => {
                console.log('Auto-scraping timeout');
                window.removeEventListener('message', messageHandler);
                if (!pgaTourWindow.closed) {
                    pgaTourWindow.close();
                }
                resolve(false);
            }, 15000);
        });
    }

    injectExtractionScript(targetWindow) {
        try {
            console.log('Injecting odds extraction script...');
            
            const script = `
                console.log('🏆 PGA Tour Odds Extractor Started');
                
                const golfers = ${JSON.stringify(Object.keys(this.golferOdds))};
                const extractedOdds = {};
                let foundCount = 0;
                
                // Method 1: Search in page text
                const pageText = document.body.innerText || document.body.textContent || '';
                console.log('Searching in page text...');
                
                golfers.forEach(golfer => {
                    const patterns = [
                        new RegExp(golfer + '.*?\\\\+(\\\\d{3,5})', 'gi'),
                        new RegExp('\\\\+(\\\\d{3,5}).*?' + golfer, 'gi'),
                        new RegExp(golfer.replace(' ', '.*?') + '.*?\\\\+(\\\\d{3,5})', 'gi')
                    ];
                    
                    patterns.forEach(pattern => {
                        const matches = [...pageText.matchAll(pattern)];
                        if (matches.length > 0 && !extractedOdds[golfer]) {
                            const odds = parseInt(matches[0][1]);
                            if (odds >= 100 && odds <= 100000) {
                                extractedOdds[golfer] = odds;
                                foundCount++;
                                console.log('✅ Found', golfer, '+' + odds);
                            }
                        }
                    });
                });
                
                // Method 2: Search in DOM elements
                if (foundCount < 5) {
                    console.log('Trying DOM element search...');
                    const allElements = document.querySelectorAll('*');
                    
                    allElements.forEach(el => {
                        const text = el.textContent || '';
                        const oddsMatch = text.match(/\\+(\\d{3,5})/);
                        
                        if (oddsMatch && text.length < 100) {
                            golfers.forEach(golfer => {
                                if (text.toLowerCase().includes(golfer.toLowerCase()) && !extractedOdds[golfer]) {
                                    const odds = parseInt(oddsMatch[1]);
                                    if (odds >= 100 && odds <= 100000) {
                                        extractedOdds[golfer] = odds;
                                        foundCount++;
                                        console.log('✅ DOM Found', golfer, '+' + odds);
                                    }
                                }
                            });
                        }
                    });
                }
                
                console.log('🏆 Extraction complete:', foundCount, 'golfers found');
                console.log('Extracted odds:', extractedOdds);
                
                // Send data back to parent window
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'ODDS_EXTRACTED',
                        odds: extractedOdds,
                        count: foundCount
                    }, window.opener.location.origin);
                    
                    // Show success message on the page
                    const successDiv = document.createElement('div');
                    successDiv.style.cssText = \`
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: #27ae60;
                        color: white;
                        padding: 15px;
                        border-radius: 8px;
                        z-index: 10000;
                        font-family: Arial, sans-serif;
                        font-weight: bold;
                    \`;
                    successDiv.textContent = \`✅ Extracted \${foundCount} golfer odds! Window will close automatically...\`;
                    document.body.appendChild(successDiv);
                    
                    setTimeout(() => window.close(), 3000);
                }
            `;
            
            // Execute script in the target window
            targetWindow.eval(script);
            
        } catch (error) {
            console.error('Failed to inject script:', error);
        }
    }

    async simulateOddsUpdate() {
        console.log('Running simulated odds update for testing...');
        console.log('Current odds before simulation:', JSON.stringify(this.golferOdds, null, 2));
        
        // Simulate getting SIGNIFICANTLY different odds (for testing purposes)
        const simulatedOdds = {
            "Viktor Hovland": 1800,        // Much better odds (was 3000)
            "Rory McIlroy": 1200,          // Worse odds (was 850)
            "Patrick Cantlay": 3500,       // Much worse odds (was 2300)
            "Collin Morikawa": 2000,       // Better odds (was 2900)
            "Tommy Fleetwood": 2500,       // Worse odds (was 1500)
            "Russell Henley": 1800,        // Better odds (was 2300)
            "Ludvig Åberg": 2200,          // Worse odds (was 1300)
            "Sungjae Im": 3200,            // Much worse odds (was 2200)
            "Brian Harman": 9000,          // Much worse odds (was 7000)
            "J.J. Spaun": 1800,            // Much better odds (was 2800)
            "Ben Griffin": 2500,           // Much better odds (was 4000)
            "Maverick McNealy": 2500,      // Much better odds (was 4000)
        };
        
        // Wait a bit to simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Applying simulated odds:', JSON.stringify(simulatedOdds, null, 2));
        const success = this.applyOddsUpdate(simulatedOdds);
        console.log('Simulation complete, changes applied:', success);
        
        return success;
    }

    applyOddsUpdate(newOdds) {
        let updateCount = 0;
        console.log('=== APPLYING ODDS UPDATES ===');
        
        Object.keys(newOdds).forEach(golfer => {
            if (this.golferOdds[golfer]) {
                const oldOdds = this.golferOdds[golfer];
                const newOddsValue = newOdds[golfer];
                
                if (oldOdds !== newOddsValue) {
                    console.log(`✅ ${golfer}: ${oldOdds} → ${newOddsValue} (${newOddsValue > oldOdds ? '+' : ''}${newOddsValue - oldOdds})`);
                    this.golferOdds[golfer] = newOddsValue;
                    updateCount++;
                } else {
                    console.log(`➖ ${golfer}: ${oldOdds} (no change)`);
                }
            } else {
                console.log(`❌ ${golfer}: not found in current odds`);
            }
        });
        
        console.log(`=== SUMMARY: Applied ${updateCount} odds updates ===`);
        
        if (updateCount > 0) {
            console.log('Updated golfer odds:', JSON.stringify(this.golferOdds, null, 2));
        }
        
        return updateCount > 0;
    }

    parseOddsFromHTML(htmlContent) {
        try {
            // Create a temporary DOM to parse HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            const oddsData = {};
            
            // Look for odds patterns
            const textContent = doc.body.textContent || '';
            
            // Define golfer list for matching
            const golfers = Object.keys(this.golferOdds);
            
            golfers.forEach(golfer => {
                // Look for patterns like "Viktor Hovland +2800" or "+2800 Viktor Hovland"
                const patterns = [
                    new RegExp(golfer + '.*?\\+(\\d{3,5})', 'i'),
                    new RegExp('\\+(\\d{3,5}).*?' + golfer, 'i')
                ];
                
                patterns.forEach(pattern => {
                    const match = textContent.match(pattern);
                    if (match && match[1]) {
                        const odds = parseInt(match[1]);
                        if (odds >= 100 && odds <= 100000) {
                            oddsData[golfer] = odds;
                        }
                    }
                });
            });
            
            return oddsData;
        } catch (error) {
            console.error('Error parsing HTML:', error);
            return {};
        }
    }

    showUpdateSuccess(message = '✅ Odds updated successfully!') {
        // Create a temporary success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
        `;
        successMsg.textContent = message;
        
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            if (document.body.contains(successMsg)) {
                document.body.removeChild(successMsg);
            }
        }, 3000);
    }

    parsePastedOddsContent(pastedContent) {
        console.log('=== PARSING PASTED CONTENT ===');
        const oddsData = {};
        const golfers = Object.keys(this.golferOdds);
        
        console.log('Searching for golfers:', golfers);
        console.log('Content preview:', pastedContent.substring(0, 500) + '...');
        
        // Detect if this is mobile format based on structure
        const isMobileFormat = this.detectMobileFormat(pastedContent);
        console.log('Mobile format detected:', isMobileFormat);
        
        if (isMobileFormat) {
            return this.parseMobileFormat(pastedContent, golfers);
        } else {
            return this.parseDesktopFormat(pastedContent, golfers);
        }
    }

    detectMobileFormat(content) {
        // Mobile format indicators:
        // - Has "PLAYER" and "ODDS" headers
        // - Has "POS" column
        // - Names appear on separate lines from odds
        // - Times like "12:49 PM" present
        const mobileIndicators = [
            /\bPLAYER\b/i,
            /\bODDS\b/i,
            /\bPOS\b/i,
            /\d{1,2}:\d{2}\s*[AP]M/i  // Time format like "12:49 PM"
        ];
        
        const matches = mobileIndicators.filter(pattern => pattern.test(content));
        return matches.length >= 2; // Need at least 2 indicators
    }

    parseMobileFormat(pastedContent, golfers) {
        console.log('=== PARSING MOBILE FORMAT ===');
        const oddsData = {};
        
        // Split content into lines and clean them
        const lines = pastedContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        // In mobile format, we need to look for patterns where:
        // - Player name appears on one line
        // - Odds appears a few lines later with +number format
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Check if this line contains a golfer name
            golfers.forEach(golfer => {
                if (oddsData[golfer]) return; // Already found
                
                // Check if line matches golfer (handle abbreviated names)
                if (this.matchesGolferName(line, golfer)) {
                    console.log(`\n--- Found golfer line: "${line}" matches ${golfer} ---`);
                    
                    // Look for odds in the next few lines
                    for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
                        const oddsLine = lines[j];
                        const oddsMatch = oddsLine.match(/\+(\d{3,5})\b/);
                        
                        if (oddsMatch) {
                            const odds = parseInt(oddsMatch[1]);
                            if (odds >= 100 && odds <= 100000) {
                                oddsData[golfer] = odds;
                                console.log(`  ✅ FOUND: ${golfer} = +${odds} (line ${j}: "${oddsLine}")`);
                                break;
                            }
                        }
                    }
                }
            });
        }
        
        console.log('=== MOBILE PARSING COMPLETE ===');
        console.log('Total found:', Object.keys(oddsData).length);
        console.log('Results:', oddsData);
        
        return oddsData;
    }

    matchesGolferName(line, golfer) {
        // Handle various name formats in mobile:
        // - "R. McIlroy" matches "Rory McIlroy"
        // - "T. Fleetwood" matches "Tommy Fleetwood" 
        // - "L. Åberg" matches "Ludvig Åberg"
        // - "Cam. Young" matches "Cameron Young"
        
        const cleanLine = line.toLowerCase().replace(/[^\w\s.-]/g, '').trim();
        const cleanGolfer = golfer.toLowerCase().replace(/[^\w\s.-]/g, '').trim();
        
        // Direct match
        if (cleanLine === cleanGolfer) return true;
        
        // Split names for analysis
        const lineParts = cleanLine.split(/\s+/);
        const golferParts = cleanGolfer.split(/\s+/);
        
        if (golferParts.length < 2) return false; // Need at least first and last name
        
        const [golferFirst, ...golferRest] = golferParts;
        const golferLast = golferRest.join(' ');
        
        // Check abbreviated first name patterns
        for (const part of lineParts) {
            // Pattern: "R. McIlroy" or "Cam. Young"
            if (part.includes('.')) {
                const abbrev = part.replace('.', '').toLowerCase();
                const restOfLine = lineParts.filter(p => p !== part).join(' ');
                
                // Check if abbreviation matches first name and rest matches last name
                if (golferFirst.startsWith(abbrev) && restOfLine === golferLast) {
                    return true;
                }
            }
        }
        
        // Check last name only match (for cases where first name is very abbreviated)
        if (lineParts.some(part => part === golferLast || part.replace('.', '') === golferLast)) {
            return true;
        }
        
        // Special handling for common abbreviations
        const abbreviationMap = {
            'cam': 'cameron',
            'j': 'justin',
            'r': 'rory',
            't': 'tommy',
            'l': 'ludvig',
            'v': 'viktor',
            'p': 'patrick',
            'c': 'collin',
            's': 'scottie',
            'h': 'hideki',
            'k': 'keegan',
            'm': 'maverick',
            'b': 'ben',
            'a': 'akshay'
        };
        
        // Try abbreviation matching
        for (const [abbrev, fullName] of Object.entries(abbreviationMap)) {
            if (cleanLine.includes(abbrev + '.') || cleanLine.includes(abbrev + ' ')) {
                if (golferFirst.startsWith(fullName) && cleanLine.includes(golferLast)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    parseDesktopFormat(pastedContent, golfers) {
        console.log('=== PARSING DESKTOP FORMAT ===');
        const oddsData = {};
        
        // Clean up the content - remove extra whitespace and normalize
        const cleanContent = pastedContent
            .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
            .replace(/\n+/g, ' ')  // Replace newlines with spaces
            .trim();
        
        // Multiple parsing strategies
        golfers.forEach(golfer => {
            console.log(`\n--- Searching for: ${golfer} ---`);
            
            // Strategy 1: Look for "Golfer Name +odds" patterns
            const patterns = [
                // Direct pattern: "Viktor Hovland +2800" or "Viktor Hovland+2800"
                new RegExp(golfer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\+?(\\d{3,5})\\b', 'gi'),
                
                // Reverse pattern: "+2800 Viktor Hovland" or "2800 Viktor Hovland"
                new RegExp('\\+?(\\d{3,5})\\s+' + golfer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
                
                // Flexible pattern with possible text in between (up to 20 chars)
                new RegExp(golfer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '.{0,20}?\\+?(\\d{3,5})\\b', 'gi'),
                
                // Split name pattern for "First Last" -> look for "Last.{0,20}+odds"  
                new RegExp(golfer.split(' ').pop().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '.{0,30}?\\+?(\\d{3,5})\\b', 'gi')
            ];
            
            let found = false;
            for (let i = 0; i < patterns.length && !found; i++) {
                console.log(`  Pattern ${i + 1}:`, patterns[i].toString());
                const matches = [...cleanContent.matchAll(patterns[i])];
                
                if (matches.length > 0) {
                    const odds = parseInt(matches[0][1]);
                    if (odds >= 100 && odds <= 100000) {  // Reasonable odds range
                        oddsData[golfer] = odds;
                        console.log(`  ✅ FOUND: ${golfer} = +${odds} (pattern ${i + 1})`);
                        found = true;
                    } else {
                        console.log(`  ❌ Invalid odds range: ${odds}`);
                    }
                } else {
                    console.log(`  ❌ No matches for pattern ${i + 1}`);
                }
            }
            
            if (!found) {
                console.log(`  ❌ NOT FOUND: ${golfer}`);
            }
        });
        
        console.log('=== DESKTOP PARSING COMPLETE ===');
        console.log('Total found:', Object.keys(oddsData).length);
        console.log('Results:', oddsData);
        
        return oddsData;
    }

    showSimplifiedOddsPaster() {
        // Create a simplified dialog that matches the user's image
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: #2c3e50;
            color: white;
            padding: 30px;
            border-radius: 15px;
            width: 500px;
            max-width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;
        
        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="color: #4ade80; margin: 0; font-size: 20px; font-weight: 600;">Manual Odds Paster</h2>
                <button id="closeSimplePaster" style="
                    background: none;
                    border: none;
                    color: #94a3b8;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">×</button>
            </div>
            
            <div style="margin-bottom: 25px;">
                <p style="color: #e2e8f0; margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">
                    <strong>Instructions:</strong>
                </p>
                <ol style="color: #cbd5e1; margin: 0 0 20px 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                    <li>Open a new tab and go to: <a href="https://www.pgatour.com/tournaments/2025/tour-championship/R2025060/odds" target="_blank" style="color: #60a5fa; text-decoration: none;">PGA Tour Championship Odds</a></li>
                    <li><strong>Select all the content</strong> on the page (<kbd style="background: #374151; padding: 2px 6px; border-radius: 3px; font-size: 12px;">Ctrl + A</kbd> or <kbd style="background: #374151; padding: 2px 6px; border-radius: 3px; font-size: 12px;">Cmd + A</kbd>)</li>
                    <li><strong>Copy it</strong> (<kbd style="background: #374151; padding: 2px 6px; border-radius: 3px; font-size: 12px;">Ctrl + C</kbd> or <kbd style="background: #374151; padding: 2px 6px; border-radius: 3px; font-size: 12px;">Cmd + C</kbd>)</li>
                    <li><strong>Paste it in the text area below</strong></li>
                    <li>Click "Parse & Update Odds"</li>
                </ol>
                <p style="color: #94a3b8; margin: 0; font-size: 13px; font-style: italic;">
                    📱 Works with both desktop and mobile formats! Mobile names like "R. McIlroy" will automatically match "Rory McIlroy".
                </p>
            </div>
            
            <div style="margin-bottom: 25px;">
                <textarea id="simpleOddsText" placeholder="Paste odds here..." style="
                    width: 100%;
                    height: 200px;
                    padding: 15px;
                    border: 2px solid #4a5568;
                    border-radius: 8px;
                    background: #1e293b;
                    color: #e2e8f0;
                    font-family: 'Monaco', 'Menlo', monospace;
                    font-size: 12px;
                    resize: vertical;
                    box-sizing: border-box;
                    outline: none;
                " placeholder="Paste odds here..."></textarea>
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: flex-end;">
                <button id="cancelSimplePaster" style="
                    background: #64748b;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                ">
                    Cancel
                </button>
                
                <button id="parseAndUpdateButton" style="
                    background: #4ade80;
                    color: #1e293b;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                ">
                    Parse & Update Odds
                </button>
            </div>
        `;
        
        // Add event listeners
        const textarea = content.querySelector('#simpleOddsText');
        const parseButton = content.querySelector('#parseAndUpdateButton');
        const cancelButton = content.querySelector('#cancelSimplePaster');
        const closeButton = content.querySelector('#closeSimplePaster');
        
        const closeModal = () => {
            document.body.removeChild(modal);
        };
        
        cancelButton.addEventListener('click', closeModal);
        closeButton.addEventListener('click', closeModal);
        
        parseButton.addEventListener('click', async () => {
            const pastedContent = textarea.value.trim();
            
            if (!pastedContent) {
                // Show error styling on textarea
                textarea.style.border = '2px solid #ef4444';
                setTimeout(() => {
                    textarea.style.border = '2px solid #4a5568';
                }, 2000);
                return;
            }
            
            // Show loading state
            parseButton.disabled = true;
            parseButton.textContent = '🔍 Parsing & Updating...';
            parseButton.style.background = '#94a3b8';
            
            console.log('Parsing and updating odds automatically...');
            
            // Parse the content
            const extractedOdds = this.parsePastedOddsContent(pastedContent);
            const foundCount = Object.keys(extractedOdds).length;
            
            if (foundCount > 0) {
                console.log(`Found ${foundCount} golfer odds, applying updates...`);
                
                if (this.applyOddsUpdate(extractedOdds)) {
                    // Success - update the app and close modal
                    this.renderLeaderboard();
                    this.updateLastUpdatedTime();
                    
                    closeModal();
                    this.showUpdateSuccess(`Updated ${foundCount} golfer odds!`);
                } else {
                    // No changes applied
                    parseButton.disabled = false;
                    parseButton.textContent = 'Parse & Update Odds';
                    parseButton.style.background = '#4ade80';
                    
                    // Show temporary message
                    const originalText = parseButton.textContent;
                    parseButton.textContent = `No Changes (${foundCount} found)`;
                    parseButton.style.background = '#f59e0b';
                    setTimeout(() => {
                        parseButton.textContent = originalText;
                        parseButton.style.background = '#4ade80';
                    }, 3000);
                }
            } else {
                // No odds found
                parseButton.disabled = false;
                parseButton.textContent = 'Parse & Update Odds';
                parseButton.style.background = '#4ade80';
                
                // Show error message
                const originalText = parseButton.textContent;
                parseButton.textContent = '❌ No Golfer Odds Found';
                parseButton.style.background = '#ef4444';
                setTimeout(() => {
                    parseButton.textContent = originalText;
                    parseButton.style.background = '#4ade80';
                }, 3000);
                
                // Also highlight textarea
                textarea.style.border = '2px solid #ef4444';
                setTimeout(() => {
                    textarea.style.border = '2px solid #4a5568';
                }, 3000);
            }
        });
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Focus on textarea for immediate pasting
        setTimeout(() => textarea.focus(), 100);
    }

    showCopyPasteDialog() {
        // Create a dialog for copying and pasting odds content
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            color: #333;
            padding: 30px;
            border-radius: 15px;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
        `;
        
        content.innerHTML = `
            <h2 style="color: #28a745; margin-bottom: 20px;">📝 Copy & Paste Odds Update</h2>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #c3e6cb;">
                <h3 style="margin-top: 0; color: #333;">Instructions:</h3>
                <ol style="margin: 10px 0; padding-left: 20px;">
                    <li>Open a new tab and go to: <a href="https://www.pgatour.com/tournaments/2025/tour-championship/R2025060/odds" target="_blank" style="color: #3498db;">PGA Tour Championship Odds</a></li>
                    <li><strong>Select all the content</strong> on the page (Ctrl+A or Cmd+A)</li>
                    <li><strong>Copy it</strong> (Ctrl+C or Cmd+C)</li>
                    <li><strong>Paste it</strong> in the text area below</li>
                    <li>Click "Parse & Update Odds"</li>
                </ol>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label for="oddsText" style="display: block; margin-bottom: 10px; font-weight: bold;">
                    Paste PGA Tour odds page content here:
                </label>
                <textarea id="oddsText" style="
                    width: 100%;
                    height: 300px;
                    padding: 15px;
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    font-family: monospace;
                    font-size: 12px;
                    resize: vertical;
                    box-sizing: border-box;
                " placeholder="Paste the entire PGA Tour odds page content here...

Example content might look like:
Viktor Hovland +2800
Rory McIlroy +850  
Patrick Cantlay +2300
..."></textarea>
            </div>
            
            <div id="parseResults" style="
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
                display: none;
                max-height: 200px;
                overflow-y: auto;
            ">
                <h4 style="margin-top: 0; color: #333;">Parsing Results:</h4>
                <div id="resultsContent"></div>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: space-between;">
                <div>
                    <button id="parseButton" style="
                        background: #28a745;
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 14px;
                    ">
                        🔍 Parse & Update Odds
                    </button>
                    
                    <button id="clearButton" style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 12px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-left: 10px;
                    ">
                        Clear
                    </button>
                </div>
                
                <button id="closePasteDialog" style="
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">
                    Cancel
                </button>
            </div>
        `;
        
        // Add event listeners
        const textarea = content.querySelector('#oddsText');
        const parseButton = content.querySelector('#parseButton');
        const clearButton = content.querySelector('#clearButton');
        const closeButton = content.querySelector('#closePasteDialog');
        const parseResults = content.querySelector('#parseResults');
        const resultsContent = content.querySelector('#resultsContent');
        
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        clearButton.addEventListener('click', () => {
            textarea.value = '';
            parseResults.style.display = 'none';
        });
        
        parseButton.addEventListener('click', () => {
            const pastedContent = textarea.value.trim();
            
            if (!pastedContent) {
                alert('Please paste some content from the PGA Tour odds page first!');
                return;
            }
            
            console.log('Parsing pasted content...');
            console.log('Content length:', pastedContent.length);
            
            // Parse the pasted content
            const extractedOdds = this.parsePastedOddsContent(pastedContent);
            
            // Show results
            const foundCount = Object.keys(extractedOdds).length;
            parseResults.style.display = 'block';
            
            if (foundCount > 0) {
                resultsContent.innerHTML = `
                    <p style="color: #28a745; font-weight: bold;">✅ Found ${foundCount} golfer odds:</p>
                    <ul style="margin: 10px 0; padding-left: 20px; max-height: 100px; overflow-y: auto;">
                        ${Object.entries(extractedOdds).map(([golfer, odds]) => 
                            `<li><strong>${golfer}</strong>: +${odds}</li>`
                        ).join('')}
                    </ul>
                    <button id="applyParsedOdds" style="
                        background: #007bff;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                        margin-top: 10px;
                    ">
                        ✅ Apply These Odds
                    </button>
                `;
                
                // Add apply button functionality
                content.querySelector('#applyParsedOdds').addEventListener('click', () => {
                    console.log('Applying parsed odds:', extractedOdds);
                    
                    if (this.applyOddsUpdate(extractedOdds)) {
                        document.body.removeChild(modal);
                        this.renderLeaderboard();
                        this.updateLastUpdatedTime();
                        this.showUpdateSuccess();
                    } else {
                        alert('No odds changes were applied. The parsed odds might be the same as current ones.');
                    }
                });
            } else {
                resultsContent.innerHTML = `
                    <p style="color: #e74c3c; font-weight: bold;">❌ No golfer odds found in the pasted content.</p>
                    <p style="color: #666; font-size: 14px;">
                        Make sure you copied the entire PGA Tour odds page content, including the golfer names and their odds (like "+2800").
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        Looking for golfers: ${Object.keys(this.golferOdds).slice(0, 3).join(', ')}...
                    </p>
                `;
            }
        });
        
        modal.appendChild(content);
        document.body.appendChild(modal);
    }

    showManualUpdateGuide() {
        // Show a modal with manual update instructions
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            color: #333;
            padding: 30px;
            border-radius: 15px;
            max-width: 700px;
            max-height: 85vh;
            overflow-y: auto;
        `;
        
        content.innerHTML = `
            <h2 style="color: #e74c3c; margin-bottom: 20px;">📋 Odds Update Options</h2>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #c3e6cb;">
                <strong>📝 Copy & Paste Update (Easy):</strong> Copy content from PGA Tour and paste it below.
                <br><button id="copyPaste" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                    📝 Copy & Paste Odds
                </button>
                <small style="display: block; margin-top: 5px; color: #666;">
                    Just copy the entire odds page content and paste it in the dialog.
                </small>
            </div>
            
            <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #bee5eb;">
                <strong>🚀 Auto-Scrape:</strong> Opens PGA Tour odds page and automatically extracts data.
                <br><button id="autoScrape" style="background: #17a2b8; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                    🚀 Auto-Scrape PGA Tour Odds
                </button>
                <small style="display: block; margin-top: 5px; color: #666;">
                    Note: Please allow popups if browser blocks the new window.
                </small>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #ffeaa7;">
                <strong>🧪 For Testing:</strong> Click the button below to simulate an odds update with different values.
                <br><button id="testUpdate" style="background: #27ae60; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                    Test Odds Update
                </button>
            </div>
            
            <details style="margin-bottom: 20px;">
                <summary style="cursor: pointer; font-weight: bold; color: #333;">Advanced Manual Method (Developer Console)</summary>
                <div style="padding-top: 15px;">
                    <p><strong>Step 1:</strong> Open a new tab and go to:<br>
                    <a href="https://www.pgatour.com/tournaments/2025/tour-championship/R2025060/odds" target="_blank" style="color: #3498db;">
                    PGA Tour Championship Odds →
                    </a></p>
                    
                    <p><strong>Step 2:</strong> Press F12 to open Developer Tools</p>
                    
                    <p><strong>Step 3:</strong> Click Console tab and paste this code:</p>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; font-family: monospace; font-size: 11px; overflow-x: auto; border: 1px solid #dee2e6;">
const golfers = ${JSON.stringify(Object.keys(this.golferOdds))};
const odds = {};
const pageText = document.body.innerText;

golfers.forEach(golfer => {
    const patterns = [
        new RegExp(golfer + '.*?\\\\+(\\\\d{3,5})', 'gi'),
        new RegExp('\\\\+(\\\\d{3,5}).*?' + golfer, 'gi')
    ];
    
    patterns.forEach(pattern => {
        const matches = [...pageText.matchAll(pattern)];
        if (matches.length > 0) {
            odds[golfer] = parseInt(matches[0][1]);
        }
    });
});

console.log('🏆 EXTRACTED ODDS:');
console.log(JSON.stringify(odds, null, 2));
                    </div>
                    
                    <p><strong>Step 4:</strong> Copy the extracted data and replace the odds in your script-simple.js file</p>
                </div>
            </details>
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button id="closeModal" style="background: #e74c3c; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                    Close
                </button>
                <button id="copyScript" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                    Copy Script
                </button>
            </div>
        `;
        
        content.querySelector('#closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Add copy-paste functionality
        const copyPasteBtn = content.querySelector('#copyPaste');
        if (copyPasteBtn) {
            copyPasteBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
                this.showCopyPasteDialog();
            });
        }

        // Debug: Check if autoScrape button exists
        const autoScrapeBtn = content.querySelector('#autoScrape');
        console.log('Auto-scrape button found:', !!autoScrapeBtn);
        
        if (autoScrapeBtn) {
            autoScrapeBtn.addEventListener('click', async () => {
                document.body.removeChild(modal);
                
                try {
                    const success = await this.autoScrapePGATour();
                    if (success) {
                        this.renderLeaderboard();
                        this.updateLastUpdatedTime();
                        this.showUpdateSuccess();
                    } else {
                        throw new Error('Auto-scraping failed');
                    }
                } catch (error) {
                    console.error('Auto-scrape error:', error);
                    const errorMsg = document.createElement('div');
                    errorMsg.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: #e74c3c;
                        color: white;
                        padding: 15px 25px;
                        border-radius: 8px;
                        font-weight: 600;
                        z-index: 1000;
                    `;
                    errorMsg.textContent = '❌ Auto-scraping failed. Please try manual method.';
                    document.body.appendChild(errorMsg);
                    
                    setTimeout(() => {
                        if (document.body.contains(errorMsg)) {
                            document.body.removeChild(errorMsg);
                        }
                    }, 5000);
                }
            });
        } else {
            console.error('Auto-scrape button not found in modal!');
        }

        content.querySelector('#testUpdate').addEventListener('click', async () => {
            document.body.removeChild(modal);
            
            // Show loading message
            const loadingMsg = document.createElement('div');
            loadingMsg.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #3498db;
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                font-weight: 600;
                z-index: 1000;
            `;
            loadingMsg.textContent = '🧪 Running test update...';
            document.body.appendChild(loadingMsg);
            
            // Run the simulated update
            await this.simulateOddsUpdate();
            this.renderLeaderboard();
            this.updateLastUpdatedTime();
            
            // Remove loading message and show success
            setTimeout(() => {
                document.body.removeChild(loadingMsg);
                this.showUpdateSuccess();
            }, 1000);
        });

        content.querySelector('#copyScript').addEventListener('click', () => {
            const scriptText = `const golfers = ${JSON.stringify(Object.keys(this.golferOdds))};
const odds = {};
const pageText = document.body.innerText;

golfers.forEach(golfer => {
    const patterns = [
        new RegExp(golfer + '.*?\\\\+(\\\\d{3,5})', 'gi'),
        new RegExp('\\\\+(\\\\d{3,5}).*?' + golfer, 'gi')
    ];
    
    patterns.forEach(pattern => {
        const matches = [...pageText.matchAll(pattern)];
        if (matches.length > 0) {
            odds[golfer] = parseInt(matches[0][1]);
        }
    });
});

console.log('🏆 EXTRACTED ODDS:');
console.log(JSON.stringify(odds, null, 2));`;
            
            navigator.clipboard.writeText(scriptText).then(() => {
                const copyBtn = content.querySelector('#copyScript');
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✅ Copied!';
                copyBtn.style.background = '#27ae60';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = '#3498db';
                }, 2000);
            }).catch(err => {
                alert('Please copy the script manually from the box above.');
            });
        });
        
        modal.appendChild(content);
        document.body.appendChild(modal);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    window.tourApp = new TourChampionshipApp();
    
    // Add tournament start button
    setTimeout(() => {
        const header = document.querySelector('.header');
        if (header) {
            const startButton = document.createElement('button');
            startButton.textContent = 'START TOURNAMENT (Test)';
            startButton.style.cssText = `
                margin-top: 20px;
                padding: 10px 20px;
                background: #27ae60;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
            `;
            startButton.addEventListener('click', () => {
                window.tourApp.startTournament();
                startButton.remove();
            });
            header.appendChild(startButton);
        }
    }, 1000);
});

console.log('Script loaded successfully!');