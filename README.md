# Office Documents Manager By Dear Er

Private internal system for managing company legal documents (Registration Certificate,
VAT Registration, Tax Clearance, Experience Letters) across multiple companies, with
PDF merge/download and 30-day trash recovery.

---

## Kasari Deploy Garne (Step by Step)

Yo guide follow garera, coding knowledge bina pani system live garna sakinxa.
Harek step sequentially garnus, skip nagarnus.

### Step 1: GitHub ma code push garne

1. github.com ma account banaunus (already xa vane skip garnus)
2. Naya **private** repository banaunus (naam jasto: `office-docs-manager`)
3. Yo folder (`office-docs-manager`) lai teso repository ma push garnus:
   ```
   cd office-docs-manager
   git init
   git add .
   git commit -m "Initial setup"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/office-docs-manager.git
   git push -u origin main
   ```
   (`YOUR_USERNAME` lai tapaiko GitHub username le replace garnus)

**Important**: `.env` file kahilyai push nagarnus - yo automatically ignore huncha
(`.gitignore` ma already xa), kina ki yesma secret PIN/password huncha.

---

### Step 2: Database banaune (Neon - free)

1. neon.tech ma account banaunus
2. "New Project" click garnus, naam dinus (e.g. "office-docs-manager")
3. Project banisake pachi, **Connection String** herna paunuhunxa - 2 wota URL chahinxa:
   - **Pooled connection** (normally "Connection string" tab ma dekhinxa) -> yo `DATABASE_URL` ho
   - **Direct connection** (Neon dashboard ma "Direct connection" option hernus) -> yo `DIRECT_URL` ho
4. Dubai URL copy garera safe thaumma rakhnus (Step 4 ma chahinxa)

---

### Step 3: Vercel ma Deploy garne

1. vercel.com ma account banaunus (GitHub account le login garna milxa, easy huncha)
2. "Add New Project" > tapaiko GitHub repository (`office-docs-manager`) select garnus
3. "Import" click garnus
4. Deploy garna aghi, **Environment Variables** section ma yi sabai halnus:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Step 2 ko pooled connection string |
| `DIRECT_URL` | Step 2 ko direct connection string |
| `TEAM_ACCESS_PIN` | Tapaile aafai choose garnus (e.g. `847293` - kunai easy guess hune PIN nagarnus) |
| `ADMIN_DELETE_PIN` | Arko alag PIN, delete garna chahine (e.g. `519867`) |
| `SESSION_SECRET` | Random long string (tala "Secret Generate Garne" section hernus) |
| `CRON_SECRET` | Arko random string (trash auto-cleanup ko lagi) |

5. "Deploy" click garnus - 2-3 minute ma live huncha

**Secret Generate Garne**: `SESSION_SECRET` ra `CRON_SECRET` ko lagi, junsukai online
"random string generator" use garna sakinus, ya yo command chalauna sakinus (terminal xa vane):
```
openssl rand -base64 32
```

---

### Step 4: File Storage banaune (Vercel Blob)

Deploy vaisake pachi:
1. Vercel Dashboard > Project > **Storage** tab > **Create Database** > **Blob**
2. Banisake pachi, `BLOB_READ_WRITE_TOKEN` automatically environment variable ma add huncha
3. Project redeploy garnus (Storage tab bata automatically prompt garcha)

---

### Step 5: Database Structure banaune (Migration)

Deploy vaisake pachi, database ma table haru banaunu parxa:

1. Tapaiko computer ma yo project folder kholnus (terminal/command prompt bata)
2. `.env` file banaunus (`.env.example` lai copy garnus, naam `.env` rakhnus), ani Step 2 ra 3 ko values halnus
3. Yi commands chalaunus:
   ```
   npm install
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
   - `db push` le database ma sabai table banaunecha
   - `db seed` le default sections (Registration, VAT) ra default sectors (Road, Bridge, etc.) automatically thapnecha

---

### Step 6: Google Drive Backup Setup (Optional tara recommended)

Yo chai secondary backup ho - Vercel Blob down vaye pani documents safe rahos vanera.

1. console.cloud.google.com ma naya project banaunus
2. "APIs & Services" > "Enable APIs" > "Google Drive API" enable garnus
3. "Credentials" > "Create Credentials" > "Service Account" banaunus
4. Service account banisake pachi, "Keys" tab > "Add Key" > "JSON" download garnus
5. Teo JSON file kholera hernus - yeti values chahinxa:
   - `client_email` -> `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` -> `GOOGLE_PRIVATE_KEY`
6. Google Drive ma naya folder banaunus (e.g. "ErG Legal Documents Backup"), teo folder tapaiko service account email sanga **Share** garnus (Editor access)
7. Folder ko URL bata Folder ID copy garnus (URL ko lagi vagko sabai bhanda pachadiko part) -> `GOOGLE_DRIVE_BACKUP_FOLDER_ID`
8. Vercel Environment Variables ma yi 3 wota thapnus ani redeploy garnus

Yo step skip gare pani system chalinecha (Google Drive backup matra hunecha hina, Vercel Blob primary storage chai kaam garda jancha).

---

### Step 7: Auto-Purge Cron

`vercel.json` file le already 30-day trash cleanup ko schedule set gareko xa
(harek din 2 AM UTC ma chalinecha). Vercel le automatically yo detect garcha deploy garda,
kunai extra setup chahidaina - matra `CRON_SECRET` environment variable set bhako confirm garnus.

---

## System Use Garne Tarika

1. **Login**: `TEAM_ACCESS_PIN` halera team member haru login garchan
2. **Admin panel** (`/admin`): naya company add garne, custom document section/sector thapne
3. **Company page**: harek company ko documents herne, upload garne
4. **Download/Merge**: checkbox le documents select garera, number halera order set garera, "Download Merged PDF" click garne
5. **Delete**: Admin PIN chahine (30 din trash ma basera recover garna milne)
6. **Trash** (`/admin` > "Trash"): deleted documents restore garne

---

## Future Maintenance

- **Naya company thapne**: `/admin` bata direct add garna milne, code change chahidaina
- **Naya document section thapne**: `/admin` bata direct add garna milne
- **Naya sector thapne**: `/admin` bata direct add garna milne
- **PIN change garne**: Vercel dashboard > Environment Variables > `TEAM_ACCESS_PIN` ya `ADMIN_DELETE_PIN` update garera redeploy garnus

---

## Tech Stack Summary

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- PostgreSQL (Neon, free tier) via Prisma ORM
- Vercel Blob (primary file storage, free tier)
- Google Drive API (secondary backup)
- Vercel Cron (automatic 30-day trash purge)
- pdf-lib + sharp (PDF conversion, merging, compression)
