import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { DbJsonValue } from "./json";
import { users } from "./users";

export const quizHistory = pgTable(
  "quiz_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    quizStartKey: text("quiz_start_key"),
    date: text("date"),
    linkId: text("link_id"),
    quizTitle: text("quiz_title"),
    quizCategory: text("quiz_category"),
    quizCreator: text("quiz_creator"),
    questions: jsonb("questions").$type<DbJsonValue>(),
    answers: jsonb("answers").$type<DbJsonValue>(),
    userName: text("user_name"),
    userEmail: text("user_email"),
    userProfile: text("user_profile"),
    userImg: text("user_img"),
    marks: integer("marks"),
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
    index("quiz_history_user_id_idx").on(table.userId),
    index("quiz_history_user_email_idx").on(table.userEmail),
    index("quiz_history_quiz_start_key_idx").on(table.quizStartKey),
    index("quiz_history_marks_idx").on(table.marks),
  ],
);

export const quizHistoryRelations = relations(quizHistory, ({ one }) => ({
  user: one(users, {
    fields: [quizHistory.userId],
    references: [users.id],
  }),
}));
