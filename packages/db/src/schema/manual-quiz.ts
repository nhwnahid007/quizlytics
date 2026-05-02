import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { DbJsonValue } from "./json.js";
import { users } from "./users.js";

export const manualQuiz = pgTable(
  "manual_quiz",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    quizTitle: text("quiz_title"),
    quizCategory: text("quiz_category"),
    quizStartKey: text("quiz_start_key"),
    quizCreator: text("quiz_creator"),
    quizArr: jsonb("quiz_arr").$type<DbJsonValue>(),
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
    index("manual_quiz_user_id_idx").on(table.userId),
    index("manual_quiz_start_key_idx").on(table.quizStartKey),
  ],
);

export const manualQuizRelations = relations(manualQuiz, ({ one }) => ({
  user: one(users, {
    fields: [manualQuiz.userId],
    references: [users.id],
  }),
}));
