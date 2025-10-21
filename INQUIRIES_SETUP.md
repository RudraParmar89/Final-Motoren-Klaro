# 📬 Inquiries Management Setup

## What's This?

A complete inquiry management system where:
- ✅ Users fill contact form on website
- ✅ Inquiry saved to database automatically
- ✅ Admin sees all inquiries in admin panel
- ✅ Admin can update status (New → Contacted → Resolved)
- ✅ Admin can add notes to each inquiry
- ✅ Real-time updates
- ✅ Email and phone clickable for quick contact

---

## 🚀 Setup (1 Minute):

### Step 1: Create Table in Supabase

1. Go to Supabase → SQL Editor
2. Run as **postgres** role
3. Copy and run `create_inquiries_table.sql`

Or run this:

```sql
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  car_brand TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

ALTER TABLE public.inquiries DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO postgres;
GRANT INSERT ON public.inquiries TO anon;
ALTER TABLE public.inquiries OWNER TO postgres;

CREATE INDEX idx_inquiries_status ON public.inquiries(status);
CREATE INDEX idx_inquiries_created_at ON public.inquiries(created_at DESC);
```

### Step 2: Refresh Admin Panel

1. Go to admin panel
2. Press **Ctrl+Shift+R**
3. Click on "**Inquiries**" card or the stat at top
4. Done!

---

## 📊 Features:

### Stats Dashboard:
- **Total Inquiries** - All inquiries ever received
- **New** - Unread/new inquiries (blue)
- **Contacted** - Already reached out (yellow)
- **Resolved** - Issue resolved (green)

### For Each Inquiry You See:
- ✅ Customer name
- ✅ Email (clickable to send email)
- ✅ Phone (clickable to call)
- ✅ Car brand they're interested in
- ✅ Their message
- ✅ Status badge with color
- ✅ Timestamp
- ✅ Status dropdown to change status
- ✅ View button for details

### View Details Modal:
- Full inquiry information
- Change status
- Add admin notes
- See when it was submitted/updated
- Quick contact links

---

## 🎯 Workflow:

### When User Submits Form:
1. User fills contact form
2. Clicks "Send Message"
3. Form saves to `inquiries` table
4. Status set to "new"
5. Admin panel updates in real-time
6. User sees success message

### When Admin Reviews:
1. Admin opens Inquiries tab
2. Sees all inquiries with status
3. Clicks "View" on an inquiry
4. Reads details
5. Changes status to "Contacted"
6. Adds notes: "Called customer, interested in BMW X5"
7. Saves notes
8. Later marks as "Resolved" when deal is done

---

## 🎨 Status Flow:

```
NEW (Blue) 
  → Customer just submitted
  → Not yet contacted

CONTACTED (Yellow)
  → Admin reached out to customer
  → Awaiting response or follow-up

RESOLVED (Green)
  → Issue resolved
  → Customer satisfied or deal closed

CLOSED (Gray)
  → Inquiry closed without resolution
  → Customer not interested or duplicate
```

---

## 🔔 Real-Time Updates:

- New inquiry comes in → Appears instantly in admin
- Admin changes status → Stats update immediately
- No refresh needed!

---

## 📧 Contact Features:

**Click email** → Opens email client with customer's email pre-filled
**Click phone** → Opens phone dialer (on mobile) or Skype/etc

---

## 🔍 Search:

Search by:
- Customer name
- Email address
- Car brand
- Message content

---

## 💡 Pro Tips:

1. **Prioritize "New" inquiries** - Check blue badge count
2. **Add notes** - Document every interaction
3. **Update status** - Keep track of progress
4. **Use search** - Find specific inquiries quickly
5. **Check timestamps** - Know how long customer has been waiting

---

## ✅ Success Checklist:

- [ ] Table created in Supabase
- [ ] Admin panel shows "Inquiries" tab
- [ ] Can see stats (Total, New, Contacted, Resolved)
- [ ] Test: Submit form on main site
- [ ] Inquiry appears in admin instantly
- [ ] Can change status
- [ ] Can add notes
- [ ] Email/phone links work

---

## 🎉 Result:

You now have a **professional inquiry management system** where:
- All customer inquiries are captured
- Admin can track and manage them
- Nothing gets missed
- Professional workflow
- Real-time updates

**No more lost leads!** 📬
