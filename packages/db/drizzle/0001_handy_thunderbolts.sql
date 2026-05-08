CREATE INDEX "ai_quiz_history_quiz_category_idx" ON "ai_quiz_history" USING btree ("quiz_category");--> statement-breakpoint
CREATE INDEX "link_quiz_history_link_id_idx" ON "link_quiz_history" USING btree ("link_id");--> statement-breakpoint
CREATE INDEX "manual_quiz_creator_idx" ON "manual_quiz" USING btree ("quiz_creator");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");