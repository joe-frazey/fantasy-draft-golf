# Tour Championship Draft Order Showdown

A live, interactive web application that tracks fantasy football draft order based on the 2025 PGA Tour Championship results. Each league member has drafted two golfers, and their combined scores determine the draft order.

## Features

- **Live Leaderboard**: Real-time ranking of fantasy teams based on golfer performance
- **Animated Updates**: Smooth transitions and rank change indicators
- **Mobile Responsive**: Works perfectly on all devices
- **Auto-Refresh**: Updates every 30 seconds during the tournament
- **Final Lock-in**: Special animation when tournament concludes

## Quick Start

1. Open `index.html` in any modern web browser
2. The app will display mock data and simulate live updates for demonstration
3. To integrate with real tournament data, see the API Integration section below

## File Structure

```
/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── script.js           # JavaScript logic and data management
└── README.md           # This file
```

## Team Data

The following 12 teams and their golfers are hardcoded in the application:

| Team    | Golfer 1           | Golfer 2          |
|---------|-------------------|-------------------|
| MJC     | Tommy Fleetwood   | Russell Henley    |
| Kamp    | Viktor Hovland    | Brian Harman      |
| Burton  | Patrick Cantlay   | Corey Conners     |
| Blanch  | Rory McIlroy      | J.J. Spaun        |
| Blake   | Shane Lowry       | Ludvig Åberg      |
| Wales   | Sungjae Im        | Harris English    |
| Ryan    | Robert MacIntyre  | Keegan Bradley    |
| Frazey  | Ben Griffin       | Maverick McNealy  |
| Carl    | Hideki Matsuyama  | Akshay Bhatia     |
| Pannell | Justin Thomas     | Cameron Young     |
| Tim     | Collin Morikawa   | Sam Burns         |
| Goldy   | Justin Rose       | Sepp Straka       |

## Real-Time Betting Odds Integration

The app now includes **real-time betting odds integration** using **official PGA Tour odds data**! Here's how to set it up:

### Official PGA Tour Odds (Recommended)

The app is configured to use odds directly from the official PGA Tour website:
**https://www.pgatour.com/tournaments/2025/tour-championship/R2025060/odds**

#### Automatic Setup (Default)
- The app automatically attempts to fetch odds from the PGA Tour website
- Updates every 10 minutes with the latest official odds
- No API keys required!

#### Manual Odds Update (Most Reliable)

For the most accurate odds, you can manually update from the PGA Tour website:

1. **Visit the PGA Tour Odds Page**:
   https://www.pgatour.com/tournaments/2025/tour-championship/R2025060/odds

2. **Run the Odds Extractor**:
   - Open browser Developer Tools (F12)
   - Go to Console tab
   - Run the extraction script from `pga-odds-updater.js`

3. **Update Your App**:
   - Copy the extracted odds data
   - Paste into the `manualOddsExtraction()` function in `script.js`
   - Refresh your app

#### Alternative: The Odds API

If you prefer using The Odds API instead:

1. **Configure the App**:
   ```javascript
   // In script.js, change this setting:
   this.USE_PGA_TOUR_ODDS = false; // Switch to The Odds API
   this.API_KEY = 'YOUR_API_KEY_HERE'; // Add your API key
   ```

2. **Get API Key**: Visit [The Odds API](https://the-odds-api.com/) for free account

### API Features

✅ **Real-time odds updates** every 10 minutes  
✅ **Automatic golfer name matching** with fuzzy logic  
✅ **Rate limiting protection** with exponential backoff  
✅ **Graceful error handling** with fallback data  
✅ **Visual update indicators** for successful/failed updates  

### Live Tournament Data APIs

For live golf scores during the tournament:

1. **ESPN API** (Free tier available)
   ```javascript
   const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/golf/leaderboard');
   ```

2. **SportsData.io** (Paid service)
   ```javascript
   const response = await fetch('https://api.sportsdata.io/golf/v2/json/Leaderboard/TOURNAMENT_ID?key=YOUR_API_KEY');
   ```

### Integration Steps (Tournament Scores)

1. **Get API Key**: Sign up for your chosen API service
2. **Update fetchLiveData()**: Replace the placeholder with actual API calls
3. **Parse Response**: Map API golfer names to your team data
4. **Handle Errors**: Add proper error handling and fallback data
5. **Adjust Update Frequency**: Change from 30 seconds to 2-5 minutes for production

### Troubleshooting Odds Integration

**No odds updates?**
- Check browser console for API errors
- Verify your API key is set correctly
- Ensure you haven't exceeded your rate limit

**CORS errors?**
- The Odds API supports CORS, but if issues arise, deploy to a domain
- Consider using a serverless function as a proxy

**Golfers not matching?**
- The app uses fuzzy matching for golfer names
- Check console logs to see how many golfers were matched
- API names may differ slightly from your team list

### Example API Integration

```javascript
async fetchLiveData() {
    try {
        const response = await fetch('YOUR_API_ENDPOINT');
        const data = await response.json();
        
        // Parse and update golfer scores
        data.players.forEach(player => {
            if (this.golferScores[player.name]) {
                this.golferScores[player.name] = {
                    score: player.totalScore,
                    thru: player.currentHole || "F"
                };
            }
        });
        
        return true;
    } catch (error) {
        console.error('API Error:', error);
        return false;
    }
}
```

## Deployment Options

### 1. Vercel (Recommended - Zero Configuration)

This app is pre-configured for Vercel with a `vercel.json` file:

#### Deploy from GitHub:
1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" and select your repository
4. Click "Deploy" - no configuration needed!

#### Deploy with Vercel CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project folder
vercel

# Follow the prompts to deploy
```

### 2. Netlify
1. Push code to GitHub repository
2. Connect to Netlify
3. Deploy automatically from main branch

### 3. GitHub Pages
1. Create GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch

### 4. Local Development
```bash
# Using the included package.json
npm run dev

# Or simple HTTP server
python -m http.server 8000
# or
npx serve .
```

## Files for Deployment

The following files are included for smooth deployment:

- ✅ `vercel.json` - Vercel configuration
- ✅ `package.json` - Node.js project configuration
- ✅ `.gitignore` - Git ignore patterns
- ✅ All static assets (HTML, CSS, JS)

## Customization

### Styling
- Modify `styles.css` for theme changes
- Update CSS variables for color schemes
- Adjust responsive breakpoints

### Team Data
- Update the `teams` array in `script.js`
- Modify golfer names to match API responses exactly

### Update Frequency
- Change `updateInterval` in `startPeriodicUpdates()`
- Recommended: 2-5 minutes for production

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Performance Notes

- App uses CSS transforms for smooth animations
- Efficient DOM updates only when data changes
- Responsive images and optimized fonts
- No external dependencies for core functionality

## Troubleshooting

### Common Issues

1. **CORS Errors**: Use a CORS proxy or deploy to a proper domain
2. **API Rate Limits**: Implement caching and respect rate limits
3. **Mobile Layout**: Test on actual devices for touch interactions

### API Integration Checklist

- [ ] API key obtained and secured
- [ ] Golfer name matching verified
- [ ] Error handling implemented
- [ ] Rate limiting respected
- [ ] CORS issues resolved
- [ ] Update frequency optimized

## License

This project is for personal use within your fantasy football league. Modify and distribute as needed for your group.

---

**Ready to determine your draft order? May the best golfers win! ⛳**