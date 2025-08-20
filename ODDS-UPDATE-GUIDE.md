# Quick Odds Update Guide

## Method 1: Manual Update from PGA Tour Website (Recommended)

### Step 1: Visit the PGA Tour Odds Page
Go to: https://www.pgatour.com/tournaments/2025/tour-championship/R2025060/odds

### Step 2: Extract the Odds
1. Right-click on the page and select "Inspect Element" (or press F12)
2. Go to the "Console" tab
3. Paste this code and press Enter:

```javascript
// PGA Tour Odds Extractor
const extractPGAOdds = () => {
    const teamGolfers = [
        "Tommy Fleetwood", "Russell Henley", "Viktor Hovland", "Brian Harman",
        "Patrick Cantlay", "Corey Conners", "Rory McIlroy", "J.J. Spaun", 
        "Shane Lowry", "Ludvig Åberg", "Sungjae Im", "Harris English",
        "Robert MacIntyre", "Keegan Bradley", "Ben Griffin", "Maverick McNealy",
        "Hideki Matsuyama", "Akshay Bhatia", "Justin Thomas", "Cameron Young",
        "Collin Morikawa", "Sam Burns", "Justin Rose", "Sepp Straka"
    ];
    
    const oddsData = {};
    const allText = document.body.innerText || document.body.textContent || '';
    
    // Look for odds patterns in the page text
    teamGolfers.forEach(golfer => {
        const patterns = [
            new RegExp(golfer + '.*?([+-]\\d{3,5})', 'i'),
            new RegExp('([+-]\\d{3,5}).*?' + golfer, 'i')
        ];
        
        patterns.forEach(pattern => {
            const match = allText.match(pattern);
            if (match && match[1]) {
                const odds = Math.abs(parseInt(match[1]));
                if (odds >= 100 && odds <= 100000) { // Reasonable odds range
                    oddsData[golfer] = odds;
                }
            }
        });
    });
    
    console.log('🏆 EXTRACTED ODDS FROM PGA TOUR:');
    console.log('================================');
    
    // Sort by odds (favorites first)
    const sortedOdds = Object.entries(oddsData).sort(([,a], [,b]) => a - b);
    
    sortedOdds.forEach(([golfer, odds], index) => {
        console.log(`${index + 1}. ${golfer.padEnd(20)} +${odds}`);
    });
    
    console.log('\n📋 COPY THIS DATA:');
    console.log('==================');
    console.log(JSON.stringify(oddsData, null, 4));
    
    return oddsData;
};

extractPGAOdds();
```

### Step 3: Update Your App
1. Copy the odds data from the console output
2. Open `script.js` in your app
3. Find the `manualOddsExtraction()` function (around line 231)
4. Replace the return statement with your new odds data:

```javascript
async manualOddsExtraction() {
    return {
        // Paste your copied odds data here
        "Viktor Hovland": 250,
        "Rory McIlroy": 400,
        // ... etc
    };
}
```

5. Save the file and refresh your app!

## Method 2: Quick Visual Check

If the extractor doesn't work perfectly, you can manually scan the PGA Tour odds page and update the key golfers:

**Top Favorites** (usually +200 to +800):
- Viktor Hovland
- Rory McIlroy  
- Patrick Cantlay
- Collin Morikawa
- Ludvig Åberg

**Middle Tier** (+1000 to +5000):
- Hideki Matsuyama
- Shane Lowry
- Justin Thomas
- Sungjae Im
- Tommy Fleetwood

**Long Shots** (+10000+):
- J.J. Spaun
- Ben Griffin
- Maverick McNealy
- Harris English

## Method 3: Alternative Odds Sources

If the PGA Tour website is difficult to parse, you can also check:
- ESPN Golf odds
- DraftKings Sportsbook
- FanDuel Sportsbook
- Any major sportsbook's Tour Championship odds

Just look for the same golfers and update the odds manually in the `manualOddsExtraction()` function.

## Verification

After updating, open your app and check:
1. Teams should be ranked by combined odds (lowest = best ranking)
2. Each golfer should show their odds next to their name
3. Console should show "Updated odds from PGA Tour website"

## Troubleshooting

**No odds showing?**
- Check browser console for errors
- Verify the odds data format is correct
- Make sure golfer names match exactly

**Ranking looks wrong?**
- Lower odds = better ranking (Viktor at +250 beats Rory at +400)
- Combined team odds determine ranking (Team A: 250+500=750, Team B: 400+600=1000, Team A wins)

**Need help?**
- Check the browser console for detailed logging
- The app will fall back to default odds if there are any issues