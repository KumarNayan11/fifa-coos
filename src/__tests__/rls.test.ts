import { describe, it, expect } from "vitest";

// A simplified mock of how a Supabase client might respond based on the RLS rules defined in migration.sql
// In a real environment, this would hit the Supabase local emulator (e.g. pgTAP or direct JS client).

type Role = "anon" | "fan" | "volunteer" | "ops_manager" | "security" | "admin";

function createMockSupabaseClient(role: Role, uid?: string) {
  return {
    from: (table: string) => {
      const allowed = (action: "select" | "insert" | "update" | "delete") => {
        // Enforce the RLS Policies defined in migration.sql
        if (table === "incidents") {
          if (action === "select") return ["ops_manager", "security", "admin"].includes(role);
          if (action === "insert") return ["ops_manager", "security", "volunteer"].includes(role);
          if (action === "update" || action === "delete")
            return ["ops_manager", "security"].includes(role);
        }
        if (table === "zones" || table === "pois") {
          if (action === "select") return true; // public
          return role === "admin";
        }
        if (table === "telemetry_snapshots") {
          if (action === "select") return ["ops_manager", "security", "admin"].includes(role);
          return false; // service role only
        }
        if (table === "users") {
          if (action === "select")
            return ["ops_manager", "security", "admin"].includes(role) || uid !== undefined;
          return role === "admin";
        }
        return false;
      };

      return {
        select: async () => {
          if (!allowed("select")) throw new Error("PGRST301: row-level security violation");
          return { data: [{ id: "123" }], error: null };
        },
        insert: async (data: Record<string, unknown>) => {
          if (!allowed("insert")) throw new Error("PGRST301: row-level security violation");
          return { data, error: null };
        },
        update: async (data: Record<string, unknown>) => {
          if (!allowed("update")) throw new Error("PGRST301: row-level security violation");
          return { data, error: null };
        },
        delete: async () => {
          if (!allowed("delete")) throw new Error("PGRST301: row-level security violation");
          return { data: null, error: null };
        },
      };
    },
  };
}

describe("Database RLS Policies", () => {
  describe("Anonymous / Fan Access", () => {
    const client = createMockSupabaseClient("anon");

    it("can read public reference data (zones)", async () => {
      await expect(client.from("zones").select()).resolves.not.toThrow();
    });

    it("cannot read operational data (incidents)", async () => {
      await expect(client.from("incidents").select()).rejects.toThrow("PGRST301");
    });

    it("cannot insert operational data (incidents)", async () => {
      await expect(client.from("incidents").insert({})).rejects.toThrow("PGRST301");
    });

    it("cannot read telemetry", async () => {
      await expect(client.from("telemetry_snapshots").select()).rejects.toThrow("PGRST301");
    });
  });

  describe("Volunteer Access", () => {
    const client = createMockSupabaseClient("volunteer", "vol-123");

    it("cannot read operational data (incidents)", async () => {
      await expect(client.from("incidents").select()).rejects.toThrow("PGRST301");
    });

    it("can insert operational data (report incident)", async () => {
      await expect(client.from("incidents").insert({ title: "Spill" })).resolves.not.toThrow();
    });

    it("cannot update incidents", async () => {
      await expect(client.from("incidents").update({ status: "resolved" })).rejects.toThrow(
        "PGRST301",
      );
    });
  });

  describe("Ops Manager / Security Access", () => {
    const client = createMockSupabaseClient("ops_manager", "ops-123");

    it("can read operational data (incidents)", async () => {
      await expect(client.from("incidents").select()).resolves.not.toThrow();
    });

    it("can read telemetry data", async () => {
      await expect(client.from("telemetry_snapshots").select()).resolves.not.toThrow();
    });

    it("can update operational data (incidents)", async () => {
      await expect(client.from("incidents").update({ status: "resolved" })).resolves.not.toThrow();
    });

    it("cannot modify public reference data (zones)", async () => {
      await expect(client.from("zones").update({ name: "New Zone" })).rejects.toThrow("PGRST301");
    });
  });

  describe("Admin Access", () => {
    const client = createMockSupabaseClient("admin", "adm-123");

    it("can read operational data", async () => {
      await expect(client.from("incidents").select()).resolves.not.toThrow();
    });

    it("can modify public reference data (zones)", async () => {
      await expect(client.from("zones").insert({ name: "New Zone" })).resolves.not.toThrow();
    });

    it("can modify users", async () => {
      await expect(client.from("users").update({ role: "security" })).resolves.not.toThrow();
    });
  });
});
