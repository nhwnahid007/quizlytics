CREATE TABLE "ai_quiz_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"quiz_start_key" text,
	"date" text,
	"link_id" text,
	"quiz_title" text,
	"quiz_category" text,
	"quiz_creator" text,
	"questions" jsonb,
	"answers" jsonb,
	"user_name" text,
	"user_email" text,
	"user_profile" text,
	"user_img" text,
	"marks" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"title" text,
	"slug" text,
	"summary" text,
	"description" text,
	"photo" text,
	"release_date" text,
	"post_owner" text,
	"post_owner_pic" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blogs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"message" text,
	"rating" integer,
	"name" text,
	"email" text,
	"profile" text,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "link_quiz_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"quiz_start_key" text,
	"date" text,
	"link_id" text,
	"quiz_title" text,
	"quiz_category" text,
	"quiz_creator" text,
	"questions" jsonb,
	"answers" jsonb,
	"user_name" text,
	"user_email" text,
	"user_profile" text,
	"user_img" text,
	"marks" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "manual_quiz" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"quiz_title" text,
	"quiz_category" text,
	"quiz_start_key" text,
	"quiz_creator" text,
	"quiz_arr" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"user_name" text,
	"email" text,
	"user_email" text,
	"transaction_id" text,
	"amount" integer,
	"date" text,
	"status" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE TABLE "quiz_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"quiz_start_key" text,
	"date" text,
	"link_id" text,
	"quiz_title" text,
	"quiz_category" text,
	"quiz_creator" text,
	"questions" jsonb,
	"answers" jsonb,
	"user_name" text,
	"user_email" text,
	"user_profile" text,
	"user_img" text,
	"marks" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "authenticators" (
	"credential_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"provider_account_id" text NOT NULL,
	"credential_public_key" text NOT NULL,
	"counter" integer NOT NULL,
	"credential_device_type" text NOT NULL,
	"credential_backed_up" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticators_user_id_credential_id_pk" PRIMARY KEY("user_id","credential_id"),
	CONSTRAINT "authenticators_credential_id_unique" UNIQUE("credential_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text,
	"email_verified" timestamp with time zone,
	"image" text,
	"user_email" text,
	"password" text,
	"profile" text,
	"role" text DEFAULT 'user',
	"user_status" text DEFAULT 'Free',
	"provider" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "ai_quiz_history" ADD CONSTRAINT "ai_quiz_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_quiz_history" ADD CONSTRAINT "link_quiz_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manual_quiz" ADD CONSTRAINT "manual_quiz_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_history" ADD CONSTRAINT "quiz_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticators" ADD CONSTRAINT "authenticators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_quiz_history_user_id_idx" ON "ai_quiz_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_quiz_history_user_email_idx" ON "ai_quiz_history" USING btree ("user_email");--> statement-breakpoint
CREATE INDEX "ai_quiz_history_title_idx" ON "ai_quiz_history" USING btree ("quiz_title");--> statement-breakpoint
CREATE INDEX "blogs_user_id_idx" ON "blogs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "blogs_slug_idx" ON "blogs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "feedback_user_id_idx" ON "feedback" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "feedback_email_idx" ON "feedback" USING btree ("email");--> statement-breakpoint
CREATE INDEX "link_quiz_history_user_id_idx" ON "link_quiz_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "link_quiz_history_user_email_idx" ON "link_quiz_history" USING btree ("user_email");--> statement-breakpoint
CREATE INDEX "link_quiz_history_quiz_start_key_idx" ON "link_quiz_history" USING btree ("quiz_start_key");--> statement-breakpoint
CREATE INDEX "manual_quiz_user_id_idx" ON "manual_quiz" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "manual_quiz_start_key_idx" ON "manual_quiz" USING btree ("quiz_start_key");--> statement-breakpoint
CREATE INDEX "payments_user_id_idx" ON "payments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payments_email_idx" ON "payments" USING btree ("email");--> statement-breakpoint
CREATE INDEX "payments_user_email_idx" ON "payments" USING btree ("user_email");--> statement-breakpoint
CREATE INDEX "payments_transaction_id_idx" ON "payments" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "quiz_history_user_id_idx" ON "quiz_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "quiz_history_user_email_idx" ON "quiz_history" USING btree ("user_email");--> statement-breakpoint
CREATE INDEX "quiz_history_quiz_start_key_idx" ON "quiz_history" USING btree ("quiz_start_key");--> statement-breakpoint
CREATE INDEX "quiz_history_marks_idx" ON "quiz_history" USING btree ("marks");--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "users_email_lookup_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_user_email_lookup_idx" ON "users" USING btree ("user_email");