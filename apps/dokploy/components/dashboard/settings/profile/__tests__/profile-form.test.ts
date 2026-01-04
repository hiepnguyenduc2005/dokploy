import { expect, describe, it } from "vitest";
import { z } from "zod";

/**
 * Profile form schema validation tests for name field
 * 
 * This test suite verifies that the frontend profileSchema correctly accepts
 * and validates the optional name field alongside existing fields.
 */

// Copy of the schema from profile-form.tsx for testing
const profileSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
	name: z.string().optional(),
	password: z.string().nullable(),
	currentPassword: z.string().nullable(),
	image: z.string().optional(),
	allowImpersonation: z.boolean().optional().default(false),
});

type Profile = z.infer<typeof profileSchema>;

describe("profileSchema - Name Field Validation", () => {
	describe("should accept name field", () => {
		it("should accept optional name field with valid string", () => {
			const result = profileSchema.safeParse({
				email: "test@example.com",
				name: "John Doe",
				password: null,
				currentPassword: null,
				image: "",
				allowImpersonation: false,
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("John Doe");
			}
		});

		it("should allow empty string for name", () => {
			const result = profileSchema.safeParse({
				email: "test@example.com",
				name: "",
				password: null,
				currentPassword: null,
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("");
			}
		});

		it("should allow undefined name", () => {
			const result = profileSchema.safeParse({
				email: "test@example.com",
				password: null,
				currentPassword: null,
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBeUndefined();
			}
		});

		it("should handle special characters in name", () => {
			const result = profileSchema.safeParse({
				email: "test@example.com",
				name: "Jean-François O'Brien",
				password: null,
				currentPassword: null,
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("Jean-François O'Brien");
			}
		});

		it("should accept long names (up to 255 characters)", () => {
			const longName = "A".repeat(255);
			const result = profileSchema.safeParse({
				email: "test@example.com",
				name: longName,
				password: null,
				currentPassword: null,
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe(longName);
				expect(result.data.name?.length).toBe(255);
			}
		});

		it("should handle unicode characters in name", () => {
			const result = profileSchema.safeParse({
				email: "test@example.com",
				name: "李明 (Li Ming)",
				password: null,
				currentPassword: null,
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("李明 (Li Ming)");
			}
		});

		it("should handle names with multiple spaces", () => {
			const result = profileSchema.safeParse({
				email: "test@example.com",
				name: "John    Q    Public",
				password: null,
				currentPassword: null,
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("John    Q    Public");
			}
		});
	});

	describe("should validate name as optional", () => {
		it("should not require name field for form submission", () => {
			const minimalData = {
				email: "test@example.com",
				password: null,
				currentPassword: null,
			};
			const result = profileSchema.safeParse(minimalData);
			expect(result.success).toBe(true);
		});

		it("should work with partial updates (only name)", () => {
			const nameUpdate = {
				email: "test@example.com",
				name: "New Name",
				password: null,
				currentPassword: null,
			};
			const result = profileSchema.safeParse(nameUpdate);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("New Name");
				expect(result.data.email).toBe("test@example.com");
			}
		});

		it("should coerce type of undefined to undefined (not null)", () => {
			const result = profileSchema.safeParse({
				email: "test@example.com",
				password: null,
				currentPassword: null,
				// name is deliberately omitted
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBeUndefined();
			}
		});
	});

	describe("should maintain backward compatibility", () => {
		it("should work with existing profile data without name", () => {
			const legacyProfile = {
				email: "legacy@example.com",
				password: null,
				currentPassword: null,
				image: "https://example.com/avatar.jpg",
				allowImpersonation: true,
			};
			const result = profileSchema.safeParse(legacyProfile);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.email).toBe("legacy@example.com");
				expect(result.data.image).toBe("https://example.com/avatar.jpg");
				expect(result.data.allowImpersonation).toBe(true);
				expect(result.data.name).toBeUndefined();
			}
		});

		it("should handle all fields together", () => {
			const completeProfile: Profile = {
				email: "complete@example.com",
				name: "Complete User",
				password: "newpass",
				currentPassword: "oldpass",
				image: "https://example.com/avatar.jpg",
				allowImpersonation: true,
			};
			const result = profileSchema.safeParse(completeProfile);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("Complete User");
				expect(result.data.email).toBe("complete@example.com");
				expect(result.data.password).toBe("newpass");
				expect(result.data.currentPassword).toBe("oldpass");
				expect(result.data.image).toBe("https://example.com/avatar.jpg");
				expect(result.data.allowImpersonation).toBe(true);
			}
		});
	});

	describe("should validate email requirement", () => {
		it("should reject missing email even with name provided", () => {
			const result = profileSchema.safeParse({
				name: "John Doe",
				password: null,
				currentPassword: null,
			});
			expect(result.success).toBe(false);
		});
	});

	describe("should validate email format and non-empty", () => {
		it("should reject empty email string", () => {
			const result = profileSchema.safeParse({
				email: "",
				name: "John Doe",
				password: null,
				currentPassword: null,
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Email is required");
			}
		});

		it("should reject email without domain", () => {
			const result = profileSchema.safeParse({
				email: "notanemail",
				name: "John Doe",
				password: null,
				currentPassword: null,
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Please enter a valid email address",
				);
			}
		});

		it("should reject email with missing local part", () => {
			const result = profileSchema.safeParse({
				email: "@example.com",
				name: "John Doe",
				password: null,
				currentPassword: null,
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Please enter a valid email address",
				);
			}
		});

		it("should reject email with missing domain extension", () => {
			const result = profileSchema.safeParse({
				email: "test@example",
				name: "John Doe",
				password: null,
				currentPassword: null,
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Please enter a valid email address",
				);
			}
		});

		it("should accept valid email formats", () => {
			const validEmails = [
				"test@example.com",
				"user.name@example.co.uk",
				"first+last@subdomain.example.com",
				"123@example.com",
				"test@example-domain.com",
			];

			validEmails.forEach((email) => {
				const result = profileSchema.safeParse({
					email,
					name: "John Doe",
					password: null,
					currentPassword: null,
				});
				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data.email).toBe(email);
				}
			});
		});

		it("should prevent saving profile with cleared email", () => {
			// This is the main bug being fixed - users should not be able to clear the email and save
			const result = profileSchema.safeParse({
				email: "", // User cleared the email field
				password: null,
				currentPassword: null,
				image: "/avatars/avatar-1.png",
				allowImpersonation: false,
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Email is required");
			}
		});
	});
});
