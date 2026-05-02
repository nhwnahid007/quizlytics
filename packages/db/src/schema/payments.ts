import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    userName: text("user_name"),
    email: text("email"),
    userEmail: text("user_email"),
    transactionId: text("transaction_id").unique(),
    amount: integer("amount"),
    date: text("date"),
    status: text("status"),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("payments_user_id_idx").on(table.userId),
    index("payments_email_idx").on(table.email),
    index("payments_user_email_idx").on(table.userEmail),
    index("payments_transaction_id_idx").on(table.transactionId),
  ],
);

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));
