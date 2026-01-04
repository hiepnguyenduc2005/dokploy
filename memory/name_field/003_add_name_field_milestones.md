# Add Name Field to User Profile Form - Implementation Milestones

**Design Document Reference:** `001_add_name_field_design.md`

**Overall Timeline:** ~4-6 hours of development work across 7 focused milestones

---

## Milestone 1: Backend Schema Update

**Objective:** Extend the `apiUpdateUser` Zod schema to accept name field

**Files Changed:**
- `packages/server/src/db/schema/user.ts`

**Changes:**

- [ ] Locate `apiUpdateUser` schema definition (line 299)
- [ ] Add `name: z.string().optional()` to schema fields
- [ ] Ensure name is properly typed as optional string
- [ ] Verify no breaking changes to existing schema fields

**Code Changes:**

**File:** `packages/server/src/db/schema/user.ts` (around line 299)

```typescript
// BEFORE:
export const apiUpdateUser = createSchema.partial().extend({
    password: z.string().optional(),
    currentPassword: z.string().optional(),
    metricsConfig: z.object({...}).optional(),
});

// AFTER:
export const apiUpdateUser = createSchema.partial().extend({
    name: z.string().optional(),              // ← ADD THIS LINE
    password: z.string().optional(),
    currentPassword: z.string().optional(),
    metricsConfig: z.object({...}).optional(),
});
```

**Testing:**

- [ ] Run: `npm run type-check` (verify TypeScript compilation succeeds)
- [ ] Run: `npm run test -- schema` (if schema tests exist)
- [ ] Verify no TypeScript errors in terminal
- [ ] Confirm `apiUpdateUser` imports are still valid in router files

**Verification Checklist:**

- [ ] Schema compiles without errors
- [ ] No TypeScript type errors introduced
- [ ] `name` field is typed as `string | undefined`
- [ ] Backward compatibility maintained (field is optional)

**Dependencies:**
- None—this is isolated schema change

**Time Estimate:** 10-15 minutes

---

## Milestone 2: Frontend Form Schema Update

**Objective:** Extend frontend `profileSchema` in ProfileForm component to accept name field

**Files Changed:**
- `apps/dokploy/components/dashboard/settings/profile/profile-form.tsx`

**Changes:**

- [ ] Locate `profileSchema` Zod definition (line 35)
- [ ] Add `name: z.string().optional()` field
- [ ] Update Profile type (auto-inferred from Zod schema)

**Code Changes:**

**File:** `apps/dokploy/components/dashboard/settings/profile/profile-form.tsx` (line 35)

```typescript
// BEFORE:
const profileSchema = z.object({
    email: z.string(),
    password: z.string().nullable(),
    currentPassword: z.string().nullable(),
    image: z.string().optional(),
    allowImpersonation: z.boolean().optional().default(false),
});

// AFTER:
const profileSchema = z.object({
    email: z.string(),
    name: z.string().optional(),              // ← ADD THIS LINE
    password: z.string().nullable(),
    currentPassword: z.string().nullable(),
    image: z.string().optional(),
    allowImpersonation: z.boolean().optional().default(false),
});
```

**Testing:**

- [ ] Run: `npm run dev` (start dev server)
- [ ] Navigate to Profile settings page
- [ ] Open browser DevTools Console
- [ ] Verify no TypeScript errors in console
- [ ] Verify Profile type auto-updates (check IDE type hints)

**Verification Checklist:**

- [ ] Frontend compiles without errors
- [ ] No console errors when loading profile page
- [ ] `Profile` type includes `name?: string`
- [ ] TypeScript IntelliSense shows `name` field

**Dependencies:**
- Milestone 1 (schema layer ready)

**Time Estimate:** 10-15 minutes

---

## Milestone 3: Add Name FormField to UI

**Objective:** Render name input field in the profile form

**Files Changed:**
- `apps/dokploy/components/dashboard/settings/profile/profile-form.tsx`

**Changes:**

- [ ] Locate form rendering section (around line 200)
- [ ] Add new FormField for name input
- [ ] Place field after email and before password fields
- [ ] Use same pattern as existing FormFields (email, password, image, etc.)

**Code Changes:**

**File:** `apps/dokploy/components/dashboard/settings/profile/profile-form.tsx` (insert after email FormField, around line 220)

```typescript
// ADD THIS FIELD BLOCK after email field:
<FormField
    control={form.control}
    name="name"
    render={({ field }) => (
        <FormItem>
            <FormLabel>{t("settings.profile.name")}</FormLabel>
            <FormControl>
                <Input
                    placeholder={t("settings.profile.name")}
                    {...field}
                    value={field.value || ""}
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    )}
/>
```

**Testing:**

- [ ] Start dev server: `npm run dev`
- [ ] Navigate to Profile settings page (`/dashboard/settings/profile`)
- [ ] Visually inspect form layout
- [ ] Verify name input field appears after email field
- [ ] Verify input accepts text input (type in field, observe value change)
- [ ] Verify field label displays (may show translation key if i18n not done yet)
- [ ] Verify error messages display beneath field (if validation fails)

**Manual Testing Steps:**

1. Navigate to profile page
2. Click on name input field
3. Type: "Test Name"
4. Observe: Value updates in real-time
5. Verify: Form state updates (React Hook Form tracks changes)

**Verification Checklist:**

- [ ] Name input field renders in form
- [ ] Input field is editable (can type text)
- [ ] Input field position is logical (after email)
- [ ] FormField styling matches other fields
- [ ] Error messages can display beneath field
- [ ] No console errors when interacting with field

**Dependencies:**
- Milestone 2 (form schema ready)

**Time Estimate:** 15-20 minutes

---

## Milestone 4: Initialize Form with Name Data

**Objective:** Populate form with existing name value on page load

**Files Changed:**
- `apps/dokploy/components/dashboard/settings/profile/profile-form.tsx`

**Changes:**

- [ ] Update `useForm` hook `defaultValues` to include name
- [ ] Update `useEffect` that populates form with fetched user data
- [ ] Add name to form.reset() call

**Code Changes:**

**File:** `apps/dokploy/components/dashboard/settings/profile/profile-form.tsx`

**Change 1** - Line ~83 (useForm defaultValues):

```typescript
// BEFORE:
const form = useForm<Profile>({
    defaultValues: {
        email: data?.user?.email || "",
        password: "",
        image: data?.user?.image || "",
        currentPassword: "",
        allowImpersonation: data?.user?.allowImpersonation || false,
    },
    resolver: zodResolver(profileSchema),
});

// AFTER:
const form = useForm<Profile>({
    defaultValues: {
        name: data?.user?.name || "",           // ← ADD THIS LINE
        email: data?.user?.email || "",
        password: "",
        image: data?.user?.image || "",
        currentPassword: "",
        allowImpersonation: data?.user?.allowImpersonation || false,
    },
    resolver: zodResolver(profileSchema),
});
```

**Change 2** - Line ~97 (useEffect form.reset):

```typescript
// BEFORE:
form.reset(
    {
        email: data?.user?.email || "",
        password: form.getValues("password") || "",
        image: data?.user?.image || "",
        currentPassword: form.getValues("currentPassword") || "",
        allowImpersonation: data?.user?.allowImpersonation,
    },
    { keepValues: true },
);

// AFTER:
form.reset(
    {
        name: data?.user?.name || "",           // ← ADD THIS LINE
        email: data?.user?.email || "",
        password: form.getValues("password") || "",
        image: data?.user?.image || "",
        currentPassword: form.getValues("currentPassword") || "",
        allowImpersonation: data?.user?.allowImpersonation,
    },
    { keepValues: true },
);
```

**Testing:**

- [ ] Start dev server
- [ ] Navigate to profile page with authenticated user
- [ ] Verify name field is pre-populated with user's name
- [ ] If user has no name (empty string), field shows empty
- [ ] Manually update name in database (or use API directly)
- [ ] Refresh page
- [ ] Verify new name value appears in form field

**Manual Testing Steps:**

1. Load profile page
2. Observe name field contains existing name (or empty if not set)
3. Verify form state matches API response
4. (Optional) Update name via curl/Postman
5. Refresh page
6. Verify updated name loads

**Verification Checklist:**

- [ ] Form initializes with user's current name
- [ ] Name field reflects data from `data?.user?.name`
- [ ] Form resets correctly when data changes
- [ ] Empty name displays as empty field (not null/undefined)
- [ ] No console errors on page load

**Dependencies:**
- Milestone 3 (field renders)
- API already returns name in user data

**Time Estimate:** 15-20 minutes

---

## Milestone 5: Update Form Submission Logic

**Objective:** Include name field in form submission payload

**Files Changed:**
- `apps/dokploy/components/dashboard/settings/profile/profile-form.tsx`

**Changes:**

- [ ] Locate `onSubmit` handler (line ~109)
- [ ] Add `name` field to mutation payload

**Code Changes:**

**File:** `apps/dokploy/components/dashboard/settings/profile/profile-form.tsx` (line ~109)

```typescript
// BEFORE:
const onSubmit = async (values: Profile) => {
    await mutateAsync({
        email: values.email.toLowerCase(),
        password: values.password || undefined,
        image: values.image,
        currentPassword: values.currentPassword || undefined,
        allowImpersonation: values.allowImpersonation,
    })

// AFTER:
const onSubmit = async (values: Profile) => {
    await mutateAsync({
        name: values.name,                      // ← ADD THIS LINE
        email: values.email.toLowerCase(),
        password: values.password || undefined,
        image: values.image,
        currentPassword: values.currentPassword || undefined,
        allowImpersonation: values.allowImpersonation,
    })
```

**Testing:**

- [ ] Start dev server
- [ ] Navigate to profile page
- [ ] Update name field: "Old Name" → "New Name"
- [ ] Click Save button
- [ ] Observe success toast: "Profile Updated"
- [ ] Verify form field retains new value
- [ ] (Optional) Verify database persisted update (check DB directly)
- [ ] Refresh page
- [ ] Verify name persisted: field still shows "New Name"

**Manual Testing Steps:**

1. Load profile page
2. Change name field to "Test User Name"
3. Click Save button
4. Observe success notification
5. Form should reset with new value
6. Refresh page (F5)
7. Verify name persists

**Verification Checklist:**

- [ ] Name is included in mutation payload
- [ ] Save button works without errors
- [ ] Success toast appears after submission
- [ ] Form retains submitted value
- [ ] Name persists after page refresh
- [ ] No console errors during submission

**Dependencies:**
- Milestone 4 (form initialization)
- Milestone 1 (backend schema accepts name)

**Time Estimate:** 10-15 minutes

---

## Milestone 6: Add i18n Translations

**Objective:** Add translation keys for name field label and placeholder

**Files Changed:**
- Translation files for supported languages (at minimum English)

**Changes:**

- [ ] Find translation files for settings (likely `public/locales/en/settings.json`)
- [ ] Add `"name": "Display Name"` key to profile section
- [ ] Add similar translations for other language files

**Code Changes:**

**File:** `public/locales/en/settings.json` (or similar structure)

```json
// BEFORE:
{
    "settings": {
        "profile": {
            "email": "Email Address",
            "password": "Password",
            "avatar": "Avatar",
            ...
        }
    }
}

// AFTER:
{
    "settings": {
        "profile": {
            "name": "Display Name",              // ← ADD THIS LINE
            "email": "Email Address",
            "password": "Password",
            "avatar": "Avatar",
            ...
        }
    }
}
```

**Testing:**

- [ ] Verify translation file structure
- [ ] Check for syntax errors in JSON (use JSON validator)
- [ ] Start dev server
- [ ] Navigate to profile page
- [ ] Verify name field label shows "Display Name" (not translation key)
- [ ] Verify placeholder text is correct
- [ ] (Optional) Test with other language locales

**Manual Testing Steps:**

1. Start dev server
2. Navigate to profile page
3. Look for name field label
4. Verify it shows "Display Name" (not `t("settings.profile.name")`)
5. Optionally switch locale/language
6. Verify translation updates

**Verification Checklist:**

- [ ] Translation file has valid JSON syntax
- [ ] Name field label displays translated text
- [ ] Placeholder text renders correctly
- [ ] No console warnings about missing translations
- [ ] Other language locales include translation (if applicable)

**Dependencies:**
- Milestone 3 (field renders with translation key)

**Time Estimate:** 10-15 minutes

---

## Milestone 7: Integration Testing & Verification

**Objective:** Verify entire flow works end-to-end and create test coverage

**Files Changed:**
- Test files (create if needed)

**Changes:**

- [ ] Create or update unit tests for profileSchema validation
- [ ] Create or update integration test for user.update endpoint
- [ ] Create or update E2E test for profile form submission

**Test Coverage:**

### Test 1: Frontend Validation

**File:** `apps/dokploy/components/dashboard/settings/profile/__tests__/profile-form.test.ts`

```typescript
describe('profileSchema', () => {
    it('should accept optional name field', () => {
        const schema = profileSchema;
        const result = schema.safeParse({
            email: 'test@example.com',
            name: 'John Doe',
            password: null,
            currentPassword: null,
            image: '',
            allowImpersonation: false,
        });
        expect(result.success).toBe(true);
    });

    it('should allow empty name', () => {
        const result = profileSchema.safeParse({
            email: 'test@example.com',
            name: '',
            password: null,
            currentPassword: null,
        });
        expect(result.success).toBe(true);
    });

    it('should allow undefined name', () => {
        const result = profileSchema.safeParse({
            email: 'test@example.com',
            password: null,
            currentPassword: null,
        });
        expect(result.success).toBe(true);
    });
});
```

### Test 2: Backend Validation

**File:** `packages/server/src/db/schema/__tests__/user.schema.test.ts`

```typescript
describe('apiUpdateUser schema', () => {
    it('should accept name in payload', () => {
        const result = apiUpdateUser.safeParse({
            name: 'John Doe',
            email: 'john@example.com',
        });
        expect(result.success).toBe(true);
    });

    it('should make name optional', () => {
        const result = apiUpdateUser.safeParse({
            email: 'john@example.com',
        });
        expect(result.success).toBe(true);
    });
});
```

### Test 3: API Integration

**File:** E2E test for user.update endpoint

```typescript
describe('user.update mutation', () => {
    it('should update user name', async () => {
        const result = await trpcCaller.user.update({
            name: 'Updated Name',
            email: 'test@example.com',
        });
        expect(result.name).toBe('Updated Name');
    });

    it('should persist name to database', async () => {
        await trpcCaller.user.update({ name: 'Test Name' });
        const user = await db.query.users_temp.findFirst({
            where: eq(users_temp.id, userId),
        });
        expect(user.name).toBe('Test Name');
    });
});
```

**Testing:**

- [ ] Run: `npm test` (run all test suites)
- [ ] Verify frontend validation tests pass
- [ ] Verify backend validation tests pass
- [ ] Verify API integration tests pass
- [ ] Check test coverage (aim for >80%)

**Manual Testing Workflow:**

1. **Setup:** Start dev server and open profile page
2. **Test 1 - Empty Name:**
   - Clear name field
   - Click Save
   - Verify success (name can be empty)
   - Refresh and verify empty persists

3. **Test 2 - Update Name:**
   - Enter "John Developer"
   - Click Save
   - Verify toast shows "Profile Updated"
   - Form retains value
   - Refresh page, verify persists

4. **Test 3 - Special Characters:**
   - Enter "Jean-François O'Brien"
   - Click Save
   - Verify updates successfully
   - Refresh, verify persists

5. **Test 4 - Long Name:**
   - Enter 255-character string
   - Click Save
   - Verify updates
   - Try 256+ characters (optional, depends on validation)
   - Verify error or truncation behavior

6. **Test 5 - Other Fields Still Work:**
   - Update email, name, and avatar all together
   - Click Save
   - Verify all persist correctly

**Verification Checklist:**

- [ ] Frontend validation tests pass
- [ ] Backend validation tests pass
- [ ] API integration tests pass
- [ ] Test coverage improved (new tests written)
- [ ] Manual test 1: Empty name works
- [ ] Manual test 2: Update and persist name
- [ ] Manual test 3: Special characters preserved
- [ ] Manual test 4: Long names handled
- [ ] Manual test 5: Multi-field updates work
- [ ] No regressions in existing tests
- [ ] All existing profile functionality still works

**Dependencies:**
- Milestones 1-6 (complete implementation)

**Time Estimate:** 1-2 hours (including test writing and manual verification)

---

## Milestone 8: Final QA & Documentation

**Objective:** Complete testing, verify no regressions, and document findings

**Files Changed:**
- None (QA-only milestone)

**Manual QA Checklist:**

- [ ] **Browser Compatibility:**
  - [ ] Chrome/Chromium
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

- [ ] **Responsive Design:**
  - [ ] Desktop (1920x1080)
  - [ ] Tablet (768x1024)
  - [ ] Mobile (375x667)

- [ ] **Form Interaction:**
  - [ ] Focus states work (keyboard navigation)
  - [ ] Form submission on Enter key
  - [ ] Error messages display
  - [ ] Success toast displays

- [ ] **Data Persistence:**
  - [ ] Name persists after browser close/reopen
  - [ ] Name persists across multiple updates
  - [ ] Concurrent updates handled (last write wins)

- [ ] **Performance:**
  - [ ] Form load time < 2s
  - [ ] Submit time < 1s
  - [ ] No UI freezes during submission

- [ ] **Regression Testing:**
  - [ ] Email update still works
  - [ ] Password update still works
  - [ ] Avatar selection still works
  - [ ] 2FA settings still work
  - [ ] API Keys section still works

**Documentation Tasks:**

- [ ] Update README if needed
- [ ] Add inline code comments for complex logic
- [ ] Document any breaking changes (should be none)
- [ ] Create PR description with testing results

**Manual QA Test Scenarios:**

**Scenario 1: Fresh Profile Update**
```
1. Login as fresh user (no name set)
2. Navigate to Profile
3. Name field should show empty
4. Enter "Alice Developer"
5. Save
6. Verify persists after refresh
```

**Scenario 2: Existing Name Update**
```
1. Login as user with existing name "Bob"
2. Navigate to Profile
3. Name field shows "Bob"
4. Change to "Robert"
5. Save
6. Verify change persists
```

**Scenario 3: Multi-field Update**
```
1. Update email, name, and image all at once
2. Save
3. Verify all three changes persist
4. Verify no partial updates (all-or-nothing)
```

**Scenario 4: Error Handling**
```
1. Trigger network error (DevTools offline mode)
2. Try to save
3. Verify error toast shows
4. Form state unchanged
5. Retry after reconnecting
```

**Verification Checklist:**

- [ ] All manual QA scenarios pass
- [ ] No console errors in any browser
- [ ] No accessibility violations (a11y scan)
- [ ] Loading states show correctly
- [ ] All error states handled gracefully
- [ ] No regressions in other form fields
- [ ] Performance meets expectations

**Sign-Off:**

- [ ] QA passes all checks
- [ ] Product Owner approves
- [ ] Ready for production deployment

**Time Estimate:** 1-2 hours

---

## Milestone Summary Table

| # | Milestone | Status | Files | Est. Time | Dependencies |
|---|-----------|--------|-------|-----------|--------------|
| 1 | Backend Schema Update | ⏳ Not Started | 1 | 15 min | None |
| 2 | Frontend Form Schema Update | ⏳ Not Started | 1 | 15 min | M1 |
| 3 | Add Name FormField to UI | ⏳ Not Started | 1 | 20 min | M2 |
| 4 | Initialize Form with Name Data | ⏳ Not Started | 1 | 20 min | M3 |
| 5 | Update Form Submission Logic | ⏳ Not Started | 1 | 15 min | M1, M4 |
| 6 | Add i18n Translations | ⏳ Not Started | 1+ | 15 min | M3 |
| 7 | Integration Testing & Verification | ⏳ Not Started | 2+ | 1-2 hrs | M1-M6 |
| 8 | Final QA & Documentation | ⏳ Not Started | 0 | 1-2 hrs | M1-M7 |

**Total Estimated Time:** 4-6 hours

---

## Implementation Tips

### General Guidelines

1. **Test after each milestone:** Don't skip testing—catch issues early
2. **Keep commits small:** One commit per milestone makes debugging easier
3. **Write tests as you go:** Don't defer testing to the end
4. **Use feature branch:** Create `feature/add-name-field` branch
5. **Document as you code:** Add comments explaining non-obvious logic

### Useful Commands

```bash
# Start dev server
npm run dev

# Run type checking
npm run type-check

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Lint code
npm run lint

# Format code
npm run format
```

### Git Workflow Suggestion

```bash
# Create feature branch
git checkout -b feature/add-name-field

# After each milestone, commit
git add .
git commit -m "Milestone 1: Backend schema update"

# Push to remote
git push origin feature/add-name-field

# Create PR when ready for review
# Merge after approval
```

---

## Verification Tracking

Print out this section and check boxes as you complete each milestone:

- [ ] **M1 Complete** ✓ Backend schema accepts name field
- [ ] **M2 Complete** ✓ Frontend form schema includes name field
- [ ] **M3 Complete** ✓ Name input field renders in UI
- [ ] **M4 Complete** ✓ Form loads existing name data
- [ ] **M5 Complete** ✓ Form submission includes name
- [ ] **M6 Complete** ✓ Translations display correctly
- [ ] **M7 Complete** ✓ All tests pass, no regressions
- [ ] **M8 Complete** ✓ Final QA passes, ready to merge

**Overall Status:** ⏳ Ready to begin implementation

---

## Next Steps

1. **Before starting M1:** Review design document (`001_add_name_field_design.md`)
2. **Start with M1:** Make backend schema change
3. **Follow sequentially:** Each milestone builds on previous ones
4. **Test thoroughly:** Manual testing is essential
5. **Keep PRs small:** Consider 1-2 milestones per PR
6. **Get code review:** Have teammates review before merging
7. **Deploy to staging first:** Verify in staging before production

---

## Support & Debugging

**If you encounter issues:**

1. Check console errors (browser DevTools)
2. Check server logs (terminal where `npm run dev` runs)
3. Verify TypeScript compilation (`npm run type-check`)
4. Run tests to isolate issues (`npm test`)
5. Review design doc for context

**Common Issues & Solutions:**

| Issue | Solution |
|-------|----------|
| Form field not showing | Verify Milestone 3 completed; check i18n keys exist |
| Name not saving | Check Milestone 5 submission includes name; verify API schema accepts it |
| Type errors on profile | Ensure Milestone 2 updates Profile type correctly |
| Tests failing | Run `npm test -- --watch` to debug incrementally |
| Translation key showing | Ensure i18n file has translation (Milestone 6) |

---

## Sign-Off & Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Developer | | | ⏳ Ready |
| Reviewer | | | ⏳ Pending |
| QA | | | ⏳ Pending |

