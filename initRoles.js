import Role from "./models/Role.js";

async function initializeRoles() {
  try {
    const count = await Role.estimatedDocumentCount();

    if (count === 0) {
      await Role.create({ name: "rider" });
      await Role.create({ name: "driver" });
      await Role.create({ name: "admin" });

      console.log("✅ Roles seeded successfully");
    }
  } catch (err) {
    console.error("❌ Error seeding roles:", err);
  }
}

export default initializeRoles;

