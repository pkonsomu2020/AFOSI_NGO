# Test API Connection from ADMIN

## Quick Test in Browser Console

Open ADMIN dashboard (http://localhost:3000) and open browser console (F12), then run:

### Test 1: Check API Base URL
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

Expected: `http://localhost:5000/api`

### Test 2: Test Fetch Opportunities
```javascript
fetch('http://localhost:5000/api/opportunities')
  .then(res => res.json())
  .then(data => console.log('Opportunities:', data))
  .catch(err => console.error('Error:', err));
```

Expected: Should return list of opportunities

### Test 3: Test Create Opportunity
```javascript
fetch('http://localhost:5000/api/opportunities', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Browser Test',
    type: 'employment',
    description: 'Testing from browser',
    location: 'Nairobi',
    duration: '3 months',
    deadline: '2026-12-31'
  })
})
  .then(res => res.json())
  .then(data => console.log('Created:', data))
  .catch(err => console.error('Error:', err));
```

Expected: Should create and return new opportunity

### Test 4: Test Gallery
```javascript
fetch('http://localhost:5000/api/gallery')
  .then(res => res.json())
  .then(data => console.log('Gallery:', data))
  .catch(err => console.error('Error:', err));
```

Expected: Should return list of images

---

## Common Issues and Solutions

### Issue 1: CORS Error
**Error:** `Access-Control-Allow-Origin`

**Solution:** Backend CORS is already configured. Make sure backend is running.

### Issue 2: Network Error
**Error:** `Failed to fetch` or `ERR_CONNECTION_REFUSED`

**Solution:** 
- Backend not running
- Run: `cd backend && npm run dev`

### Issue 3: 404 Not Found
**Error:** `404` status code

**Solution:**
- Wrong API URL
- Check ADMIN/.env has correct URL
- Restart ADMIN server after changing .env

### Issue 4: Environment Variable Not Loading
**Error:** `undefined` when checking `import.meta.env.VITE_API_URL`

**Solution:**
1. Make sure .env file is in ADMIN folder
2. Restart ADMIN dev server
3. Clear browser cache

---

## Restart ADMIN Server

If you changed .env file, you MUST restart:

```cmd
cd ADMIN
npm run dev
```

Vite only loads .env on startup!

---

## Check Network Tab

1. Open DevTools (F12)
2. Go to "Network" tab
3. Try adding an opportunity
4. Look for requests to `localhost:5000`
5. Check:
   - Request URL
   - Status code
   - Response data
   - Any errors

---

## Expected Behavior

When you add/edit an opportunity:
1. Network tab shows POST/PUT request to `http://localhost:5000/api/opportunities`
2. Status: 200 or 201
3. Response contains the saved opportunity data
4. UI updates immediately
5. Refresh page - changes persist

When you upload an image:
1. Network tab shows POST to `http://localhost:5000/api/upload`
2. Then POST to `http://localhost:5000/api/gallery`
3. Status: 200 or 201
4. Image displays immediately
5. Refresh page - image still there
