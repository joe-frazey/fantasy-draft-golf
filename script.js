// Fantasy Football Draft Order - Tour Championship App
class TourChampionshipApp {
    constructor() {
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

        this.golferOdds = {};
        this.golferScores = {};
        this.previousRankings = [];
        this.tournamentStarted = false;
        this.isLocked = false;
        this.updateInterval = null;
        this.oddsUpdateInterval = null;
        
        // API Configuration
        this.API_KEY = null; // Set this to your The-Odds-API key (optional)
        this.TOURNAMENT_SPORT = 'golf';
        this.API_BASE_URL = 'https://api.the-odds-api.com/v4';
        this.PGA_TOUR_ODDS_URL = 'https://www.pgatour.com/tournaments/2025/tour-championship/R2025060/odds';
        this.USE_PGA_TOUR_ODDS = true; // Set to false to use The Odds API instead
        
        this.initializeApp().catch(error => {
            console.error('Initialization error:', error);
            // Fallback initialization
            this.initializeFallbackData();
            this.setupLockButton();
            this.renderLeaderboard();
            this.updateLastUpdatedTime();
        });
    }

    async initializeApp() {
        await this.initializeOddsData();
        this.setupLockButton();
        this.renderLeaderboard();
        this.updateLastUpdatedTime();
        this.startOddsUpdates();
    }

    // Fallback initialization with static data
    initializeFallbackData() {
        console.log('Using fallback data initialization...');
        
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
            "Ben Griffin": 4000,           // Updated from 40000          // No change
            "Maverick McNealy": 4000,      // Updated from 30000     // No change
            "Hideki Matsuyama": 5500,      // No change
            "Akshay Bhatia": 20000,        // No change
            "Justin Thomas": 3300,         // Updated from 4000
            "Cameron Young": 10000,        // No change
            "Collin Morikawa": 2900,       // Updated from 1200
            "Sam Burns": 4700,             // Updated from 6000
            "Justin Rose": 15000,          // No change
            "Sepp Straka": 50000           // No change
        };

        // Initialize empty scores
        this.golferScores = {};
        Object.keys(this.golferOdds).forEach(golfer => {
            this.golferScores[golfer] = { score: 0, thru: "--" };
        });
    }

    // Initialize with live odds data
    async initializeOddsData() {
        // Current 2025 Tour Championship odds (Updated August 2025)
        const fallbackOdds = {
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
            "Ben Griffin": 4000,           // Updated from 40000          // No change
            "Maverick McNealy": 4000,      // Updated from 30000     // No change
            "Hideki Matsuyama": 5500,      // No change
            "Akshay Bhatia": 20000,        // No change
            "Justin Thomas": 3300,         // Updated from 4000
            "Cameron Young": 10000,        // No change
            "Collin Morikawa": 2900,       // Updated from 1200
            "Sam Burns": 4700,             // Updated from 6000
            "Justin Rose": 15000,          // No change
            "Sepp Straka": 50000           // No change
        };

        // Try to fetch live odds, use fallback if fails
        try {
            let liveOdds = null;
            
            if (this.USE_PGA_TOUR_ODDS) {
                liveOdds = await this.fetchPGATourOdds();
            } else {
                liveOdds = await this.fetchLiveOdds();
            }
            
            this.golferOdds = liveOdds || fallbackOdds;
        } catch (error) {
            console.warn('Failed to fetch live odds, using fallback data:', error);
            this.golferOdds = fallbackOdds;
        }

        // Initialize empty scores (tournament hasn't started)
        this.golferScores = {};
        Object.keys(this.golferOdds).forEach(golfer => {
            this.golferScores[golfer] = { score: 0, thru: "--" };
        });
    }

    // Fetch odds from PGA Tour official website
    async fetchPGATourOdds() {
        try {
            console.log('Fetching odds from PGA Tour website...');
            
            // Due to CORS restrictions, we'll use a proxy service
            // You can use services like allorigins.win or cors-anywhere
            const proxyUrl = 'https://api.allorigins.win/get?url=';
            const targetUrl = encodeURIComponent(this.PGA_TOUR_ODDS_URL);
            const url = proxyUrl + targetUrl;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch PGA Tour odds: ${response.status}`);
            }
            
            const data = await response.json();
            const htmlContent = data.contents;
            
            // Parse the HTML to extract odds data
            const oddsData = this.parsePGATourOddsHTML(htmlContent);
            
            if (oddsData && Object.keys(oddsData).length > 0) {
                console.log('Successfully parsed PGA Tour odds:', Object.keys(oddsData).length, 'golfers');
                return oddsData;
            } else {
                console.warn('No odds data found in PGA Tour response');
                return null;
            }
            
        } catch (error) {
            console.error('Error fetching PGA Tour odds:', error);
            
            // Fallback: try to extract odds manually from the page
            return await this.manualOddsExtraction();
        }
    }

    // Parse HTML content to extract odds
    parsePGATourOddsHTML(htmlContent) {
        const oddsData = {};
        
        try {
            // Create a temporary DOM parser
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            
            // Look for common odds patterns in PGA Tour pages
            // These selectors may need adjustment based on actual page structure
            const oddsElements = doc.querySelectorAll('[class*="odds"], [class*="betting"], [data-odds], .player-odds, .odds-value');
            
            oddsElements.forEach(element => {
                const text = element.textContent || element.innerText;
                const oddsMatch = text.match(/([+-]\\d+)/);
                
                if (oddsMatch) {
                    const odds = Math.abs(parseInt(oddsMatch[1]));
                    
                    // Try to find associated golfer name
                    const golferElement = this.findGolferNameElement(element);
                    if (golferElement) {
                        const golferName = this.cleanGolferName(golferElement.textContent);
                        
                        // Match to our team golfers
                        Object.keys(this.teams.reduce((acc, team) => {
                            acc[team.golfer1] = true;
                            acc[team.golfer2] = true;
                            return acc;
                        }, {})).forEach(teamGolfer => {
                            if (this.fuzzyMatchGolferName(teamGolfer, golferName)) {
                                oddsData[teamGolfer] = odds;
                            }
                        });
                    }
                }
            });
            
            return oddsData;
            
        } catch (error) {
            console.error('Error parsing PGA Tour HTML:', error);
            return {};
        }
    }

    // Helper to find golfer name element near odds
    findGolferNameElement(oddsElement) {
        // Look in parent elements, siblings, and nearby elements
        let current = oddsElement;
        
        for (let i = 0; i < 3; i++) {
            // Check siblings
            if (current.previousElementSibling) {
                const text = current.previousElementSibling.textContent;
                if (this.looksLikeGolferName(text)) {
                    return current.previousElementSibling;
                }
            }
            
            if (current.nextElementSibling) {
                const text = current.nextElementSibling.textContent;
                if (this.looksLikeGolferName(text)) {
                    return current.nextElementSibling;
                }
            }
            
            // Move up to parent
            current = current.parentElement;
            if (!current) break;
        }
        
        return null;
    }

    // Check if text looks like a golfer name
    looksLikeGolferName(text) {
        const cleaned = text.trim();
        // Should have 2-3 words, reasonable length, contain letters
        return cleaned.length > 3 && 
               cleaned.length < 50 && 
               /^[A-Za-z\\s.-]+$/.test(cleaned) &&
               cleaned.split(' ').length >= 2;
    }

    // Clean golfer name from HTML
    cleanGolferName(rawName) {
        return rawName.trim()
                     .replace(/\\s+/g, ' ')
                     .replace(/[^A-Za-z\\s.-]/g, '')
                     .trim();
    }

    // Manual odds extraction with current data
    async manualOddsExtraction() {
        // For now, return enhanced fallback data that matches current odds
        // You can manually update these from the PGA Tour website
        return {
            "Patrick Cantlay": 2300,       // Updated from 500
            "Corey Conners": 2500,         // No change
            "Viktor Hovland": 3000,        // Updated from 250
            "Brian Harman": 7000,          // Updated from 3000
            "Shane Lowry": 4500,           // Updated from 5000
            "Ludvig Åberg": 1300,          // Updated from 800
            "Sungjae Im": 2200,            // Updated from 1800
            "Harris English": 25000,       // No change
            "Robert MacIntyre": 10000,     // No change
            "Keegan Bradley": 7000,        // No change
            "Ben Griffin": 4000,           // Updated from 40000          // No change
            "Maverick McNealy": 4000,      // Updated from 30000     // No change
            "Hideki Matsuyama": 5500,      // No change
            "Akshay Bhatia": 20000,        // No change
            "Justin Thomas": 3300,         // Updated from 4000
            "Cameron Young": 10000,        // No change
            "Collin Morikawa": 2900,       // Updated from 1200
            "Sam Burns": 4700,             // Updated from 6000
            "Tommy Fleetwood": 1500,       // Updated from 3500
            "Russell Henley": 2300,        // Updated from 12000
            "Rory McIlroy": 850,           // Updated from 400
            "J.J. Spaun": 2800,            // Updated from 2700
            "Justin Rose": 15000,          // No change
            "Sepp Straka": 50000           // No change
        };
    }

    // Fetch live betting odds from The Odds API
    async fetchLiveOdds() {
        if (!this.API_KEY) {
            console.warn('No API key provided for The Odds API');
            return null;
        }

        try {
            // Fetch golf tournament odds (Tour Championship)
            const url = `${this.API_BASE_URL}/sports/${this.TOURNAMENT_SPORT}/odds/?apiKey=${this.API_KEY}&regions=us&markets=h2h,outrights&oddsFormat=american`;
            
            const data = await this.makeAPIRequest(url);
            
            // Parse the odds data to match our golfers
            const oddsData = {};
            
            // Look for Tour Championship or similar tournament
            const tourChampionship = data.find(event => 
                event.sport_title?.toLowerCase().includes('golf') ||
                event.home_team?.toLowerCase().includes('championship') ||
                event.away_team?.toLowerCase().includes('championship')
            );
            
            if (tourChampionship && tourChampionship.bookmakers) {
                // Extract odds from first available bookmaker
                const bookmaker = tourChampionship.bookmakers[0];
                
                if (bookmaker && bookmaker.markets) {
                    const outrightsMarket = bookmaker.markets.find(market => market.key === 'outrights');
                    
                    if (outrightsMarket && outrightsMarket.outcomes) {
                        outrightsMarket.outcomes.forEach(outcome => {
                            const golferName = outcome.name;
                            const odds = outcome.price;
                            
                            // Match golfer names to our team golfers
                            Object.keys(this.golferOdds).forEach(teamGolfer => {
                                if (this.fuzzyMatchGolferName(teamGolfer, golferName)) {
                                    oddsData[teamGolfer] = Math.abs(odds); // Convert to positive odds
                                }
                            });
                        });
                    }
                }
            }
            
            console.log('Fetched live odds:', Object.keys(oddsData).length, 'golfers matched');
            return Object.keys(oddsData).length > 0 ? oddsData : null;
            
        } catch (error) {
            console.error('Error fetching live odds:', error);
            return null;
        }
    }

    // Helper function to match golfer names (handles slight variations)
    fuzzyMatchGolferName(teamGolfer, apiGolfer) {
        const normalize = (name) => name.toLowerCase().replace(/[^a-z\\s]/g, '').trim();
        const teamNorm = normalize(teamGolfer);
        const apiNorm = normalize(apiGolfer);
        
        // Exact match
        if (teamNorm === apiNorm) return true;
        
        // Check if API name contains team golfer's last name
        const teamLastName = teamNorm.split(' ').pop();
        const apiLastName = apiNorm.split(' ').pop();
        
        return teamLastName === apiLastName && teamLastName.length > 3;
    }

    // API Integration for live tournament scores
    async fetchLiveData() {
        try {
            // For now, simulate live updates with slight score changes
            this.simulateLiveUpdates();
            
            // In real implementation, you would:
            // 1. Parse the API response
            // 2. Extract golfer scores and hole information
            // 3. Update this.golferScores object
            // 4. Handle API errors gracefully
            
            return true;
        } catch (error) {
            console.error('Error fetching live data:', error);
            return false;
        }
    }

    // Simulate live tournament updates for demonstration
    simulateLiveUpdates() {
        if (!this.tournamentStarted || this.isLocked) return;

        const golferNames = Object.keys(this.golferScores);
        const randomGolfer = golferNames[Math.floor(Math.random() * golferNames.length)];
        
        // Randomly update a golfer's score (small changes to simulate live play)
        if (Math.random() < 0.3) { // 30% chance of update each cycle
            const change = Math.random() < 0.6 ? -1 : 1; // More likely to improve
            this.golferScores[randomGolfer].score += change;
        }
    }

    calculateTeamRankings() {
        const teamScores = this.teams.map(team => {
            const golfer1Score = this.golferScores[team.golfer1]?.score || 0;
            const golfer2Score = this.golferScores[team.golfer2]?.score || 0;
            const golfer1Thru = this.golferScores[team.golfer1]?.thru || "--";
            const golfer2Thru = this.golferScores[team.golfer2]?.thru || "--";
            const golfer1Odds = this.golferOdds[team.golfer1] || 0;
            const golfer2Odds = this.golferOdds[team.golfer2] || 0;
            
            return {
                ...team,
                golfer1Score,
                golfer2Score,
                golfer1Thru,
                golfer2Thru,
                golfer1Odds,
                golfer2Odds,
                totalScore: golfer1Score + golfer2Score,
                combinedOdds: golfer1Odds + golfer2Odds
            };
        });

        if (this.tournamentStarted) {
            // Sort by total score (lowest first = best)
            teamScores.sort((a, b) => a.totalScore - b.totalScore);
        } else {
            // Sort by combined odds (lowest first = best odds)
            teamScores.sort((a, b) => a.combinedOdds - b.combinedOdds);
        }

        // Add rank with tie handling
        let currentRank = 1;
        for (let i = 0; i < teamScores.length; i++) {
            const sortValue = this.tournamentStarted ? teamScores[i].totalScore : teamScores[i].combinedOdds;
            const prevSortValue = i > 0 ? (this.tournamentStarted ? teamScores[i - 1].totalScore : teamScores[i - 1].combinedOdds) : null;
            
            if (i > 0 && sortValue !== prevSortValue) {
                currentRank = i + 1;
            }
            teamScores[i].rank = currentRank;
        }

        return teamScores;
    }

    detectRankChanges(newRankings) {
        const changes = [];
        
        newRankings.forEach(team => {
            const previousTeam = this.previousRankings.find(prev => prev.name === team.name);
            if (previousTeam && previousTeam.rank !== team.rank) {
                changes.push({
                    team: team.name,
                    oldRank: previousTeam.rank,
                    newRank: team.rank
                });
            }
        });
        
        return changes;
    }

    formatScore(score) {
        if (score === 0) return "E";
        return score > 0 ? `+${score}` : `${score}`;
    }

    getScoreClass(score) {
        if (score < 0) return "score-under";
        if (score > 0) return "score-over";
        return "score-even";
    }

    renderLeaderboard() {
        console.log('Rendering leaderboard...');
        console.log('Teams:', this.teams.length);
        console.log('Golfer Odds:', Object.keys(this.golferOdds).length);
        console.log('Golfer Scores:', Object.keys(this.golferScores).length);
        
        const rankings = this.calculateTeamRankings();
        console.log('Rankings calculated:', rankings.length);
        
        const changes = this.detectRankChanges(rankings);
        const leaderboard = document.getElementById('leaderboard');
        
        leaderboard.innerHTML = '';
        
        rankings.forEach(team => {
            const hasRankChange = changes.some(change => change.team === team.name);
            
            const row = document.createElement('div');
            row.className = `team-row ${hasRankChange ? 'rank-change' : ''}`;
            
            const displayScore = this.tournamentStarted ? this.formatScore(team.totalScore) : `${this.formatScore(team.totalScore)}`;
            const scoreClass = this.tournamentStarted ? this.getScoreClass(team.totalScore) : '';
            
            row.innerHTML = `
                <div class="rank">${team.rank}</div>
                <div class="team-name">${team.name}</div>
                <div class="golfer-info">
                    <div class="golfer-name">
                        ${team.golfer1} <span class="odds">+${team.golfer1Odds}</span>
                    </div>
                    <div class="golfer-score">
                        ${this.tournamentStarted ? this.formatScore(team.golfer1Score) : `(${team.golfer1Thru})`}
                    </div>
                </div>
                <div class="golfer-info">
                    <div class="golfer-name">
                        ${team.golfer2} <span class="odds">+${team.golfer2Odds}</span>
                    </div>
                    <div class="golfer-score">
                        ${this.tournamentStarted ? this.formatScore(team.golfer2Score) : `(${team.golfer2Thru})`}
                    </div>
                </div>
                <div class="total-score ${scoreClass}">
                    ${displayScore}
                </div>
            `;
            
            leaderboard.appendChild(row);
        });
        
        this.previousRankings = [...rankings];
        
        // Update tournament status
        this.updateTournamentStatus();
    }

    getRankSuffix(rank) {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const value = rank % 100;
        return rank + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
    }

    setupLockButton() {
        const lockButton = document.getElementById('lockButton');
        lockButton.addEventListener('click', () => {
            if (!this.isLocked && this.tournamentStarted) {
                this.lockInDraftOrder();
            }
        });
    }

    lockInDraftOrder() {
        this.isLocked = true;
        const lockButton = document.getElementById('lockButton');
        lockButton.disabled = true;
        lockButton.textContent = 'DRAFT ORDER LOCKED';
        lockButton.style.background = '#7f8c8d';
        
        // Stop updates
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        // Show final results
        const finalResults = document.getElementById('finalResults');
        finalResults.style.display = 'block';
    }

    startTournament() {
        this.tournamentStarted = true;
        this.startPeriodicUpdates();
        
        // Initialize with some sample scores
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
        this.renderLeaderboard();
    }

    updateTournamentStatus() {
        const statusElement = document.getElementById('tournamentStatus');
        const lockButton = document.getElementById('lockButton');
        
        if (!this.tournamentStarted) {
            statusElement.innerHTML = `
                <span class="status-indicator" style="background: #f39c12;"></span>
                <span class="status-text" style="color: #f39c12;">Pre-Tournament (Odds-Based Ranking)</span>
            `;
            lockButton.disabled = true;
            lockButton.style.background = '#7f8c8d';
        } else if (this.isLocked) {
            statusElement.innerHTML = `
                <span class="status-indicator" style="background: #e74c3c;"></span>
                <span class="status-text" style="color: #e74c3c;">Draft Order Locked</span>
            `;
        } else {
            statusElement.innerHTML = `
                <span class="status-indicator" style="background: #27ae60;"></span>
                <span class="status-text" style="color: #27ae60;">Live Tournament</span>
            `;
            lockButton.disabled = false;
            lockButton.style.background = '#e74c3c';
        }
    }

    // Start periodic odds updates
    startOddsUpdates() {
        // Update odds every 10 minutes when tournament hasn't started
        this.oddsUpdateInterval = setInterval(async () => {
            if (!this.tournamentStarted && !this.isLocked) {
                await this.updateOddsData();
            }
        }, 600000); // 10 minutes
    }

    // Update odds data
    async updateOddsData() {
        try {
            console.log('Updating betting odds...');
            let liveOdds = null;
            
            if (this.USE_PGA_TOUR_ODDS) {
                liveOdds = await this.fetchPGATourOdds();
            } else {
                liveOdds = await this.fetchLiveOdds();
            }
            
            if (liveOdds && Object.keys(liveOdds).length > 0) {
                // Update odds for matched golfers
                let updateCount = 0;
                Object.keys(liveOdds).forEach(golfer => {
                    if (this.golferOdds[golfer] && this.golferOdds[golfer] !== liveOdds[golfer]) {
                        console.log(`Updating ${golfer}: ${this.golferOdds[golfer]} → ${liveOdds[golfer]}`);
                        this.golferOdds[golfer] = liveOdds[golfer];
                        updateCount++;
                    }
                });
                
                const source = this.USE_PGA_TOUR_ODDS ? 'PGA Tour website' : 'The Odds API';
                console.log(`Updated odds from ${source} for ${updateCount} golfers`);
                
                if (updateCount > 0) {
                    this.renderLeaderboard();
                    this.updateLastUpdatedTime();
                    this.showOddsUpdateIndicator(true);
                } else {
                    console.log('No odds changes detected');
                    this.showOddsUpdateIndicator(true, 'No changes');
                }
            } else {
                console.warn('No odds data received from source');
                this.showOddsUpdateIndicator(false);
            }
        } catch (error) {
            console.error('Error updating odds:', error);
            this.showOddsUpdateIndicator(false);
        }
    }

    // Show visual indicator for odds updates
    showOddsUpdateIndicator(success) {
        const statusElement = document.querySelector('.tournament-status');
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: absolute;
            top: -5px;
            right: -5px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: ${success ? '#27ae60' : '#e74c3c'};
            animation: pulse 1s ease-in-out;
        `;
        
        statusElement.style.position = 'relative';
        statusElement.appendChild(indicator);
        
        // Remove indicator after 2 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 2000);
    }

    // Enhanced error handling for API requests
    async makeAPIRequest(url, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url);
                
                if (response.status === 429) {
                    // Rate limited - wait and retry
                    const waitTime = Math.pow(2, i) * 1000; // Exponential backoff
                    console.warn(`Rate limited, waiting ${waitTime}ms before retry ${i + 1}/${retries}`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue;
                }
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error(`API request attempt ${i + 1}/${retries} failed:`, error.message);
                
                if (i === retries - 1) {
                    throw error; // Last retry failed
                }
                
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }

    checkTournamentComplete() {
        // Check if all golfers have finished (thru = "F")
        const allFinished = Object.values(this.golferScores).every(golfer => golfer.thru === "F");
        
        if (allFinished && this.isLive) {
            this.finalizeTournament();
        }
    }

    finalizeTournament() {
        this.isLive = false;
        clearInterval(this.updateInterval);
        
        // Update tournament status
        const statusElement = document.getElementById('tournamentStatus');
        statusElement.innerHTML = `
            <span class="status-indicator" style="background: #FF6B35;"></span>
            <span class="status-text" style="color: #FF6B35;">Tournament Complete</span>
        `;
        
        // Show final results banner
        const finalResults = document.getElementById('finalResults');
        finalResults.style.display = 'block';
        
        // Add confetti or celebration effect (optional)
        this.triggerCelebration();
    }

    triggerCelebration() {
        // Simple celebration effect - you could add more sophisticated animations
        document.body.style.animation = 'none';
        setTimeout(() => {
            document.body.style.animation = 'celebration 2s ease-in-out';
        }, 100);
    }

    updateLastUpdatedTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('lastUpdate').textContent = timeString;
    }

    startPeriodicUpdates() {
        // Update every 30 seconds in demo mode, every 2-5 minutes in production
        this.updateInterval = setInterval(async () => {
            if (this.isLive) {
                await this.fetchLiveData();
                this.renderLeaderboard();
                this.updateLastUpdatedTime();
            }
        }, 30000); // 30 seconds for demo, increase for production

        // Also update the time every second
        setInterval(() => {
            this.updateLastUpdatedTime();
        }, 1000);
    }

    // Method to manually refresh data (could be triggered by button)
    async refreshData() {
        if (this.isLive) {
            await this.fetchLiveData();
            this.renderLeaderboard();
            this.updateLastUpdatedTime();
        }
    }
}

// Add CSS for celebration animation
const style = document.createElement('style');
style.textContent = `
    @keyframes celebration {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.02); }
        50% { transform: scale(1); }
        75% { transform: scale(1.02); }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tourApp = new TourChampionshipApp();
    
    // Add a button to simulate tournament start for testing
    const statusElement = document.querySelector('.tournament-status');
    const startButton = document.createElement('button');
    startButton.textContent = 'START TOURNAMENT';
    startButton.style.marginLeft = '10px';
    startButton.style.padding = '5px 10px';
    startButton.style.background = '#27ae60';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '4px';
    startButton.style.cursor = 'pointer';
    startButton.addEventListener('click', () => {
        window.tourApp.startTournament();
        startButton.remove();
    });
    statusElement.appendChild(startButton);
});

// Export for potential testing or external access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TourChampionshipApp;
}