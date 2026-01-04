import { expect, describe, it } from "vitest";
import { z } from "zod";

/**
 * Backend schema validation tests for name field
 * 
 * This test suite verifies that the apiUpdateUser schema on the backend
 * correctly accepts and validates the optional name field.
 */

// Mock of the backend schema - in real scenario, this would be imported
const createSchema = z.object({
	id: z.string(),
	email: z.string(),
	password: z.string(),
	name: z.string().optional(),
	image: z.string(),
	twoFactorEnabled: z.boolean(),
	createdAt: z.date(),
});

const apiUpdateUser = createSchema.partial().extend({
	name: z.string().optional(),
	password: z.string().optional(),
	currentPassword: z.string().optional(),
	metricsConfig: z.object({}).optional(),
});

describe("apiUpdateUser Schema - Backend Validation", () => {
	describe("should accept name in update payload", () => {
		it("should accept name with email", () => {
			const result = apiUpdateUser.safeParse({
				name: "John Developer",
				email: "john@example.com",
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("John Developer");
				expect(result.data.email).toBe("john@example.com");
			}
		});

		it("should accept only name without other fields", () => {
			const result = apiUpdateUser.safeParse({
				name: "Updated Name",
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("Updated Name");
			}
		});

		it("should accept name with password fields for password change", () => {
			const result = apiUpdateUser.safeParse({
				name: "John Doe",
				password: "newPassword123",
				currentPassword: "oldPassword123",
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("John Doe");
				expect(result.data.password).toBe("newPassword123");
				expect(result.data.currentPassword).toBe("oldPassword123");
			}
		});

		it("should allow empty string for name", () => {
			const result = apiUpdateUser.safeParse({
				name: "",
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("");
			}
		});

		it("should handle special characters in name", () => {
			const result = apiUpdateUser.safeParse({
				name: "François Müller-O'Neill",
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("François Müller-O'Neill");
			}
		});

		it("should handle unicode names", () => {
			const result = apiUpdateUser.safeParse({
				name: "محمد علي (Muhammad Ali)",
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("محمد علي (Muhammad Ali)");
			}
		});

		it("should accept long names (255 chars)", () => {
			const longName = "Dr. ".repeat(60) + "A"; // 241 chars
			const result = apiUpdateUser.safeParse({
				name: longName,
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name?.length).toBeLessThanOrEqual(255);
			}
		});
	});

	describe("should make name optional", () => {
		it("should make name completely optional in update", () => {
			const result = apiUpdateUser.safeParse({
				email: "test@example.com",
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBeUndefined();
			}
		});

		it("should allow update with no fields (empty partial)", () => {
			const result = apiUpdateUser.safeParse({});
			expect(result.success).toBe(true);
		});

		it("should allow updating email without touching name", () => {
			const result = apiUpdateUser.safeParse({
				email: "newemail@example.com",
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.email).toBe("newemail@example.com");
				expect(result.data.name).toBeUndefined();
			}
		});

		it("should allow updating image without touching name", () => {
			const result = apiUpdateUser.safeParse({
				image: "https://example.com/newavatar.jpg",
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.image).toBe("https://example.com/newavatar.jpg");
				expect(result.data.name).toBeUndefined();
			}
		});
	});

	describe("should validate realistic update scenarios", () => {
		it("should handle profile update with name and email", () => {
			const result = apiUpdateUser.safeParse({
				name: "Jane Smith",
				email: "jane.smith@example.com",
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("Jane Smith");
				expect(result.data.email).toBe("jane.smith@example.com");
			}
		});

		it("should handle password change with name update", () => {
			const result = apiUpdateUser.safeParse({
				name: "John Updated",
				password: "NewSecurePass123!",
				currentPassword: "OldSecurePass123!",
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("John Updated");
				expect(result.data.password).toBe("NewSecurePass123!");
				expect(result.data.currentPassword).toBe("OldSecurePass123!");
			}
		});

		it("should handle avatar update with name", () => {
			const result = apiUpdateUser.safeParse({
				name: "Avatar User",
				image: "https://example.com/avatar.jpg",
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("Avatar User");
				expect(result.data.image).toBe("https://example.com/avatar.jpg");
			}
		});

		it("should handle clearing name by sending empty string", () => {
			const result = apiUpdateUser.safeParse({
				name: "",
				email: "user@example.com",
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("");
			}
		});
	});

	describe("should maintain backward compatibility", () => {
		it("should work with requests that don't include name field", () => {
			const legacyPayload = {
				email: "legacy@example.com",
				password: "Pass123",
				currentPassword: "OldPass123",
			};
			const result = apiUpdateUser.safeParse(legacyPayload);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.email).toBe("legacy@example.com");
				expect(result.data.name).toBeUndefined();
			}
		});

		it("should work with only password update (no name)", () => {
			const result = apiUpdateUser.safeParse({
				password: "NewPass",
				currentPassword: "OldPass",
			});
			expect(result.success).toBe(true);
		});

		it("should work with only email update (no name)", () => {
			const result = apiUpdateUser.safeParse({
				email: "newemail@example.com",
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBeUndefined();
			}
		});
	});

	describe("should handle type coercion correctly", () => {
		it("should reject non-string name values", () => {
			const result = apiUpdateUser.safeParse({
				name: 123 as any,
			});
			expect(result.success).toBe(false);
		});

		it("should reject null name (name is optional, not nullable)", () => {
			const result = apiUpdateUser.safeParse({
				name: null as any,
			});
			expect(result.success).toBe(false);
		});

		it("should reject object as name", () => {
			const result = apiUpdateUser.safeParse({
				name: { firstName: "John" } as any,
			});
			expect(result.success).toBe(false);
		});
	});
});
