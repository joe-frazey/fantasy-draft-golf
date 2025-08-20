# API Setup Guide for Tour Championship Draft Order App

## Step-by-Step API Integration

### 1. Get Your The Odds API Key

1. Go to [The Odds API website](https://the-odds-api.com/)
2. Click "Get API Key" 
3. Sign up with your email
4. Verify your email address
5. Copy your API key from the dashboard

**Free Tier**: 500 requests/month (plenty for your needs)

### 2. Configure the App

Open `script.js` and find this line around line 11:

```javascript
this.API_KEY = null; // Set this to your The-Odds-API key
```

Replace `null` with your actual API key:

```javascript
this.API_KEY = 'your-actual-api-key-here'; // Replace with your key
```

### 3. Test the Integration

1. Open `index.html` in your browser
2. Open browser Developer Tools (F12)
3. Check the Console tab for messages like:
   - "Updating betting odds..."
   - "Fetched live odds: X golfers matched"
   - "Updated odds for X golfers"

### 4. Monitor Your Usage

- The app updates odds every 10 minutes (only before tournament starts)
- With 500 free requests/month, this gives you ~34 days of continuous monitoring
- Check your usage at [The Odds API dashboard](https://the-odds-api.com/account)

### 5. What the App Does Automatically

✅ **Fetches Live Odds**: Every 10 minutes when in pre-tournament mode  
✅ **Matches Golfer Names**: Uses smart matching to connect API data to your team golfers  
✅ **Updates Rankings**: Recalculates team rankings based on new odds  
✅ **Handles Errors**: Falls back to default odds if API fails  
✅ **Shows Status**: Visual indicators show when odds update successfully  

### 6. Expected Behavior

**Pre-Tournament Mode**:
- Teams ranked by combined betting odds (lowest odds = best ranking)
- Odds update every 10 minutes with visual indicator
- Status shows "Pre-Tournament (Odds-Based Ranking)"

**Tournament Mode** (after clicking "START TOURNAMENT"):
- Rankings switch to golf scores
- Odds updates stop (to save API quota)
- Status shows "Live Tournament"

## Alternative: Manual Odds Entry

If you prefer not to use the API or want to test with specific odds:

1. In `script.js`, find the `initializeOddsData()` function
2. Update the `fallbackOdds` object with your desired odds
3. Set `this.API_KEY = null` to disable API calls

## Troubleshooting

### Common Issues

**"No API key provided" in console**
- Make sure you've set the API_KEY variable in script.js

**"Rate limited" messages**
- You've exceeded your monthly quota
- Wait for next month or upgrade your plan

**"0 golfers matched" in console**
- The API might not have Tour Championship data yet
- Golfer names in API might differ from your list
- Check console for detailed matching attempts

### Debugging Tips

1. **Check Network Tab**: See if API requests are being made
2. **Console Logs**: Look for detailed error messages
3. **API Response**: Check what data the API is returning
4. **Manual Test**: Try the API URL directly in your browser

Need help? Check the browser console first - it shows detailed information about what's happening with the odds integration.