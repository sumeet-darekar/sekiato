ALTER TABLE "projects" DROP CONSTRAINT "projects_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "repository" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "code" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "last_scan" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "status" varchar(50) DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "issues" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "repository_url";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "updated_at";