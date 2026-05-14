# Tiny Promise — Manual Test Checklist

Run `npm run dev` and open [http://localhost:3000](http://localhost:3000).
Before starting, clear localStorage: DevTools > Application > Local Storage > delete `tiny-promise.entries`.

---

## 1. First visit (no promises)

**Steps:**
1. Clear localStorage
2. Open `/`

**Expected:**
- Header shows "Tiny Promise" and "One promise is enough."
- Body shows "One promise is enough." heading, subtext, a textarea, 5 example chips, and a disabled "I promise" button
- No errors in console

- [ ] Pass

---

## 2. Creating a promise

**Steps:**
1. Type "Walk for 10 minutes" in the textarea
2. Confirm the "I promise" button is now enabled
3. Click "I promise"

**Expected:**
- View switches to a card showing `"Walk for 10 minutes"` with three check-in buttons: "I kept it", "Partly", "Not today"
- localStorage now has `tiny-promise.entries` with one entry (status: `"pending"`)

- [ ] Pass

---

## 2b. Creating a promise via example chip

**Steps:**
1. Clear localStorage, refresh
2. Click the "Meditate for 5 minutes" chip
3. Confirm textarea fills with that text
4. Click "I promise"

**Expected:**
- Promise is created with the chip's text
- Card displays correctly

- [ ] Pass

---

## 3. Refreshing page after creating promise

**Steps:**
1. Create a promise (if not already pending)
2. Hard-refresh the page (Ctrl+Shift+R)

**Expected:**
- Page shows the pending promise card, not the creation form
- Promise text matches what was entered

- [ ] Pass

---

## 4. Check in as kept

**Steps:**
1. From a pending promise, click "I kept it"
2. On the reflection form, note the heading says "What helped you keep it?"
3. Type "Went right after lunch"
4. Confirm "Same" is pre-selected for tomorrow's size
5. Click "Save reflection"

**Expected:**
- View switches to completed card with green "Kept" badge
- Reflection box shows your text
- Footer says "Same size tomorrow feels okay."
- Bottom text: "Self-trust is built gently."

- [ ] Pass

---

## 5. Check in as partly

**Steps:**
1. Clear localStorage, create a new promise, click "Partly"
2. Heading says "What got in the way?"
3. Type "Got interrupted halfway"
4. "Same" is pre-selected
5. Click "Save reflection"

**Expected:**
- Completed card shows amber "Partly kept" badge
- Reflection displayed correctly

- [ ] Pass

---

## 6. Check in as not today

**Steps:**
1. Clear localStorage, create a new promise, click "Not today"
2. Heading says "What made it hard today?"
3. Leave reflection blank
4. Confirm "Smaller" is pre-selected for tomorrow's size
5. Click "Save reflection"

**Expected:**
- Completed card shows rose "Not today" badge
- No reflection box shown (it was blank)
- Footer says "Tomorrow can be smaller."

- [ ] Pass

---

## 7. Empty promise input

**Steps:**
1. On the creation form, leave textarea empty
2. Try clicking "I promise"
3. Type only spaces, try again

**Expected:**
- Button stays disabled (grayed out, `not-allowed` cursor)
- No promise is created
- No console errors

- [ ] Pass

---

## 8. Empty reflection

**Steps:**
1. Create and check in on a promise (any status)
2. Leave the reflection textarea completely blank
3. Click "Save reflection"

**Expected:**
- Saves successfully
- Completed card does NOT show a reflection section
- In localStorage, the entry has no `reflection` field (or it's `undefined`)

- [ ] Pass

---

## 9. History page

**Steps:**
1. Clear localStorage, navigate to `/history`
2. Confirm empty state message appears
3. Go to `/`, create and complete a promise
4. Navigate back to `/history`

**Expected:**
- Empty state: "Your promise history will appear here." + "Start with one tiny promise today."
- After completing a promise: one card appears with date, status badge, promise text
- If reflection was written, it appears in italics
- Most recent promise at the top

- [ ] Pass

---

## 9b. History with multiple promises

**Steps:**
1. In localStorage, manually add 2-3 entries with different dates and statuses
2. Navigate to `/history`

**Expected:**
- All entries appear in reverse-chronological order
- Each has the correct status badge color (green/amber/rose)

- [ ] Pass

---

## 10. Insights page

**Steps:**
1. Clear localStorage, navigate to `/insights`
2. Confirm empty state
3. Complete 3+ promises across different statuses (edit localStorage or test across days)
4. Navigate to `/insights`

**Expected:**
- Empty state: self-trust shows "No score yet", completed shows "0", recent promises says "No completed promises yet."
- With data: self-trust shows a percentage, completed shows count, recent legend shows kept/partly/not today counts
- Insight message at the bottom varies based on patterns

- [ ] Pass

---

## 11. Invalid localStorage data

**Steps:**
1. Open DevTools > Console
2. Run: `localStorage.setItem("tiny-promise.entries", "not json")`
3. Refresh the page

**Expected:**
- App loads normally, shows empty/new-promise state
- No crash or white screen
- Console has no uncaught errors

- [ ] Pass

---

## 11b. Corrupted but valid JSON

**Steps:**
1. Run: `localStorage.setItem("tiny-promise.entries", "[]")`
2. Refresh

**Expected:**
- App treats it as no promises, shows creation form

- [ ] Pass

---

## 12. Mobile layout

**Steps:**
1. Open DevTools, toggle device toolbar (Ctrl+Shift+M)
2. Test at 375px wide (iPhone SE) and 390px (iPhone 14)
3. Walk through the full flow: create, check in, complete
4. Check `/history` and `/insights`

**Expected:**
- No horizontal scrolling on any page
- Textarea and buttons are full-width
- Example chips wrap naturally
- Bottom navigation stays fixed and all 3 labels are visible
- Cards have comfortable padding, no text overflow
- Content doesn't get hidden behind the bottom nav (there's `pb-28` spacing)

- [ ] Pass

---

## 12b. Navigation

**Steps:**
1. Tap "Today" — should go to `/`
2. Tap "History" — should go to `/history`
3. Tap "Insights" — should go to `/insights`
4. Confirm active tab is highlighted in green with a dot underneath

**Expected:**
- All links work
- Active state is visually distinct
- Transition between pages is smooth

- [ ] Pass

---

## 12c. Check-in "Go back" button

**Steps:**
1. From a pending promise, click any status button
2. On the reflection form, click "Go back"

**Expected:**
- Returns to the pending promise card
- No data is saved

- [ ] Pass
