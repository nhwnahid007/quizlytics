import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const blogs = pgTable(
  "blogs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    title: text("title"),
    slug: text("slug").unique(),
    summary: text("summary"),
    description: text("description"),
    photo: text("photo"),
    releaseDate: text("release_date"),
    postOwner: text("post_owner"),
    postOwnerPic: text("post_owner_pic"),
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
    index("blogs_user_id_idx").on(table.userId),
    index("blogs_slug_idx").on(table.slug),
  ],
);

export const blogsRelations = relations(blogs, ({ one }) => ({
  user: one(users, {
    fields: [blogs.userId],
    references: [users.id],
  }),
}));
