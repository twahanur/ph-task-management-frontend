# Customer Filter Keys (কাস্টমার ফিল্টার কী সমূহ)

## সব ফিল্টার কীগুলির তালিকা

### ১. মূল ফিল্টার (Basic Filters)

- `customerLevel` - কাস্টমার লেভেল (BRONZE_PENDING, BRONZE, SILVER, GOLD, PLATINUM)
- `gender` - লিঙ্গ (MALE, FEMALE, OTHER)
- `isMarried` - বিবাহিত কি না (true/false)
- `search` - নাম অথবা ফোন নাম্বার দিয়ে খুঁজুন (text)
- `hasChildren` - সন্তান আছে কি না (true/false)

### ২. লিড ফিল্টার (Lead Filters)

- `lead_status` - লিড স্ট্যাটাস (NEW, CONTACTED, QUALIFIED, CONVERTED, LOST)
- `lead_source` - লিড সোর্স (REFERRAL, WEBSITE, SOCIAL_MEDIA, ADVERTISEMENT, COLD_CALL, EVENT, OTHER)

### ৩. বয়স ও ব্যক্তিগত তথ্য (Age & Personal Info)

- `minAge` - সর্বনিম্ন বয়স (number)
- `maxAge` - সর্বোচ্চ বয়স (number)
- `bloodGroup` - রক্তের গ্রুপ (text)
- `maritalStatus` - বৈবাহিক অবস্থা (text)
- `hasMarriageAnniversary` - বিবাহ বার্ষিকী আছে কি না (true/false)

### ৪. ঠিকানা ফিল্টার (Location Filters)

- `city` - শহর (text)
- `division` - বিভাগ (text)
- `thana` - থানা (text)
- `postcode` - পোস্টকোড (text)

### ৫. পেশাগত তথ্য (Professional Info)

- `profession` - পেশা (text)
- `occupation` - পেশা/চাকরি (text)
- `incomeRange` - আয়ের রেঞ্জ (text)
- `educationLevel` - শিক্ষা স্তর (text)
- `companyName` - কোম্পানির নাম (text)
- `jobTitle` - পদবী (text)

### ৬. আগ্রহ ফিল্টার (Interests Filters)

- `interests` - একটি আগ্রহ খুঁজুন (text - যেমন: "fashion", "sports")

### ৭. সম্পৃক্ততা ফিল্টার (Engagement Filters)

- `hasOrders` - অর্ডার আছে কি না (true/false)
- `hasComplaints` - অভিযোগ আছে কি না (true/false)
- `hasAddresses` - ঠিকানা আছে কি না (true/false)
- `hasReminders` - রিমাইন্ডার আছে কি না (true/false)
- `hasContactLogs` - যোগাযোগ লগ আছে কি না (true/false)

### ৮. তারিখ ফিল্টার (Date Range Filters)

- `dateFrom` - তৈরির তারিখ থেকে (YYYY-MM-DD)
- `dateTo` - তৈরির তারিখ পর্যন্ত (YYYY-MM-DD)
- `lastContactedFrom` - শেষ যোগাযোগের তারিখ থেকে (YYYY-MM-DD)
- `lastContactedTo` - শেষ যোগাযোগের তারিখ পর্যন্ত (YYYY-MM-DD)

### ৯. সন্তানদের জন্মদিন ফিল্টার (Children Birthday Filters) ⭐ নতুন

- `childrenBirthdayDate` - নির্দিষ্ট জন্মদিনের তারিখ (YYYY-MM-DD) - শুধু মাস এবং দিন মিলবে
- `childrenBirthdayFrom` - জন্মদিন থেকে (YYYY-MM-DD)
- `childrenBirthdayTo` - জন্মদিন পর্যন্ত (YYYY-MM-DD)

### ১০. বিবাহ বার্ষিকী ফিল্টার (Marriage Anniversary Filters) ⭐ নতুন

- `marriageAnniversaryDate` - নির্দিষ্ট বার্ষিকীর তারিখ (YYYY-MM-DD)
- `marriageAnniversaryFrom` - বার্ষিকী থেকে (YYYY-MM-DD)
- `marriageAnniversaryTo` - বার্ষিকী পর্যন্ত (YYYY-MM-DD)

### ১১. পেজিনেশন (Pagination)

- `page` - পেজ নাম্বার (number, default: 1)
- `limit` - প্রতি পেজে কতটি দেখাবে (number, default: 10)
- `sortBy` - কোন ফিল্ড দিয়ে সর্ট করবে (text, default: "created_at")
- `sort` - সর্ট অর্ডার (asc/desc, default: "desc")

## উদাহরণ (Examples)

### ১. সন্তানদের জন্মদিন ফিল্টার

```bash
# ২০১৮ থেকে ২০২২ সালের মধ্যে যেসব কাস্টমারদের সন্তানদের জন্মদিন আছে
GET /api/v1/customers?childrenBirthdayFrom=2018-01-01&childrenBirthdayTo=2022-12-31&limit=10

# নির্দিষ্ট তারিখে (১৫ জানুয়ারী) জন্মদিন আছে এমন সন্তানদের কাস্টমার
GET /api/v1/customers?childrenBirthdayDate=2021-01-15&limit=10
```

### ২. বিবাহ বার্ষিকী ফিল্টার

```bash
# ২০২০ সালে যেসব কাস্টমারদের বিবাহ বার্ষিকী আছে
GET /api/v1/customers?marriageAnniversaryFrom=2020-01-01&marriageAnniversaryTo=2020-12-31&limit=10

# নির্দিষ্ট তারিখে (২০ নভেম্বর) বিবাহ বার্ষিকী আছে
GET /api/v1/customers?marriageAnniversaryDate=2020-11-20&limit=10
```

### ৩. একাধিক ফিল্টার একসাথে

```bash
# ঢাকা শহরে যেসব মহিলা কাস্টমারদের সন্তান আছে এবং অর্ডার আছে
GET /api/v1/customers?city=Dhaka&gender=FEMALE&hasChildren=true&hasOrders=true&limit=10

# ফ্যাশন এ আগ্রহী, বিবাহিত এবং সিলভার লেভেলের কাস্টমার
GET /api/v1/customers?interests=fashion&isMarried=true&customerLevel=SILVER&limit=10

# যেসব কাস্টমারদের সন্তানদের জন্মদিন ২০২১ সালে এবং বিবাহ বার্ষিকী আছে
GET /api/v1/customers?childrenBirthdayFrom=2021-01-01&childrenBirthdayTo=2021-12-31&hasMarriageAnniversary=true&limit=10
```

### ৪. খুঁজে পাওয়া (Search)

```bash
# নাম বা ফোন নাম্বার দিয়ে খুঁজুন
GET /api/v1/customers?search=Rahman&limit=10
GET /api/v1/customers?search=+88017&limit=10
```

### ৫. তারিখ রেঞ্জ ফিল্টার

```bash
# গত ৩০ দিনে যোগ হওয়া কাস্টমার
GET /api/v1/customers?dateFrom=2026-01-23&dateTo=2026-02-22&limit=10

# গত সপ্তাহে যাদের সাথে যোগাযোগ করা হয়েছে
GET /api/v1/customers?lastContactedFrom=2026-02-15&lastContactedTo=2026-02-22&limit=10
```

## নোট (Notes)

- সব তারিখ ISO 8601 ফরম্যাটে দিতে হবে (YYYY-MM-DD)
- একাধিক ফিল্টার একসাথে ব্যবহার করা যাবে (AND লজিক)
- সব ফিল্টার optional, কোনটি না দিলে সব কাস্টমার রিটার্ন করবে
- `childrenBirthdayDate` ফিল্টারে শুধু মাস এবং দিন চেক করে, বছর নয়
- `marriageAnniversaryDate` ফিল্টারে নির্দিষ্ট তারিখের ±১ বছরের বার্ষিকী খুঁজে
